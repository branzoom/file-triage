# File Triage for macOS

**Languages:** English | [中文](#中文)

A native macOS prototype for quickly sorting messy folders. It uses SwiftUI, AppKit, and Quick Look.

## Run

```bash
cd apps/mac
swift run FileTriage
```

Or run:

```bash
./run.sh
```

## Package a Local Test Build

```bash
./package_app.sh
```

The build output is generated at:

```text
apps/mac/dist/File Triage.zip
```

This is a local test build without official Apple Developer signing. First launch may require right-clicking the app and choosing Open, or allowing it in System Settings > Privacy & Security.

## Features

- Pick one or more source folders.
- Remove source folders and rescan.
- Preview files with macOS Quick Look.
- Add and remove target folders.
- Sort with buttons directly below the preview.
- Undo with the top-right button or `Command-Z`.
- Show file creation time, size, and full path.
- Reveal the current file in Finder or open it with the default app.
- Show iCloud status, download cloud-only files, and reload previews.
- Use `Left` / `Right` to select an action, then `Return` to execute.
- Use number keys `1` through `9` for the first nine targets.
- Move files to macOS Trash with `Delete`.
- Skip with `Space`.
- Optionally include subfolders and hidden files.
- Switch between English and Chinese. English is the default.

## 中文

**语言：** [English](#file-triage-for-macos) | 中文

这是一个原生 macOS 文件快速分拣原型，适合整理桌面、下载、iCloud 文件夹和各种临时目录。它使用 SwiftUI、AppKit 和 Quick Look。

## 运行

```bash
cd apps/mac
swift run FileTriage
```

也可以直接运行：

```bash
./run.sh
```

## 打包本地测试版

```bash
./package_app.sh
```

打包结果会生成在：

```text
apps/mac/dist/File Triage.zip
```

这是一个本地测试版，没有 Apple Developer 正式签名。第一次打开时，可能需要右键点击 App 选择“打开”，或在“系统设置 > 隐私与安全性”里允许打开。

## 当前功能

- 添加一个或多个来源文件夹。
- 删除来源文件夹，并重新扫描。
- 使用 macOS Quick Look 预览当前文件。
- 添加和删除目标文件夹。
- 在预览正下方使用分拣按钮。
- 使用右上角按钮或 `Command-Z` 撤销。
- 显示当前文件的创建时间、大小和完整路径。
- 支持在 Finder 中定位当前文件，或用默认 App 打开。
- 支持查看 iCloud 下载状态、下载云端文件、刷新预览。
- 使用 `Left` / `Right` 选择底部动作，按 `Return` 执行。
- 使用数字键 `1` 到 `9` 快速移动到前九个目标文件夹。
- 使用 Mac 的 `Delete` 键把当前文件移入废纸篓。
- 使用 `Space` 跳过当前文件。
- 可选扫描子文件夹和隐藏文件。
- 支持英文和中文界面切换，默认英文。
