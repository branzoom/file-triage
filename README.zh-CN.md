# File Triage

[English](README.md)

File Triage 是一个用于快速整理杂乱文件夹的开源小工具。你可以选择桌面、下载、iCloud Drive、临时目录等来源文件夹，逐个预览文件，然后用按钮或快捷键把文件移动到目标文件夹、跳过，或移入废纸篓/回收站。

![File Triage macOS 截图](docs/images/macos-main.png)

这个仓库包含两个版本：

- `apps/mac`：原生 macOS 版，使用 SwiftUI、AppKit 和 Quick Look。
- `apps/windows`：Windows 版，使用 Electron。

## 适合场景

- 桌面文件堆太多，需要快速归类。
- 下载目录长期没有整理。
- 图片、PDF、压缩包、截图、视频、临时文件混在一起。
- 想用键盘快速决策，而不是反复打开 Finder 或资源管理器。

## 功能概览

- 多来源文件夹扫描。
- 多目标文件夹分拣。
- 删除来源和目标。
- 文件预览。
- 显示文件创建时间、大小和完整路径。
- 在 Finder / 资源管理器中定位文件。
- 用默认 App 打开文件。
- 快捷键分拣。
- 移入 macOS 废纸篓或 Windows 回收站。
- 支持英文 / 中文界面切换，默认英文。

## macOS 版

```bash
cd apps/mac
swift run FileTriage
```

打包本地测试版：

```bash
cd apps/mac
./package_app.sh
```

## Windows 版

先安装 Node.js LTS，然后运行：

```powershell
cd apps/windows
npm install
npm start
```

打包 Windows x64 程序：

```powershell
cd apps/windows
npm run dist:win
```

## 开源协议

MIT License。你可以自由使用、修改和分发这个项目。

## 注意

当前项目还没有正式代码签名。macOS 和 Windows 第一次运行打包产物时，系统可能会提示无法验证开发者，需要手动允许打开。
