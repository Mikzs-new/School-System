const { app, BrowserWindow, ipcMain } = require('electron');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const isDev = process.env.NODE_ENV === 'development';
const ALLOWED_METHODS = new Set(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);
let dbPool = null;

function loadEnv() {
  const envPath = path.join(__dirname, '..', '..', '.env');
  if (!fs.existsSync(envPath)) return;

  fs.readFileSync(envPath, 'utf8')
    .split(/\r?\n/)
    .forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) return;

      const [key, ...rest] = trimmed.split('=');
      const name = key.trim();
      if (!name || process.env[name]) return;
      process.env[name] = rest.join('=').trim();
    });
}

function getApiUrl() {

  return (
    process.env.API_URL ||

    process.env.VITE_API_URL ||

    'http://127.0.0.1:8000/api/v1'

  ).replace(/\/+$/, '');
}

function assertAllowedBackend(baseURL) {
  const configured = new URL(getApiUrl());
  const requested = new URL(baseURL || getApiUrl());

  if (configured.origin !== requested.origin) {
    throw new Error(`Blocked request to unconfigured backend: ${requested.origin}`);
  }
}

function getPool() {
  if (dbPool) return dbPool;

  const { DB_HOST, DB_USER, DB_NAME, DB_PASSWORD, DB_PORT } = process.env;
  if (!DB_HOST || !DB_USER || !DB_NAME) return null;

  dbPool = new Pool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: Number(DB_PORT || 5432),
    ssl: { rejectUnauthorized: false }
  });

  return dbPool;
}

function resolveRole(user) {
  if (user?.is_superuser) return 'admin';
  if (user?.is_staff) return 'staff';
  return 'student';
}

ipcMain.handle('app:getConfig', async () => ({
  apiUrl: getApiUrl()
}));

ipcMain.handle('api:request', async (_event, req) => {
  const method = String(req?.method || 'GET').toUpperCase();
  if (!ALLOWED_METHODS.has(method)) throw new Error('Unsupported HTTP method.');

  try {
    const baseURL = req.baseURL || getApiUrl();
    assertAllowedBackend(baseURL);

    const res = await axios.request({
      baseURL,
      url: req.url,
      method,
      data: req.data,
      params: req.params,
      headers: req.headers,
      timeout: req.timeout || 15000
    });

    return {
      data: res.data,
      status: res.status,
      statusText: res.statusText,
      headers: res.headers
    };
  } catch (err) {
    return {
      error: true,
      message: err.message,
      response: err.response
        ? { data: err.response.data, status: err.response.status, statusText: err.response.statusText }
        : null
    };
  }
});

ipcMain.handle('auth:lookupUserRole', async (_event, payload) => {
  const pool = getPool();
  if (!pool) return null;

  const username = String(payload?.username || '').trim();
  const parsedUserId = Number(payload?.userId);
  const userId = Number.isInteger(parsedUserId) ? parsedUserId : null;
  if (!username && !userId) return null;

  try {
    const result = await pool.query(
      `SELECT id, username, first_name, last_name, email, is_staff, is_superuser, is_active
       FROM auth_user
       WHERE ($1::integer IS NOT NULL AND id = $1::integer)
          OR ($2::text <> '' AND lower(username) = lower($2::text))
       LIMIT 1`,
      [userId, username]
    );

    const user = result.rows[0];
    if (!user) return null;
    return { ...user, role: resolveRole(user) };
  } catch (err) {
    console.error('DB role lookup failed:', err.message);
    return null;
  }
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1180,
    height: 780,
    minWidth: 900,
    minHeight: 620,
    show: false,
    backgroundColor: '#f6f7f9',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  win.once('ready-to-show', () => win.show());

  if (isDev) {
    win.loadURL('http://127.0.0.1:5174');
    win.webContents.openDevTools({ mode: 'detach' });
  } else {
    win.loadFile(path.join(__dirname, '..', '..', 'dist', 'renderer', 'index.html'));
  }
}

loadEnv();

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
