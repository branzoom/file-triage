const { app, BrowserWindow, dialog, ipcMain, shell } = require('electron');
const fs = require('fs/promises');
const path = require('path');
const { pathToFileURL } = require('url');

let mainWindow;

const previewableExtensions = new Set([
  '.apng', '.avif', '.bmp', '.gif', '.jpg', '.jpeg', '.png', '.svg', '.webp',
  '.pdf',
  '.mp4', '.m4v', '.mov', '.webm', '.mp3', '.wav', '.ogg',
  '.txt', '.md', '.csv', '.json', '.xml', '.html', '.css', '.js', '.ts', '.log'
]);

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1180,
    height: 760,
    minWidth: 960,
    minHeight: 640,
    title: 'File Triage',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle('choose-folders', async (_event, title) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title,
    properties: ['openDirectory', 'multiSelections']
  });

  return result.canceled ? [] : result.filePaths;
});

ipcMain.handle('scan-files', async (_event, options) => {
  const { sources, includeSubfolders, includeHidden } = options;
  const seen = new Set();
  const files = [];

  for (const source of sources) {
    const sourceFiles = await collectFiles(source, { includeSubfolders, includeHidden });
    for (const file of sourceFiles) {
      if (!seen.has(file.path)) {
        seen.add(file.path);
        files.push(file);
      }
    }
  }

  files.sort((first, second) => first.path.localeCompare(second.path, 'zh-Hans-CN', { numeric: true }));
  return files;
});

ipcMain.handle('move-file', async (_event, { filePath, destinationFolder }) => {
  await fs.mkdir(destinationFolder, { recursive: true });
  const destinationPath = await availablePath(destinationFolder, path.basename(filePath));
  await fs.rename(filePath, destinationPath);
  return destinationPath;
});

ipcMain.handle('trash-file', async (_event, filePath) => {
  await shell.trashItem(filePath);
  return true;
});

ipcMain.handle('restore-file', async (_event, { fromPath, toPath }) => {
  await fs.mkdir(path.dirname(toPath), { recursive: true });
  const finalPath = await exists(toPath) ? await availablePath(path.dirname(toPath), path.basename(toPath)) : toPath;
  await fs.rename(fromPath, finalPath);
  return finalPath;
});

ipcMain.handle('reveal-file', async (_event, filePath) => {
  shell.showItemInFolder(filePath);
});

ipcMain.handle('open-file', async (_event, filePath) => {
  return shell.openPath(filePath);
});

ipcMain.handle('read-text-file', async (_event, filePath) => {
  const buffer = await fs.readFile(filePath);
  return buffer.toString('utf8');
});

async function collectFiles(folder, options) {
  const entries = await fs.readdir(folder, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (!options.includeHidden && entry.name.startsWith('.')) {
      continue;
    }

    const fullPath = path.join(folder, entry.name);

    if (entry.isDirectory()) {
      if (options.includeSubfolders) {
        files.push(...await collectFiles(fullPath, options));
      }
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    const stat = await fs.stat(fullPath);
    const extension = path.extname(fullPath).toLowerCase();
    files.push({
      path: fullPath,
      name: path.basename(fullPath),
      extension,
      size: stat.size,
      createdAt: stat.birthtime.toISOString(),
      previewUrl: pathToFileURL(fullPath).href,
      previewKind: previewKind(extension)
    });
  }

  return files;
}

function previewKind(extension) {
  if (!previewableExtensions.has(extension)) {
    return 'unsupported';
  }
  if (['.txt', '.md', '.csv', '.json', '.xml', '.html', '.css', '.js', '.ts', '.log'].includes(extension)) {
    return 'text';
  }
  if (['.mp4', '.m4v', '.mov', '.webm'].includes(extension)) {
    return 'video';
  }
  if (['.mp3', '.wav', '.ogg'].includes(extension)) {
    return 'audio';
  }
  return 'embed';
}

async function availablePath(folder, fileName) {
  const parsed = path.parse(fileName);
  let candidate = path.join(folder, fileName);

  if (!await exists(candidate)) {
    return candidate;
  }

  for (let index = 2; index < 1000; index += 1) {
    const nextName = parsed.ext ? `${parsed.name} ${index}${parsed.ext}` : `${parsed.name} ${index}`;
    candidate = path.join(folder, nextName);
    if (!await exists(candidate)) {
      return candidate;
    }
  }

  return path.join(folder, `${Date.now()}-${fileName}`);
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
