const { app, BrowserWindow, shell, session, Menu } = require('electron')
const path = require('node:path')

const HOME_URL = process.env.FOUNDINGOS_URL || 'https://www.foundingos.com/app'
const TRUSTED_HOSTS = new Set(['foundingos.com', 'www.foundingos.com', 'core-operations-backend.vercel.app'])

function isTrusted(url) {
  try {
    const { protocol, hostname } = new URL(url)
    return protocol === 'https:' && TRUSTED_HOSTS.has(hostname)
  } catch {
    return false
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1360,
    height: 880,
    minWidth: 900,
    minHeight: 600,
    title: 'FoundingOS',
    backgroundColor: '#05060a',
    icon: path.join(__dirname, '..', 'build', 'icon.png'),
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  })

  win.once('ready-to-show', () => win.show())

  // Anything outside FoundingOS (help links, WhatsApp, payment pages) opens in the normal browser.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (isTrusted(url)) return { action: 'allow' }
    if (/^(https?|mailto|tel):/.test(url)) shell.openExternal(url)
    return { action: 'deny' }
  })
  win.webContents.on('will-navigate', (event, url) => {
    if (!isTrusted(url)) {
      event.preventDefault()
      if (/^(https?|mailto|tel):/.test(url)) shell.openExternal(url)
    }
  })

  win.webContents.on('did-fail-load', (_event, code, _desc, url, isMainFrame) => {
    if (isMainFrame && code !== -3) {
      win.loadFile(path.join(__dirname, 'offline.html'), { query: { retry: url || HOME_URL } })
    }
  })

  win.loadURL(HOME_URL)
}

app.setName('FoundingOS')

if (!app.requestSingleInstanceLock()) {
  app.quit()
} else {
  app.on('second-instance', () => {
    const [win] = BrowserWindow.getAllWindows()
    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
    }
  })

  app.whenReady().then(() => {
    // Microphone for voice notes and talking to FoundAI, only for FoundingOS itself.
    session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
      const allowed = ['media', 'clipboard-sanitized-write', 'notifications', 'fullscreen']
      callback(allowed.includes(permission) && isTrusted(webContents.getURL()))
    })

    if (process.platform === 'darwin') {
      Menu.setApplicationMenu(Menu.buildFromTemplate([
        { role: 'appMenu' },
        { role: 'editMenu' },
        { role: 'viewMenu' },
        { role: 'windowMenu' },
      ]))
    } else {
      Menu.setApplicationMenu(null)
    }

    createWindow()
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })
}

module.exports = { isTrusted }
