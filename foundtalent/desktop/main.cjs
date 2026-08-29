const { app, BrowserWindow } = require('electron')
const fs = require('node:fs')
const http = require('node:http')
const path = require('node:path')

const isDev = process.argv.includes('--dev')
const contentTypes = { '.css': 'text/css', '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml' }

function serveFrontend(window) {
  const root = path.join(process.resourcesPath, 'frontend')
  const server = http.createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname)
    const requested = path.resolve(root, pathname === '/' ? 'index.html' : pathname.slice(1))
    if (!requested.startsWith(`${root}${path.sep}`)) { response.writeHead(403).end(); return }
    const file = fs.existsSync(requested) && fs.statSync(requested).isFile() ? requested : path.extname(requested) ? null : path.join(root, 'index.html')
    if (!file) { response.writeHead(404).end(); return }
    response.setHeader('Content-Type', contentTypes[path.extname(file)] || 'application/octet-stream')
    fs.createReadStream(file).pipe(response)
  })
  server.listen(0, '127.0.0.1', () => window.loadURL(`http://127.0.0.1:${server.address().port}`))
  app.once('before-quit', () => server.close())
}

function createWindow() {
  const window = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 960,
    minHeight: 640,
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true },
  })
  window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }))
  if (isDev) return window.loadURL(process.env.DESKTOP_DEV_URL || 'http://localhost:5250')
  return serveFrontend(window)
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow() })
})
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() })
