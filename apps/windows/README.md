# File Triage for Windows

**Languages:** English | [中文](#中文)

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

## 中文

**语言：** [English](#file-triage-for-windows) | 中文

这是 File Triage 的 Windows/Electron 版本，适合整理桌面、下载、网盘同步目录和临时文件夹。

## 功能

- 添加一个或多个来源文件夹。
- 添加、删除目标文件夹，并显示完整路径。
- 扫描普通文件，可选包含子文件夹和隐藏文件。
- 预览图片、PDF、视频、音频和常见文本文件。
- 对压缩包、安装包等无法直接预览的文件，支持定位和打开。
- 显示当前文件的创建时间、大小和完整路径。
- 一键移动到目标文件夹。
- 将文件移入 Windows 回收站。
- 使用 `Left` / `Right` 选择底部动作，按 `Enter` 执行。
- 使用 `1` 到 `9` 快速移动到前九个目标文件夹。
- 使用 `Delete` 或 `Backspace` 移入回收站。
- 使用 `Space` 跳过。
- 使用 `Ctrl-Z` 撤销上一次移动。
- 支持英文和中文界面切换，默认英文。

## 在 Windows 上运行

先安装 Node.js LTS：

```text
https://nodejs.org/
```

然后在 PowerShell 里运行：

```powershell
cd apps/windows
npm install
npm start
```

## 打包成 Windows 程序

在 Windows 电脑上运行：

```powershell
cd apps/windows
npm install
npm run dist:win
```

打包结果会出现在：

```text
apps/windows/dist
```

其中通常会有：

- 安装版 `.exe`
- 便携版 `.exe`

## 注意

当前版本没有正式代码签名。第一次运行时 Windows 可能会显示 SmartScreen 提示，需要点击“更多信息”后选择“仍要运行”。

Windows 回收站不像普通文件移动那样容易拿到回收站内路径，所以当前 `Ctrl-Z` 只自动撤销“移动到目标文件夹”的操作。移入回收站后的文件，需要在回收站里手动还原。
