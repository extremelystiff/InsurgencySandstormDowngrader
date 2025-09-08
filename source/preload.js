const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  loadSettings: () => ipcRenderer.invoke('load-settings'),
  saveSettings: (settings) => ipcRenderer.send('save-settings', settings),
  getInitialPaths: () => ipcRenderer.invoke('get-initial-paths'),
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  scanStorageFolder: (storagePath) => ipcRenderer.invoke('scan-storage-folder', storagePath),
  getDefaultPath: () => ipcRenderer.invoke('get-default-path'),
  prepareDownload: (data) => ipcRenderer.invoke('prepare-download', data),
  playVersion: (data) => ipcRenderer.invoke('play-version', data),
  restoreLiveManual: (data) => ipcRenderer.invoke('restore-live-manual', data),
  stopLogMonitoring: () => ipcRenderer.send('stop-log-monitoring'),
  // Expose the new function
  openSteamConsole: () => ipcRenderer.send('open-steam-console'),
  onRevertComplete: (callback) => ipcRenderer.on('revert-complete', (_event, value) => callback(value)),
  onDownloadUpdate: (callback) => ipcRenderer.on('download-update', (_event, value) => callback(value)),
});