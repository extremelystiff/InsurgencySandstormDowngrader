const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) return app.quit();
const path = require('node:path');
const fs = require('node:fs/promises');
const WinReg = require('winreg');
const { Tail } = require('tail');

const GAME_EXECUTABLE = 'InsurgencyClient-Win64-Shipping.exe';
const APP_ID = '581320';
const DEPOT_ID = '581322';
const REQUIRED_FREE_SPACE = 50 * 1024 * 1024 * 1024; // 50 GB

let processCheckInterval = null;
let consoleLogTail = null;
let contentLogTail = null;
let folderWatchInterval = null;

// --- File Operations & Utilities ---
async function safeRename(oldPath, newPath) { try { await fs.rename(oldPath, newPath); } catch (err) { if (err.code !== 'ENOENT') throw err; } }
async function pathExists(p) { try { await fs.access(p); return true; } catch { return false; } }

// --- Main Window Setup ---
function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1000, height: 1200,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true, nodeIntegration: false,
        }
    });
    mainWindow.loadFile('index.html');
    return mainWindow;
}

// --- App Initialization ---
async function initialize() {
    const Store = (await import('electron-store')).default;
    const psList = (await import('ps-list')).default;
    const checkDiskSpace = (await import('check-disk-space')).default;
    
    const store = new Store();
    const mainWindow = createWindow();

    // --- Core Functions ---
    async function revertToLive(sandstormPath) {
        const liveBackupPath = path.join(path.dirname(sandstormPath), 'sandstorm_live');
        try {
            await fs.rm(sandstormPath, { recursive: true, force: true });
            await safeRename(liveBackupPath, sandstormPath);
            return { success: true, message: 'Live version has been restored.' };
        } catch (err) {
            return { success: false, message: `Revert failed: ${err.message}` };
        }
    }

    function startProcessTracking(sandstormPath) {
        if (processCheckInterval) clearInterval(processCheckInterval);

        processCheckInterval = setInterval(async () => {
            const processList = await psList();
            const gameIsRunning = processList.some(p => p.name === GAME_EXECUTABLE);

            if (!gameIsRunning) {
                clearInterval(processCheckInterval);
                processCheckInterval = null;
                console.log('Game has closed. Reverting folders...');
                const result = await revertToLive(sandstormPath);
                mainWindow.webContents.send('revert-complete', result);
            }
        }, 5000);
    }

    function stopAllMonitoring() {
        if (consoleLogTail) { consoleLogTail.unwatch(); consoleLogTail = null; }
        if (contentLogTail) { contentLogTail.unwatch(); contentLogTail = null; }
        if (folderWatchInterval) { clearInterval(folderWatchInterval); folderWatchInterval = null; }
    }

    function startMonitoring(steamPath, targetVersionFolder) {
        stopAllMonitoring();
        
        const consoleLogPath = path.join(steamPath, 'logs', 'console_log.txt');
        const contentLogPath = path.join(steamPath, 'logs', 'content_log.txt');

        try {
            consoleLogTail = new Tail(consoleLogPath, { fromBeginning: true, follow: true });
            consoleLogTail.on('line', (line) => {
                const startMatch = line.match(/Downloading depot \d+ \((\d+) files, ([\d\.]+) (\w+)\)/);
                if (startMatch) {
                    const totalFiles = parseInt(startMatch[1], 10);
                    mainWindow.webContents.send('download-update', { type: 'start', totalFiles });
                    
                    folderWatchInterval = setInterval(async () => {
                        try {
                            const files = await fs.readdir(targetVersionFolder);
                            mainWindow.webContents.send('download-update', { type: 'progress', currentFiles: files.length });
                        } catch {}
                    }, 2000);
                }

                const completeMatch = line.match(/Depot download complete/);
                if (completeMatch) {
                    stopAllMonitoring();
                    mainWindow.webContents.send('download-update', { type: 'complete' });
                }
            });

            contentLogTail = new Tail(contentLogPath, { fromBeginning: true, follow: true });
            contentLogTail.on('line', (line) => {
                const rateMatch = line.match(/Current download rate: ([\d.]+) Mbps/);
                if (rateMatch) {
                    mainWindow.webContents.send('download-update', { type: 'rate', speed: parseFloat(rateMatch[1]) });
                }
            });

        } catch (error) {
            console.error('Failed to start log monitoring:', error);
            mainWindow.webContents.send('download-update', { type: 'error', message: 'Could not find Steam log files.' });
        }
    }

    // --- IPC Handlers ---
    ipcMain.handle('load-settings', () => store.get('settings'));
    ipcMain.on('save-settings', (event, settings) => store.set('settings', settings));
    ipcMain.handle('get-default-path', () => path.join(path.dirname(app.getPath('exe')), 'Sandstorm_Downgrades'));
    
    ipcMain.handle('get-initial-paths', async () => {
        const settings = store.get('settings') || {};
        if (settings.steamPath && settings.sandstormPath && await pathExists(settings.sandstormPath)) {
            return { steamPath: settings.steamPath, sandstormPath: settings.sandstormPath, depotDownloadPath: path.join(settings.steamPath, 'steamapps', 'content', `app_${APP_ID}`, `depot_${DEPOT_ID}`) };
        }

        let steamPath;
        try {
            const regKey = new WinReg({ hive: 'HKCU', key: '\\Software\\Valve\\Steam' });
            const item = await new Promise((res, rej) => regKey.get('SteamPath', (e, i) => e ? rej(e) : res(i)));
            steamPath = item.value.replace(/\//g, '\\');
        } catch {
            return { error: 'Could not find Steam via Registry. Please set paths manually.' };
        }
        
        const libraryFoldersVdf = path.join(steamPath, 'steamapps', 'libraryfolders.vdf');
        const searchPaths = [steamPath];
        try {
            const vdfContent = await fs.readFile(libraryFoldersVdf, 'utf8');
            const pathRegex = /"path"\s+"(.+?)"/g;
            let match;
            while ((match = pathRegex.exec(vdfContent)) !== null) {
                searchPaths.push(match[1].replace(/\\\\/g, '\\'));
            }
        } catch {}

        for (const libraryPath of searchPaths) {
            const sandstormPath = path.join(libraryPath, 'steamapps', 'common', 'sandstorm');
            if (await pathExists(sandstormPath)) {
                return { steamPath, sandstormPath, depotDownloadPath: path.join(steamPath, 'steamapps', 'content', `app_${APP_ID}`, `depot_${DEPOT_ID}`) };
            }
        }

        return { error: 'Auto-detection failed. Please set Steam and Sandstorm paths manually.' };
    });

    ipcMain.handle('select-folder', async () => {
        const { canceled, filePaths } = await dialog.showOpenDialog({ properties: ['openDirectory'] });
        return canceled ? null : filePaths[0];
    });

    // New IPC handler to open the Steam console
    ipcMain.on('open-steam-console', () => {
        shell.openExternal('steam://open/console');
    });

    ipcMain.handle('scan-storage-folder', async (event, storagePath) => {
        try {
            const entries = await fs.readdir(storagePath, { withFileTypes: true });
            return entries.filter(e => e.isDirectory()).map(e => e.name);
        } catch { return []; }
    });

    ipcMain.handle('prepare-download', async (event, { storagePath, versionName, steamPath, depotDownloadPath }) => {
        try {
            const diskSpace = await checkDiskSpace(storagePath);
            if (diskSpace.free < REQUIRED_FREE_SPACE) {
                return { success: false, message: `Not enough disk space! Requires at least 50 GB, but only ${(diskSpace.free / 1e9).toFixed(2)} GB is available at that location.` };
            }
        } catch (err) {
            return { success: false, message: `Could not check disk space. Error: ${err.message}` };
        }

        const targetVersionFolder = path.join(storagePath, versionName);
        const oldDepotPath = `${depotDownloadPath}_old_${Date.now()}`;
        try {
            await fs.mkdir(targetVersionFolder, { recursive: true });
            await safeRename(depotDownloadPath, oldDepotPath);
            await fs.mkdir(path.dirname(depotDownloadPath), { recursive: true });
            await fs.symlink(targetVersionFolder, depotDownloadPath, 'junction');
            
            startMonitoring(steamPath, targetVersionFolder);
            
            return { success: true, message: `Ready for download to ${targetVersionFolder}.` };
        } catch (err) {
            return { success: false, message: `ERROR: ${err.message}. Run as Admin?` };
        }
    });

    ipcMain.handle('play-version', async (event, { storagePath, versionName, sandstormPath }) => {
        if (processCheckInterval) return { success: false, message: "A game is already being tracked. Please restore first." };
        const liveBackupPath = path.join(path.dirname(sandstormPath), 'sandstorm_live');
        const targetVersionFolder = path.join(storagePath, versionName);
        try {
            await safeRename(sandstormPath, liveBackupPath);
            await fs.symlink(targetVersionFolder, sandstormPath, 'junction');
        } catch (err) {
            await safeRename(liveBackupPath, sandstormPath); 
            return { success: false, message: `Activation failed: ${err.message}. State restored.` };
        }
        shell.openExternal(`steam://run/${APP_ID}`);
        startProcessTracking(sandstormPath);
        return { success: true, message: `Activated ${versionName}, launching game... Will revert automatically when game closes.` };
    });

    ipcMain.handle('restore-live-manual', async (event, { sandstormPath }) => {
        if (processCheckInterval) {
            clearInterval(processCheckInterval);
            processCheckInterval = null;
        }
        return await revertToLive(sandstormPath);
    });

    ipcMain.on('stop-log-monitoring', stopAllMonitoring);
}

// --- App Lifecycle ---
app.whenReady().then(initialize);
app.on('window-all-closed', () => process.platform !== 'darwin' && app.quit());
app.on('activate', () => BrowserWindow.getAllWindows().length === 0 && createWindow());