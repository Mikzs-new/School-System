const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktopApp', {
  platform: process.platform,
  versions: {
    electron: process.versions.electron,
    chrome: process.versions.chrome
  },
  getConfig: () => ipcRenderer.invoke('app:getConfig')
});

contextBridge.exposeInMainWorld('votingApi', {
  request: (req) => ipcRenderer.invoke('api:request', req)
});

contextBridge.exposeInMainWorld('desktopAuth', {
  lookupUserRole: (payload) => ipcRenderer.invoke('auth:lookupUserRole', payload)
});
