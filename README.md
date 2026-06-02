# File Triage

[简体中文](README.zh-CN.md)

File Triage is an open-source tool for quickly sorting messy folders. Pick source folders such as Desktop, Downloads, iCloud Drive, or temporary folders, preview files one by one, then move each file to a target folder, skip it, or send it to Trash / Recycle Bin with buttons or keyboard shortcuts.

![File Triage macOS screenshot](docs/images/macos-main.png)

This repository contains two apps:

- `apps/mac`: native macOS app built with SwiftUI, AppKit, and Quick Look.
- `apps/windows`: Windows app built with Electron.

## Use Cases

- Clean up a crowded Desktop.
- Sort a long-neglected Downloads folder.
- Triage screenshots, PDFs, archives, images, videos, and temporary files.
- Make quick keyboard-driven decisions without opening Finder or File Explorer repeatedly.

## Features

- Multiple source folders.
- Multiple target folders.
- Remove sources and targets.
- File preview.
- Creation time, file size, and full path display.
- Reveal files in Finder / File Explorer.
- Open files with the default app.
- Keyboard-first sorting.
- Move files to macOS Trash or Windows Recycle Bin.
- English / Chinese interface switching, with English as the default.

## macOS

```bash
cd apps/mac
swift run FileTriage
```

Package a local test build:

```bash
cd apps/mac
./package_app.sh
```

## Windows

Install Node.js LTS first, then run:

```powershell
cd apps/windows
npm install
npm start
```

Build Windows x64 executables:

```powershell
cd apps/windows
npm run dist:win
```

## License

MIT License. You can use, modify, and distribute this project freely.

## Note

The apps are not code-signed yet. macOS and Windows may show developer verification warnings when opening packaged builds for the first time.
