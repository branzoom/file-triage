# 文件快速分拣 Windows 版

这是 macOS 版“文件快速分拣”的 Windows/Electron 版本，适合整理桌面、下载、网盘同步目录和临时文件夹。

## 功能

- 添加一个或多个来源文件夹。
- 添加、删除目标文件夹，并显示完整路径。
- 扫描普通文件，可选包含子文件夹和隐藏文件。
- 预览图片、PDF、视频、音频和常见文本文件。
- 对压缩包、安装包等无法直接预览的文件，支持“定位”和“打开”。
- 显示当前文件的创建时间、大小和完整路径。
- 一键移动到目标文件夹。
- 将文件移入 Windows 回收站。
- 使用 `Left` / `Right` 选择底部动作，按 `Enter` 执行。
- 使用 `1` 到 `9` 快速移动到前九个目标文件夹。
- 使用 `Delete` 或 `Backspace` 移入回收站。
- 使用 `Space` 跳过。
- 使用 `Ctrl-Z` 撤销上一次移动。

## 在 Windows 上运行

先安装 Node.js LTS：

```text
https://nodejs.org/
```

然后在 PowerShell 里运行：

```powershell
cd FileTriageWindows
npm install
npm start
```

## 打包成 Windows 程序

在 Windows 电脑上运行：

```powershell
cd FileTriageWindows
npm install
npm run dist:win
```

打包结果会出现在：

```text
FileTriageWindows\dist
```

其中通常会有：

- 安装版 `.exe`
- 便携版 `.exe`

## 注意

当前版本没有正式代码签名。第一次运行时 Windows 可能会显示 SmartScreen 提示，需要点击“更多信息”后选择“仍要运行”。

Windows 回收站不像普通文件移动那样容易拿到回收站内路径，所以当前 `Ctrl-Z` 只自动撤销“移动到目标文件夹”的操作。移入回收站后的文件，需要在回收站里手动还原。
