// --- All version options for the dropdown ---
const versions = { "711852640520621954": "1.14", "3458666526935884805": "1.13.Hotfix", "8092396578978848794": "1.13", "5986464693732242887": "1.12.Hotfix2", "4871146283128373881": "1.12.Hotfix1", "6829171027828238491": "1.12", "4533143795067422411": "1.11.Hotfix6", "4399216738472684023": "1.11.Hotfix5", "7382926159525707633": "1.11.Hotfix4", "187196897474210673": "1.11.Hotfix3", "7439114860999596478": "1.11.Hotfix2", "8844119457875109523": "1.11.Hotfix1", "7012079460285536988": "1.11", "2006881810008027571": "1.10.Hotfix6", "214177622852644981": "1.10.Hotfix5", "1045813576702319803": "1.10.Hotfix4", "7325052389182588217": "1.10.Hotfix3", "303952586483603080": "1.10.Hotfix2.5", "2450329360460312166": "1.10.Hotfix2", "6485000026124667854": "1.10.Hotfix1", "3243532880257426731": "1.10", "1088025155821945216": "1.9.2.Hotfix2", "9086410089138469140": "1.9.2.Hotfix1", "8334976934954086030": "1.9.2", "7584863291271290147": "1.9.1.Hotfix4", "2729083608456298822": "1.9.1.Hotfix3", "1775289740822761452": "1.9.1.Hotfix2.5", "4914610732870329398": "1.9.1.Hotfix2", "6670957732884402247": "1.9.1.Hotfix1", "5726941608789056878": "1.9.1", "6463337868987152237": "1.9.Hotfix6", "2877788480249548103": "1.9.Hotfix5", "3707872763158257990": "1.9.Hotfix4", "5903502488140004374": "1.9.Hotfix3", "9025549973775273709": "1.9.Hotfix2", "1713003361944811328": "1.9.Hotfix1", "6264937784337881272": "1.9", "787582876162366074": "1.8.1", "4109103438259507398": "1.8.Hotfix4", "8519301017775042659": "1.8.Hotfix3", "5536306406543471367": "1.8.Hotfix2", "9201705553858300830": "1.8.Hotfix1", "2723660525937518784": "1.8", "710459789755486682": "1.7.1Hotfix2", "1133192030284822537": "1.7.1.Hotfix1", "1978372929896113254": "1.7.1", "5196214492480799100": "1.7.Hotfix5", "8551810919919402267": "1.7.Hotfix4", "6863766911579724490": "1.7.Hotfix3", "7955879386472886167": "1.7.Hotfix2", "3012192512914207454": "1.7.Hotfix1", "454998146682676571": "1.7", "4266804895388485623": "1.6.3", "7287445481278679392": "1.6.2", "2034095608314520563": "1.6.1.Hotfix", "3921927152262922604": "1.6.1", "7847845268283935790": "1.6.Hotfix2", "2761663070421646425": "1.6.Hotfix1", "6572115972218114923": "1.6", "852780598066674912": "1.5.Hotfix5", "2511179348630256170": "1.5.Hotfix4", "232934329978532664": "1.5.Hotfix3", "1835978315453844649": "1.5.Hotfix2", "1648777534570350320": "1.5.Hotfix1", "7388630325061410720": "1.5", "2269144251291045229": "1.4.2.Hotfix3", "124039388153563814": "1.4.2.Hotfix1", "7516375773592346679": "1.4.2.Hotfix", "3176769886884186040": "1.4.2", "7362143051755135924": "1.4.1", "6181860716510471882": "1.4.Hotfix3", "2926158819493651599": "1.4.Hotfix2", "6036042970382503178": "1.4.Hotfix1", "1323034449099701970": "1.4", "784569742911593091": "1.3.2", "1522554223434535602": "1.3.Hotfix9", "7601179095701261530": "1.3.Hotfix8", "6713801361500850308": "1.3.Hotfix7", "506999290891349986": "1.3.Hotfix6", "7921442344668730597": "1.3.Hotfix5", "2148521915067304173": "1.3.Hotfix4", "6308999349504179373": "1.3.Hotfix3", "8128108979843632926": "1.3.Hotfix2", "9054620642247097560": "1.3.Hotfix1", "2331825406693558379": "1.3", "6403852170718626390": "1.2.Hotfix4", "7438549529557820477": "1.2.Hotfix3", "6981138844248411630": "1.2.Hotfix2", "6416001038180394959": "1.2.Hotfix1", "7595476231582786872": "1.2", "7657420739371707334": "1.1.4.Hotfix", "4177236473352632638": "1.1.4", "3215773350402364230": "1.1.3", "6688149793229305402": "1.1.2", "6705546614430059198": "1.1.1", "2896223945223913834": "1.1.0.1", "8732291446976397467": "1.1", "6685654127200965218": "1.0.2", "5484915775999956526": "1.0.1", "5274979863881698948": "1.0.0" };
const APP_ID = '581320'; const DEPOT_ID = '581322';

let steamPaths = {}; let settings = {}; let isGameRunning = false; let totalFilesToDownload = 0;

const el = {
    storagePathDisplay: document.getElementById('storagePathDisplay'), sandstormPathDisplay: document.getElementById('sandstormPathDisplay'), steamPathDisplay: document.getElementById('steamPathDisplay'), selectStorageBtn: document.getElementById('selectStorageBtn'), selectSteamBtn: document.getElementById('selectSteamBtn'), selectSandstormBtn: document.getElementById('selectSandstormBtn'), versionSelect: document.getElementById('versionSelect'), prepareDownloadBtn: document.getElementById('prepareDownloadBtn'), copyCommandBtn: document.getElementById('copyCommandBtn'), openConsoleBtn: document.getElementById('openConsoleBtn'), existingVersionsSelect: document.getElementById('existingVersionsSelect'), playBtn: document.getElementById('playBtn'), restoreBtn: document.getElementById('restoreBtn'), log: document.getElementById('log'), overrideSection: document.getElementById('override-section'), progressSection: document.getElementById('progress-section'), progressLabel: document.getElementById('progress-label'), progressBar: document.getElementById('progress-bar'),
};

const addToLog = (message, type = 'info') => {
    const entry = document.createElement('div');
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    entry.classList.add('log-entry', `log-${type}`);
    el.log.appendChild(entry); el.log.scrollTop = el.log.scrollHeight;
};

const updateButtonStates = () => {
    const storagePathSet = !!settings.storagePath;
    const gamePathsSet = !!steamPaths.sandstormPath;
    const downloadedVersionSelected = el.existingVersionsSelect.value && el.existingVersionsSelect.value !== 'none';
    
    el.prepareDownloadBtn.disabled = !storagePathSet || !gamePathsSet || isGameRunning;
    // Keep copy/open console buttons disabled until 'prepare' is successful
    // el.copyCommandBtn.disabled = !storagePathSet || !gamePathsSet || isGameRunning;
    // el.openConsoleBtn.disabled = !storagePathSet || !gamePathsSet || isGameRunning;
    el.playBtn.disabled = !storagePathSet || !gamePathsSet || !downloadedVersionSelected || isGameRunning;
    el.restoreBtn.disabled = !gamePathsSet; // Can always restore if paths are set
};

const populateVersionDropdown = () => Object.entries(versions).forEach(([id, name]) => el.versionSelect.add(new Option(name, id)));

const scanAndPopulateExistingVersions = async () => {
    if (!settings.storagePath) return;
    const versions = await window.electronAPI.scanStorageFolder(settings.storagePath);
    el.existingVersionsSelect.innerHTML = '';
    if (versions.length > 0) {
        el.existingVersionsSelect.disabled = false;
        el.existingVersionsSelect.add(new Option('Select a version...', 'none'));
        versions.forEach(v => el.existingVersionsSelect.add(new Option(v, v)));
        addToLog(`Found ${versions.length} downloaded version(s).`, 'success');
    } else {
        el.existingVersionsSelect.disabled = true;
        el.existingVersionsSelect.add(new Option('No versions found...', 'none'));
    }
};

const saveAndApplySettings = async (newSettings) => {
    settings = { ...settings, ...newSettings };
    window.electronAPI.saveSettings(settings);
    if (settings.storagePath) el.storagePathDisplay.textContent = settings.storagePath;
    if (settings.steamPath) el.steamPathDisplay.textContent = settings.steamPath;
    if (settings.sandstormPath) el.sandstormPathDisplay.textContent = settings.sandstormPath;
    await scanAndPopulateExistingVersions();
};

async function initializeApp() {
    populateVersionDropdown();
    addToLog('App started. Initializing...');
    
    const loadedSettings = (await window.electronAPI.loadSettings()) || {};
    const pathResult = await window.electronAPI.getInitialPaths();
    
    settings = loadedSettings;
    if (!settings.storagePath) {
        addToLog('No storage path set. Using default location near the app.', 'warning');
        const defaultPath = await window.electronAPI.getDefaultPath();
        settings.storagePath = defaultPath;
        window.electronAPI.saveSettings(settings);
    }
    
    if (pathResult.error) {
        addToLog(pathResult.error, 'error');
        el.overrideSection.style.display = 'block';
        el.sandstormPathDisplay.textContent = 'Not Found';
    } else {
        steamPaths = pathResult;
        el.sandstormPathDisplay.textContent = steamPaths.sandstormPath;
        addToLog(`Steam & Sandstorm paths detected successfully.`, 'success');
    }

    el.storagePathDisplay.textContent = settings.storagePath;
    if (settings.steamPath) el.steamPathDisplay.textContent = settings.steamPath;
    if (settings.sandstormPath) el.sandstormPathDisplay.textContent = settings.sandstormPath;
    
    await scanAndPopulateExistingVersions();
    updateButtonStates();
}

document.addEventListener('DOMContentLoaded', initializeApp);

window.electronAPI.onRevertComplete((result) => {
    addToLog(result.message, result.success ? 'success' : 'error');
    isGameRunning = false;
    el.playBtn.textContent = 'Play Selected Version';
    updateButtonStates();
});

window.electronAPI.onDownloadUpdate((update) => {
    el.progressSection.style.display = 'block';
    switch (update.type) {
        case 'start':
            totalFilesToDownload = update.totalFiles;
            el.progressLabel.textContent = `Download started... (0 / ${totalFilesToDownload} files)`;
            el.progressBar.value = 0; el.progressBar.max = totalFilesToDownload; break;
        case 'progress':
            el.progressBar.value = update.currentFiles;
            el.progressLabel.textContent = `Downloading... (${update.currentFiles} / ${totalFilesToDownload} files)`; break;
        case 'rate':
            const currentText = el.progressLabel.textContent.split(' | ')[0];
            el.progressLabel.textContent = `${currentText} | ${update.speed.toFixed(2)} Mbps`; break;
        case 'complete':
            el.progressLabel.textContent = 'Download Complete!';
            el.progressBar.value = el.progressBar.max;
            addToLog('Steam depot download finished. Re-scanning storage...', 'success');
            scanAndPopulateExistingVersions();
            setTimeout(() => { el.progressSection.style.display = 'none'; }, 5000); break;
        case 'error':
            addToLog(`Download monitor error: ${update.message}`, 'error'); break;
    }
});

el.selectStorageBtn.addEventListener('click', async () => {
    const selectedPath = await window.electronAPI.selectFolder();
    if (selectedPath) {
        await saveAndApplySettings({ storagePath: selectedPath });
        updateButtonStates();
    }
});

el.selectSteamBtn.addEventListener('click', async () => {
    const selectedPath = await window.electronAPI.selectFolder();
    if (selectedPath) {
        await saveAndApplySettings({ steamPath: selectedPath });
        updateButtonStates();
    }
});

el.selectSandstormBtn.addEventListener('click', async () => {
    const selectedPath = await window.electronAPI.selectFolder();
    if (selectedPath) {
        await saveAndApplySettings({ sandstormPath: selectedPath });
        updateButtonStates();
    }
});

el.prepareDownloadBtn.addEventListener('click', async () => {
    const versionName = el.versionSelect.options[el.versionSelect.selectedIndex].text;
    const manifestId = el.versionSelect.value;
    addToLog(`Preparing to download version ${versionName}...`);
    
    // Disable all download buttons during preparation
    el.prepareDownloadBtn.disabled = true;
    el.copyCommandBtn.disabled = true;
    el.openConsoleBtn.disabled = true;

    const result = await window.electronAPI.prepareDownload({
        storagePath: settings.storagePath, versionName, manifestId,
        steamPath: steamPaths.steamPath, depotDownloadPath: steamPaths.depotDownloadPath
    });
    
    addToLog(result.message, result.success ? 'success' : 'error');
    if (result.success) {
        addToLog('Preparation successful. You can now proceed to Step 2 and 3.', 'warning');
        el.copyCommandBtn.disabled = false;
        el.openConsoleBtn.disabled = false;
        el.progressSection.style.display = 'block';
        el.progressLabel.textContent = 'Monitoring Steam for download to start...';
        el.progressBar.removeAttribute('value');
    } else {
        // Re-enable the prepare button if it failed
        updateButtonStates();
    }
});

el.copyCommandBtn.addEventListener('click', () => {
    const manifestId = el.versionSelect.value;
    const command = `download_depot ${APP_ID} ${DEPOT_ID} ${manifestId}`;
    navigator.clipboard.writeText(command);
    addToLog(`Copied to clipboard: "${command}"`);
});

el.openConsoleBtn.addEventListener('click', () => {
    addToLog('Opening Steam console...');
    window.electronAPI.openSteamConsole();
});


el.playBtn.addEventListener('click', async () => {
    const versionName = el.existingVersionsSelect.value;
    addToLog(`Activating version ${versionName} & launching...`);
    isGameRunning = true;
    el.playBtn.textContent = 'Playing...';
    updateButtonStates();
    el.prepareDownloadBtn.disabled = true; // Also disable prepare while playing
    const result = await window.electronAPI.playVersion({
        storagePath: settings.storagePath, versionName, sandstormPath: steamPaths.sandstormPath
    });
    addToLog(result.message, result.success ? 'success' : 'error');
    if (!result.success) {
        isGameRunning = false;
        el.playBtn.textContent = 'Play Selected Version';
        updateButtonStates();
    }
});

el.restoreBtn.addEventListener('click', async () => {
    addToLog('Attempting to manually restore live version...');
    window.electronAPI.stopLogMonitoring();
    const result = await window.electronAPI.restoreLiveManual({ sandstormPath: steamPaths.sandstormPath });
    addToLog(result.message, result.success ? 'success' : 'error');
});

el.existingVersionsSelect.addEventListener('change', updateButtonStates);