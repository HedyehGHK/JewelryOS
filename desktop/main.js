// JewelryOS desktop shell: starts the bundled ASP.NET Core server in the background and shows the app in its own window.
const { app, BrowserWindow, Menu, dialog, shell } = require('electron');
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const isDev = !app.isPackaged;
const dataDir = path.join(app.getPath('userData'), 'data');
const logDir = path.join(app.getPath('userData'), 'logs');
const configPath = path.join(app.getPath('userData'), 'config.json');

/** Defaults can be changed in %APPDATA%\JewelryOS\config.json */
function loadConfig() {
  const defaults = { port: 5080, allowNetwork: true };
  try { return { ...defaults, ...JSON.parse(fs.readFileSync(configPath, 'utf8')) }; }
  catch {
    try { fs.mkdirSync(path.dirname(configPath), { recursive: true }); fs.writeFileSync(configPath, JSON.stringify(defaults, null, 2)); } catch { /* ignore */ }
    return defaults;
  }
}

const config = loadConfig();
const baseUrl = `http://127.0.0.1:${config.port}`;
let server = null;
let mainWindow = null;
let quitting = false;

function log(line) {
  try {
    fs.mkdirSync(logDir, { recursive: true });
    fs.appendFileSync(path.join(logDir, 'jewelryos.log'), `[${new Date().toISOString()}] ${line}\n`);
  } catch { /* ignore */ }
}

function lanAddresses() {
  return Object.values(os.networkInterfaces()).flat()
    .filter(i => i && i.family === 'IPv4' && !i.internal)
    .map(i => `http://${i.address}:${config.port}`);
}

async function isServerUp() {
  try {
    const r = await fetch(`${baseUrl}/api/health`, { signal: AbortSignal.timeout(1500) });
    return r.ok;
  } catch { return false; }
}

function startServer() {
  fs.mkdirSync(dataDir, { recursive: true });
  const host = config.allowNetwork ? '0.0.0.0' : '127.0.0.1';
  // --urls on the command line wins over the "Urls" value in appsettings.json.
  const urls = ['--urls', `http://${host}:${config.port}`];
  const env = {
    ...process.env,
    ASPNETCORE_ENVIRONMENT: isDev ? 'Development' : 'Production',
    ConnectionStrings__Default: `Data Source=${path.join(dataDir, 'jewelryos.db')}`,
  };

  const packagedDir = isDev ? path.join(__dirname, 'backend') : path.join(process.resourcesPath, 'backend');
  const exe = path.join(packagedDir, process.platform === 'win32' ? 'JewelryOS.Api.exe' : 'JewelryOS.Api');

  let cmd, args, cwd;
  if (fs.existsSync(exe)) {
    cmd = exe; args = [...urls]; cwd = packagedDir; // cwd = content root, so wwwroot is found
  } else if (isDev) {
    // Development fallback: run the backend project directly with the .NET SDK.
    cwd = path.join(__dirname, '..', 'backend', 'JewelryOS.Api');
    cmd = 'dotnet'; args = ['run', '--no-launch-profile', '--', ...urls];
  } else {
    throw new Error('فایل سرور برنامه پیدا نشد: ' + exe);
  }

  log(`starting server: ${cmd} ${args.join(' ')} (cwd ${cwd})`);
  server = spawn(cmd, args, { cwd, env, windowsHide: true });
  const out = fs.createWriteStream(path.join(logDir, 'server.log'), { flags: 'a' });
  server.stdout.pipe(out);
  server.stderr.pipe(out);
  server.on('exit', code => {
    log(`server exited with code ${code}`);
    server = null;
    if (!quitting) {
      dialog.showErrorBox('JewelryOS', `سرور برنامه متوقف شد (کد ${code}).\nجزئیات در فایل:\n${path.join(logDir, 'server.log')}`);
      app.quit();
    }
  });
}

async function waitForServer(timeoutMs = 90000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (!server) return false;
    if (await isServerUp()) return true;
    await new Promise(r => setTimeout(r, 500));
  }
  return false;
}

function buildMenu() {
  const template = [
    {
      label: 'برنامه',
      submenu: [
        { label: 'بارگذاری مجدد', accelerator: 'F5', click: () => mainWindow?.webContents.reload() },
        { label: 'چاپ صفحه', accelerator: 'CmdOrCtrl+P', click: () => mainWindow?.webContents.print() },
        { type: 'separator' },
        { label: 'بزرگ‌نمایی', accelerator: 'CmdOrCtrl+=', role: 'zoomIn' },
        { label: 'کوچک‌نمایی', accelerator: 'CmdOrCtrl+-', role: 'zoomOut' },
        { label: 'اندازه عادی', accelerator: 'CmdOrCtrl+0', role: 'resetZoom' },
        { label: 'تمام‌صفحه', accelerator: 'F11', role: 'togglefullscreen' },
        { type: 'separator' },
        { label: 'خروج', role: 'quit' },
      ],
    },
    {
      label: 'راهنما',
      submenu: [
        {
          label: 'آدرس برای موبایل و سایر کامپیوترهای مغازه',
          click: () => dialog.showMessageBox(mainWindow, {
            type: 'info', title: 'دسترسی از شبکه مغازه',
            message: config.allowNetwork
              ? 'در مرورگر دستگاه‌های دیگرِ وصل به همین مودم، یکی از این آدرس‌ها را باز کنید:\n\n' + (lanAddresses().join('\n') || '(شبکه‌ای پیدا نشد)')
              : 'دسترسی از شبکه خاموش است (allowNetwork در config.json).',
          }),
        },
        { label: 'باز کردن پوشه اطلاعات (پایگاه داده)', click: () => shell.openPath(dataDir) },
        { label: 'باز کردن پوشه گزارش خطاها', click: () => shell.openPath(logDir) },
        ...(isDev ? [{ type: 'separator' }, { label: 'DevTools', accelerator: 'F12', role: 'toggleDevTools' }] : []),
        { type: 'separator' },
        { label: `نسخه ${app.getVersion()}`, enabled: false },
      ],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1360, height: 860, minWidth: 900, minHeight: 600,
    title: 'JewelryOS', backgroundColor: '#2b2118', show: false,
    autoHideMenuBar: true, // menu appears with the Alt key; shortcuts (F5, Ctrl+P, zoom) still work
    icon: path.join(__dirname, 'build', 'icon.png'),
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true },
  });
  mainWindow.once('ready-to-show', () => { mainWindow.maximize(); mainWindow.show(); });
  mainWindow.on('closed', () => { mainWindow = null; });

  // Invoice PDFs open in their own app window; everything else external goes to the system browser.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith(baseUrl)) {
      return { action: 'allow', overrideBrowserWindowOptions: { width: 900, height: 1000, autoHideMenuBar: true, title: 'فاکتور', webPreferences: { sandbox: true } } };
    }
    shell.openExternal(url);
    return { action: 'deny' };
  });
  mainWindow.webContents.on('will-navigate', (e, url) => {
    if (!url.startsWith(baseUrl) && !url.startsWith('file:')) { e.preventDefault(); shell.openExternal(url); }
  });

  await mainWindow.loadFile(path.join(__dirname, 'loading.html'));

  if (await isServerUp()) {
    // Something already answers on this port (e.g. another copy run from run.bat) — refuse to share it silently.
    dialog.showErrorBox('JewelryOS', `پورت ${config.port} از قبل در حال استفاده است.\nاگر نسخه دیگری از برنامه (مثلاً run.bat) باز است، آن را ببندید و دوباره امتحان کنید.`);
    app.quit();
    return;
  }

  try { startServer(); } catch (e) { dialog.showErrorBox('JewelryOS', String(e.message || e)); app.quit(); return; }

  if (await waitForServer()) {
    await mainWindow.loadURL(baseUrl);
  } else if (!quitting) {
    dialog.showErrorBox('JewelryOS', `سرور برنامه بالا نیامد.\nجزئیات در فایل:\n${path.join(logDir, 'server.log')}`);
    app.quit();
  }
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) { if (mainWindow.isMinimized()) mainWindow.restore(); mainWindow.focus(); }
  });
  app.whenReady().then(() => { buildMenu(); createWindow(); });
  app.on('window-all-closed', () => app.quit());
  app.on('before-quit', () => {
    quitting = true;
    if (server) { log('stopping server'); server.kill(); }
  });
}
