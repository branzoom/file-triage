# File Triage for Windows

[简体中文](README.zh-CN.md)

An Electron version of File Triage for Windows. It is designed for quickly sorting Desktop, Downloads, synced cloud folders, and temporary folders.

## Features

- Add one or more source folders.
- Add and remove target folders, with full paths shown.
- Scan regular files, optionally including subfolders and hidden files.
- Preview images, PDFs, videos, audio files, and common text files.
- Reveal or open archives, installers, and unsupported file types.
- Show file creation time, size, and full path.
- Move files to target folders.
- Move files to Windows Recycle Bin.
- Use `Left` / `Right` to select an action, then `Enter` to execute.
- Use `1` through `9` for the first nine targets.
- Use `Delete` or `Backspace` to move to Recycle Bin.
- Use `Space` to skip.
- Use `Ctrl-Z` to undo the last move.
- Switch between English and Chinese. English is the default.

## Run on Windows

Install Node.js LTS first:

```text
https://nodejs.org/
```

Then run in PowerShell:

```powershell
cd apps/windows
npm install
npm start
```

## Build Windows Executables

Run on a Windows machine:

```powershell
cd apps/windows
npm install
npm run dist:win
```

Build output is generated at:

```text
apps/windows/dist
```

It usually includes:

- Installer `.exe`
- Portable `.exe`

## Note

This build is not code-signed yet. Windows SmartScreen may warn on first launch. Click More info, then Run anyway.

Recycle Bin items do not expose a simple restore path like normal file moves. `Ctrl-Z` currently auto-restores only moves to target folders. Files sent to Recycle Bin should be restored manually from Recycle Bin.
