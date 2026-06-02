const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('fileTriage', {
  chooseFolders: (title) => ipcRenderer.invoke('choose-folders', title),
  scanFiles: (options) => ipcRenderer.invoke('scan-files', options),
  moveFile: (payload) => ipcRenderer.invoke('move-file', payload),
  trashFile: (filePath) => ipcRenderer.invoke('trash-file', filePath),
  restoreFile: (payload) => ipcRenderer.invoke('restore-file', payload),
  revealFile: (filePath) => ipcRenderer.invoke('reveal-file', filePath),
  openFile: (filePath) => ipcRenderer.invoke('open-file', filePath),
  readTextFile: (filePath) => ipcRenderer.invoke('read-text-file', filePath)
});
