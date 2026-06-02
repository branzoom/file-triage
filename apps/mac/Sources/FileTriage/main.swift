import AppKit
import Quartz
import SwiftUI

@main
struct FileTriageApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
                .frame(minWidth: 980, minHeight: 680)
        }
        .windowStyle(.titleBar)
    }
}

struct TriageFile: Identifiable, Equatable {
    let id = UUID()
    let url: URL

    func metadata(language: AppLanguage) -> String {
        let values = try? url.resourceValues(forKeys: [.creationDateKey, .fileSizeKey])
        let formatter = Self.dateFormatter(language: language)
        let createdAt = values?.creationDate.map(formatter.string(from:)) ?? language.text(.unknownCreatedTime)
        let size = values?.fileSize.map { ByteCountFormatter.string(fromByteCount: Int64($0), countStyle: .file) } ?? language.text(.unknownSize)
        return "\(createdAt) · \(size)"
    }

    func cloudStatus(refreshToken: UUID = UUID()) -> CloudStatus {
        let keys: Set<URLResourceKey> = [
            .isUbiquitousItemKey,
            .ubiquitousItemDownloadingStatusKey,
            .ubiquitousItemIsDownloadingKey
        ]
        let values = try? url.resourceValues(forKeys: keys)
        guard values?.isUbiquitousItem == true else { return .local }

        if values?.ubiquitousItemIsDownloading == true {
            return .downloading
        }

        switch values?.ubiquitousItemDownloadingStatus {
        case .current, .downloaded:
            return .downloaded
        case .notDownloaded:
            return .notDownloaded
        default:
            return .unknownCloud
        }
    }

    private static func dateFormatter(language: AppLanguage) -> DateFormatter {
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: language == .english ? "en_US" : "zh_CN")
        formatter.dateStyle = .medium
        formatter.timeStyle = .short
        return formatter
    }
}

enum CloudStatus: Equatable {
    case local
    case downloaded
    case notDownloaded
    case downloading
    case unknownCloud

    func label(language: AppLanguage) -> String? {
        switch self {
        case .local:
            return nil
        case .downloaded:
            return language.text(.icloudDownloaded)
        case .notDownloaded:
            return language.text(.icloudNotDownloaded)
        case .downloading:
            return language.text(.icloudDownloading)
        case .unknownCloud:
            return "iCloud"
        }
    }

    var needsDownload: Bool {
        self == .notDownloaded || self == .unknownCloud
    }
}

enum AppLanguage: String, CaseIterable, Identifiable {
    case english = "English"
    case chinese = "中文"

    var id: String { rawValue }

    func text(_ key: LocalizedKey) -> String {
        switch (self, key) {
        case (.english, .unknownCreatedTime): return "Unknown created time"
        case (.chinese, .unknownCreatedTime): return "创建时间未知"
        case (.english, .unknownSize): return "Unknown size"
        case (.chinese, .unknownSize): return "大小未知"
        case (.english, .icloudDownloaded): return "iCloud · Downloaded"
        case (.chinese, .icloudDownloaded): return "iCloud · 已下载"
        case (.english, .icloudNotDownloaded): return "iCloud · Not downloaded"
        case (.chinese, .icloudNotDownloaded): return "iCloud · 未下载"
        case (.english, .icloudDownloading): return "iCloud · Downloading"
        case (.chinese, .icloudDownloading): return "iCloud · 下载中"
        case (.english, .chooseFolder): return "Choose a folder to begin"
        case (.chinese, .chooseFolder): return "请选择一个文件夹开始"
        case (.english, .addSources): return "Add Sources"
        case (.chinese, .addSources): return "添加来源"
        case (.english, .chooseSources): return "Choose one or more source folders"
        case (.chinese, .chooseSources): return "请选择一个或多个来源文件夹"
        case (.english, .noFiles): return "No files found"
        case (.chinese, .noFiles): return "没有找到文件"
        case (.english, .scanFailed): return "Scan failed"
        case (.chinese, .scanFailed): return "扫描失败"
        case (.english, .add): return "Add"
        case (.chinese, .add): return "添加"
        case (.english, .movedTo): return "Moved to"
        case (.chinese, .movedTo): return "已移动到"
        case (.english, .moveFailed): return "Move failed"
        case (.chinese, .moveFailed): return "移动失败"
        case (.english, .movedToTrash): return "Moved to Trash"
        case (.chinese, .movedToTrash): return "已移入废纸篓"
        case (.english, .trashFailed): return "Trash failed"
        case (.chinese, .trashFailed): return "移入废纸篓失败"
        case (.english, .skipped): return "Skipped"
        case (.chinese, .skipped): return "已跳过"
        case (.english, .nothingToUndo): return "Nothing to undo"
        case (.chinese, .nothingToUndo): return "没有可撤销的操作"
        case (.english, .undone): return "Undone"
        case (.chinese, .undone): return "已撤销"
        case (.english, .undoFailed): return "Undo failed"
        case (.chinese, .undoFailed): return "撤销失败"
        case (.english, .downloadStarted): return "Started iCloud download"
        case (.chinese, .downloadStarted): return "已开始下载 iCloud 文件"
        case (.english, .downloadFailed): return "Download failed"
        case (.chinese, .downloadFailed): return "下载失败"
        case (.english, .sources): return "Sources"
        case (.chinese, .sources): return "来源"
        case (.english, .rescan): return "Rescan"
        case (.chinese, .rescan): return "重新扫描"
        case (.english, .subfolders): return "Subfolders"
        case (.chinese, .subfolders): return "子文件夹"
        case (.english, .hiddenFiles): return "Hidden Files"
        case (.chinese, .hiddenFiles): return "隐藏文件"
        case (.english, .undo): return "Undo"
        case (.chinese, .undo): return "撤销"
        case (.english, .targets): return "Targets"
        case (.chinese, .targets): return "目标"
        case (.english, .reveal): return "Reveal"
        case (.chinese, .reveal): return "定位"
        case (.english, .download): return "Download"
        case (.chinese, .download): return "下载"
        case (.english, .reload): return "Reload"
        case (.chinese, .reload): return "刷新"
        case (.english, .open): return "Open"
        case (.chinese, .open): return "打开"
        case (.english, .noFileSelected): return "No File Selected"
        case (.chinese, .noFileSelected): return "没有选中文件"
        case (.english, .emptyHint): return "Choose a source folder or add more files to continue."
        case (.chinese, .emptyHint): return "请选择来源文件夹，或添加更多文件后继续。"
        case (.english, .skip): return "Skip"
        case (.chinese, .skip): return "跳过"
        case (.english, .trash): return "Trash"
        case (.chinese, .trash): return "废纸篓"
        case (.english, .addSourceHint): return "Add one or more folders to scan."
        case (.chinese, .addSourceHint): return "添加一个或多个文件夹后开始扫描。"
        case (.english, .addTargetHint): return "Add target folders to show sorting buttons below."
        case (.chinese, .addTargetHint): return "添加目标文件夹后，下方会出现分拣按钮。"
        }
    }
}

enum LocalizedKey {
    case unknownCreatedTime, unknownSize
    case icloudDownloaded, icloudNotDownloaded, icloudDownloading
    case chooseFolder, addSources, chooseSources, noFiles, scanFailed, add
    case movedTo, moveFailed, movedToTrash, trashFailed, skipped
    case nothingToUndo, undone, undoFailed, downloadStarted, downloadFailed
    case sources, rescan, subfolders, hiddenFiles, undo, targets
    case reveal, download, reload, open, noFileSelected, emptyHint, skip, trash
    case addSourceHint, addTargetHint
}

struct Destination: Identifiable, Equatable {
    let id = UUID()
    let url: URL

    var name: String {
        url.lastPathComponent
    }
}

enum TriageAction {
    case move(original: URL, moved: URL)
    case trash(original: URL, trashed: URL)
}

@MainActor
final class TriageModel: ObservableObject {
    @Published var sourceFolders: [URL] = []
    @Published var files: [TriageFile] = []
    @Published var currentIndex = 0
    @Published var destinations: [Destination] = []
    @Published var language: AppLanguage = .english {
        didSet {
            if status == oldValue.text(.chooseFolder) || status == oldValue.text(.chooseSources) {
                status = language.text(sourceFolders.isEmpty ? .chooseFolder : .chooseSources)
            }
        }
    }
    @Published var status = AppLanguage.english.text(.chooseFolder)
    @Published var includeSubfolders = false
    @Published var includeHiddenFiles = false

    private var undoStack: [TriageAction] = []

    var currentFile: TriageFile? {
        guard files.indices.contains(currentIndex) else { return nil }
        return files[currentIndex]
    }

    var progressText: String {
        guard !files.isEmpty else { return "0 / 0" }
        return "\(currentIndex + 1) / \(files.count)"
    }

    func chooseSourceFolder() {
        let panel = NSOpenPanel()
        panel.canChooseFiles = false
        panel.canChooseDirectories = true
        panel.allowsMultipleSelection = true
        panel.prompt = language.text(.addSources)

        guard panel.runModal() == .OK else { return }
        for folder in panel.urls where !sourceFolders.contains(folder) {
            sourceFolders.append(folder)
        }
        scanSourceFolder()
    }

    func removeSourceFolder(_ folder: URL) {
        sourceFolders.removeAll { $0 == folder }
        scanSourceFolder()
    }

    func scanSourceFolder() {
        guard !sourceFolders.isEmpty else {
            files = []
            currentIndex = 0
            undoStack.removeAll()
            status = language.text(.chooseSources)
            return
        }

        do {
            var seen = Set<URL>()
            let collected = try sourceFolders.flatMap { folder in
                try collectFiles(in: folder)
            }
            .filter { url in
                seen.insert(url).inserted
            }
            files = collected
                .sorted { $0.path.localizedStandardCompare($1.path) == .orderedAscending }
                .map(TriageFile.init(url:))
            currentIndex = 0
            undoStack.removeAll()
            status = files.isEmpty ? language.text(.noFiles) : scannedStatus(fileCount: files.count, sourceCount: sourceFolders.count)
        } catch {
            status = "\(language.text(.scanFailed)): \(error.localizedDescription)"
        }
    }

    func addDestinationFolder() {
        let panel = NSOpenPanel()
        panel.canChooseFiles = false
        panel.canChooseDirectories = true
        panel.canCreateDirectories = true
        panel.allowsMultipleSelection = true
        panel.prompt = language.text(.add)

        guard panel.runModal() == .OK else { return }
        let newDestinations = panel.urls.map(Destination.init(url:))
        for destination in newDestinations where !destinations.contains(where: { $0.url == destination.url }) {
            destinations.append(destination)
        }
    }

    func removeDestinationFolder(_ destination: Destination) {
        destinations.removeAll { $0.id == destination.id }
    }

    func moveCurrentFile(to destination: Destination) {
        guard let currentFile else { return }

        do {
            let movedURL = try move(file: currentFile.url, toFolder: destination.url)
            undoStack.append(.move(original: currentFile.url, moved: movedURL))
            removeCurrentFile()
            status = "\(language.text(.movedTo)) \(destination.name)"
        } catch {
            status = "\(language.text(.moveFailed)): \(error.localizedDescription)"
        }
    }

    func trashCurrentFile() {
        guard let currentFile else { return }

        do {
            var trashedURL: NSURL?
            try FileManager.default.trashItem(at: currentFile.url, resultingItemURL: &trashedURL)
            if let trashedURL = trashedURL as URL? {
                undoStack.append(.trash(original: currentFile.url, trashed: trashedURL))
            }
            removeCurrentFile()
            status = language.text(.movedToTrash)
        } catch {
            status = "\(language.text(.trashFailed)): \(error.localizedDescription)"
        }
    }

    func skipCurrentFile() {
        guard !files.isEmpty else { return }
        currentIndex = min(currentIndex + 1, files.count - 1)
        status = language.text(.skipped)
    }

    func undoLastAction() {
        guard let action = undoStack.popLast() else {
            status = language.text(.nothingToUndo)
            return
        }

        do {
            switch action {
            case let .move(original, moved):
                try restore(from: moved, to: original)
                files.insert(TriageFile(url: original), at: min(currentIndex, files.count))
            case let .trash(original, trashed):
                try restore(from: trashed, to: original)
                files.insert(TriageFile(url: original), at: min(currentIndex, files.count))
            }
            status = language.text(.undone)
        } catch {
            status = "\(language.text(.undoFailed)): \(error.localizedDescription)"
        }
    }

    func downloadCurrentFileFromCloud() {
        guard let currentFile else { return }

        do {
            try FileManager.default.startDownloadingUbiquitousItem(at: currentFile.url)
            status = language.text(.downloadStarted)
        } catch {
            status = "\(language.text(.downloadFailed)): \(error.localizedDescription)"
        }
    }

    private func scannedStatus(fileCount: Int, sourceCount: Int) -> String {
        switch language {
        case .english:
            return "Scanned \(fileCount) files from \(sourceCount) sources"
        case .chinese:
            return "已从 \(sourceCount) 个来源扫描 \(fileCount) 个文件"
        }
    }

    private func collectFiles(in folder: URL) throws -> [URL] {
        if includeSubfolders {
            let keys: [URLResourceKey] = [.isRegularFileKey, .isHiddenKey]
            guard let enumerator = FileManager.default.enumerator(
                at: folder,
                includingPropertiesForKeys: keys,
                options: includeHiddenFiles ? [] : [.skipsHiddenFiles]
            ) else {
                return []
            }

            return enumerator.compactMap { item in
                guard let url = item as? URL else { return nil }
                return isTriageFile(url) ? url : nil
            }
            .sorted { $0.lastPathComponent.localizedStandardCompare($1.lastPathComponent) == .orderedAscending }
        }

        let urls = try FileManager.default.contentsOfDirectory(
            at: folder,
            includingPropertiesForKeys: [.isRegularFileKey, .isHiddenKey],
            options: includeHiddenFiles ? [] : [.skipsHiddenFiles]
        )
        return urls
            .filter { url in
                isTriageFile(url)
            }
            .sorted { $0.lastPathComponent.localizedStandardCompare($1.lastPathComponent) == .orderedAscending }
    }

    private func isTriageFile(_ url: URL) -> Bool {
        guard let values = try? url.resourceValues(forKeys: [.isRegularFileKey]) else { return false }
        return values.isRegularFile == true
    }

    private func move(file: URL, toFolder folder: URL) throws -> URL {
        try FileManager.default.createDirectory(at: folder, withIntermediateDirectories: true)
        let destination = availableURL(for: file.lastPathComponent, in: folder)
        try FileManager.default.moveItem(at: file, to: destination)
        return destination
    }

    private func restore(from source: URL, to original: URL) throws {
        let parent = original.deletingLastPathComponent()
        try FileManager.default.createDirectory(at: parent, withIntermediateDirectories: true)
        let restoredURL = FileManager.default.fileExists(atPath: original.path)
            ? availableURL(for: original.lastPathComponent, in: parent)
            : original
        try FileManager.default.moveItem(at: source, to: restoredURL)
    }

    private func availableURL(for fileName: String, in folder: URL) -> URL {
        let baseURL = folder.appendingPathComponent(fileName)
        guard FileManager.default.fileExists(atPath: baseURL.path) else { return baseURL }

        let name = (fileName as NSString).deletingPathExtension
        let ext = (fileName as NSString).pathExtension

        for index in 2...999 {
            let candidateName = ext.isEmpty ? "\(name) \(index)" : "\(name) \(index).\(ext)"
            let candidate = folder.appendingPathComponent(candidateName)
            if !FileManager.default.fileExists(atPath: candidate.path) {
                return candidate
            }
        }

        return folder.appendingPathComponent("\(UUID().uuidString)-\(fileName)")
    }

    private func removeCurrentFile() {
        guard files.indices.contains(currentIndex) else { return }
        files.remove(at: currentIndex)
        if currentIndex >= files.count {
            currentIndex = max(files.count - 1, 0)
        }
    }
}

struct ContentView: View {
    @StateObject private var model = TriageModel()
    @State private var selectedActionIndex = 0
    @State private var trashFlash = false
    @State private var refreshToken = UUID()
    @State private var statusRefreshToken = UUID()
    private let cloudRefreshTimer = Timer.publish(every: 1, on: .main, in: .common).autoconnect()

    private var actionCount: Int {
        model.destinations.count + 2
    }

    var body: some View {
        VStack(spacing: 0) {
            toolbar
            Divider()

            HStack(spacing: 0) {
                sidebar
                Divider()
                previewArea
            }
        }
        .background(Color(nsColor: .windowBackgroundColor))
        .focusedSceneValue(\.triageModel, model)
        .background(
            KeyboardCaptureView { event in
                handleKey(event)
            }
        )
        .onChange(of: model.destinations.count) { _ in
            selectedActionIndex = min(selectedActionIndex, max(actionCount - 1, 0))
        }
        .onReceive(cloudRefreshTimer) { _ in
            guard model.currentFile != nil else { return }
            statusRefreshToken = UUID()
        }
    }

    private var toolbar: some View {
        HStack(spacing: 12) {
            Button {
                model.chooseSourceFolder()
            } label: {
                Label(model.language.text(.sources), systemImage: "folder.badge.plus")
            }
            .help(model.language == .english ? "Add one or more folders to sort." : "添加一个或多个需要整理的文件夹")

            Button {
                model.scanSourceFolder()
            } label: {
                Label(model.language.text(.rescan), systemImage: "arrow.clockwise")
            }
            .disabled(model.sourceFolders.isEmpty)
            .help(model.language == .english ? "Rebuild the queue from current sources." : "根据当前来源重新生成待整理文件队列")

            Toggle(model.language.text(.subfolders), isOn: $model.includeSubfolders)
                .toggleStyle(.switch)
                .help(model.language == .english ? "Scan files inside source subfolders." : "开启后会扫描来源文件夹里的子文件夹")

            Toggle(model.language.text(.hiddenFiles), isOn: $model.includeHiddenFiles)
                .toggleStyle(.switch)
                .help(model.language == .english ? "Include hidden files such as .DS_Store and .env." : "开启后会包含 .DS_Store、.env 等隐藏文件，日常整理建议关闭")

            Spacer()

            Text(model.progressText)
                .font(.system(.body, design: .monospaced))
                .foregroundStyle(.secondary)

            Text(model.status)
                .lineLimit(1)
                .foregroundStyle(.secondary)
                .frame(maxWidth: 320, alignment: .trailing)

            Picker("", selection: $model.language) {
                ForEach(AppLanguage.allCases) { language in
                    Text(language.rawValue).tag(language)
                }
            }
            .pickerStyle(.segmented)
            .frame(width: 150)
            .help(model.language == .english ? "Switch interface language." : "切换界面语言")

            Button {
                model.undoLastAction()
            } label: {
                Label(model.language.text(.undo), systemImage: "arrow.uturn.backward")
            }
            .keyboardShortcut("z", modifiers: [.command])
            .help(model.language == .english ? "Undo the last move or trash action." : "撤销上一次移动或移入废纸篓操作")
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 10)
    }

    private var sidebar: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack {
                Text(model.language.text(.sources))
                    .font(.caption)
                    .foregroundStyle(.secondary)
                Spacer()
                Button {
                    model.chooseSourceFolder()
                } label: {
                    Image(systemName: "plus")
                }
                .buttonStyle(.borderless)
                .help(model.language == .english ? "Add source folders." : "添加来源文件夹")
            }

            if model.sourceFolders.isEmpty {
                Text(model.language.text(.addSourceHint))
                    .foregroundStyle(.secondary)
                    .font(.callout)
            } else {
                ForEach(model.sourceFolders, id: \.self) { folder in
                    HStack(spacing: 8) {
                        Image(systemName: "folder")
                            .foregroundStyle(.secondary)
                        Text(folder.lastPathComponent)
                            .lineLimit(1)
                        Spacer()
                        Button {
                            model.removeSourceFolder(folder)
                        } label: {
                            Image(systemName: "xmark.circle")
                        }
                        .buttonStyle(.borderless)
                        .help(model.language == .english ? "Remove this source and rescan." : "删除这个来源，并重新扫描")
                    }
                    .font(.callout)
                    .help(folder.path)
                }
            }

            Divider()

            HStack {
                Text(model.language.text(.targets))
                    .font(.caption)
                    .foregroundStyle(.secondary)
                Spacer()
                Button {
                    model.addDestinationFolder()
                } label: {
                    Image(systemName: "plus")
                }
                .buttonStyle(.borderless)
                .help(model.language == .english ? "Add target folders for sorting." : "添加文件要移动到的目标文件夹")
            }

            if model.destinations.isEmpty {
                Text(model.language.text(.addTargetHint))
                    .foregroundStyle(.secondary)
                    .font(.callout)
            } else {
                ForEach(model.destinations) { destination in
                    HStack(alignment: .top, spacing: 8) {
                        Image(systemName: "folder")
                            .foregroundStyle(.secondary)
                            .padding(.top, 2)
                        VStack(alignment: .leading, spacing: 2) {
                            Text(destination.name)
                                .lineLimit(1)
                            Text(destination.url.path)
                                .font(.caption)
                                .foregroundStyle(.secondary)
                                .lineLimit(2)
                        }
                        Spacer()
                        Button {
                            model.removeDestinationFolder(destination)
                        } label: {
                            Image(systemName: "xmark.circle")
                        }
                        .buttonStyle(.borderless)
                        .help(model.language == .english ? "Remove this target button." : "删除这个目标文件夹按钮")
                    }
                    .font(.callout)
                    .help(destination.url.path)
                }
            }

            Spacer()
        }
        .padding(16)
        .frame(width: 260)
    }

    private var previewArea: some View {
        VStack(spacing: 0) {
            if let file = model.currentFile {
                QuickLookPreview(url: file.url)
                    .id("\(file.url.path)-\(refreshToken)")

                Divider()

                VStack(alignment: .leading, spacing: 10) {
                    let cloudStatus = file.cloudStatus(refreshToken: statusRefreshToken)
                    HStack(alignment: .top, spacing: 12) {
                        VStack(alignment: .leading, spacing: 4) {
                            Text(file.url.lastPathComponent)
                                .font(.headline)
                                .lineLimit(1)
                            Text(file.metadata(language: model.language))
                                .font(.caption)
                                .foregroundStyle(.secondary)
                            if let cloudLabel = cloudStatus.label(language: model.language) {
                                Label(cloudLabel, systemImage: "icloud")
                                    .font(.caption)
                                    .foregroundStyle(cloudStatus.needsDownload ? Color.orange : Color.secondary)
                            }
                            Text(file.url.path)
                                .font(.caption)
                                .foregroundStyle(.secondary)
                                .lineLimit(1)
                        }

                        Spacer()

                        Button {
                            revealCurrentFile()
                        } label: {
                            Label(model.language.text(.reveal), systemImage: "scope")
                        }
                        .disabled(model.currentFile == nil)
                        .help(model.language == .english ? "Reveal the current file in Finder." : "在 Finder 中定位当前文件")

                        if cloudStatus.needsDownload || cloudStatus == .downloading {
                            Button {
                                model.downloadCurrentFileFromCloud()
                                reloadPreview()
                            } label: {
                                Label(cloudStatus == .downloading ? model.language.text(.reload) : model.language.text(.download), systemImage: cloudStatus == .downloading ? "arrow.clockwise" : "icloud.and.arrow.down")
                            }
                            .help(cloudStatus == .downloading ? (model.language == .english ? "Refresh iCloud download status and preview." : "刷新 iCloud 下载状态和预览") : (model.language == .english ? "Ask iCloud to download this file locally." : "请求 iCloud 将当前文件下载到本机"))
                        }

                        Button {
                            reloadPreview()
                        } label: {
                            Label(model.language.text(.reload), systemImage: "arrow.clockwise")
                        }
                        .help(model.language == .english ? "Reload the current preview." : "重新加载当前文件预览")

                        Button {
                            openCurrentFile()
                        } label: {
                            Label(model.language.text(.open), systemImage: "arrow.up.forward.app")
                        }
                        .disabled(model.currentFile == nil)
                        .help(model.language == .english ? "Open with the default app." : "用系统默认 App 打开当前文件")
                    }

                    actionBar
                }
                .padding(12)
            } else {
                VStack(spacing: 12) {
                    Image(systemName: "tray")
                        .font(.system(size: 42))
                        .foregroundStyle(.secondary)
                    Text(model.language.text(.noFileSelected))
                        .font(.title3)
                        .fontWeight(.semibold)
                    Text(model.language.text(.emptyHint))
                        .foregroundStyle(.secondary)
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    private var actionBar: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 10) {
                ForEach(Array(model.destinations.enumerated()), id: \.element.id) { index, destination in
                    Button {
                        selectedActionIndex = index
                        model.moveCurrentFile(to: destination)
                    } label: {
                        HStack(spacing: 8) {
                            Text("\(index + 1)")
                                .font(.system(.caption, design: .monospaced))
                                .foregroundStyle(.secondary)
                            Image(systemName: "folder")
                            Text(destination.name)
                                .lineLimit(1)
                        }
                        .frame(maxWidth: 160)
                    }
                    .keyboardShortcut(KeyEquivalent(Character("\(min(index + 1, 9))")), modifiers: [])
                    .buttonStyle(TriageButtonStyle(isSelected: selectedActionIndex == index))
                    .disabled(model.currentFile == nil || index > 8)
                    .help(model.language == .english ? "Move current file to: \(destination.url.path)" : "将当前文件移动到：\(destination.url.path)")
                }

                Button {
                    selectedActionIndex = model.destinations.count
                    model.skipCurrentFile()
                } label: {
                    Label(model.language.text(.skip), systemImage: "forward")
                        .frame(minWidth: 92)
                }
                .keyboardShortcut(.space, modifiers: [])
                .buttonStyle(TriageButtonStyle(isSelected: selectedActionIndex == model.destinations.count))
                .disabled(model.currentFile == nil)
                .help(model.language == .english ? "Skip current file. Shortcut: Space." : "暂时跳过当前文件，快捷键：空格")

                Button(role: .destructive) {
                    selectedActionIndex = model.destinations.count + 1
                    trashCurrentFileWithEffect()
                } label: {
                    Label(model.language.text(.trash), systemImage: trashFlash ? "trash.fill" : "trash")
                        .frame(minWidth: 92)
                }
                .keyboardShortcut(.delete, modifiers: [])
                .buttonStyle(TriageButtonStyle(isSelected: selectedActionIndex == model.destinations.count + 1, isDestructive: true, isFlashing: trashFlash))
                .disabled(model.currentFile == nil)
                .help(model.language == .english ? "Move current file to macOS Trash. Shortcut: Delete." : "将当前文件移入 macOS 废纸篓，快捷键：Delete")
            }
            .padding(.vertical, 2)
        }
    }

    private func handleKey(_ event: NSEvent) {
        guard event.modifierFlags.intersection(.deviceIndependentFlagsMask).subtracting([.numericPad]).isEmpty else {
            if event.modifierFlags.contains(.command), event.charactersIgnoringModifiers == "z" {
                model.undoLastAction()
            }
            return
        }

        switch event.keyCode {
        case 123:
            moveSelection(-1)
        case 124:
            moveSelection(1)
        case 36, 76:
            performSelectedAction()
        case 51, 117:
            selectedActionIndex = model.destinations.count + 1
            trashCurrentFileWithEffect()
        default:
            break
        }
    }

    private func moveSelection(_ offset: Int) {
        guard actionCount > 0 else { return }
        selectedActionIndex = (selectedActionIndex + offset + actionCount) % actionCount
    }

    private func performSelectedAction() {
        guard model.currentFile != nil else { return }

        if model.destinations.indices.contains(selectedActionIndex) {
            model.moveCurrentFile(to: model.destinations[selectedActionIndex])
        } else if selectedActionIndex == model.destinations.count {
            model.skipCurrentFile()
        } else {
            trashCurrentFileWithEffect()
        }
    }

    private func trashCurrentFileWithEffect() {
        guard model.currentFile != nil else { return }

        withAnimation(.spring(response: 0.22, dampingFraction: 0.48)) {
            trashFlash = true
        }
        model.trashCurrentFile()
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.22) {
            withAnimation(.easeOut(duration: 0.18)) {
                trashFlash = false
            }
        }
    }

    private func revealCurrentFile() {
        guard let file = model.currentFile else { return }
        NSWorkspace.shared.activateFileViewerSelecting([file.url])
    }

    private func openCurrentFile() {
        guard let file = model.currentFile else { return }
        NSWorkspace.shared.open(file.url)
    }

    private func reloadPreview() {
        statusRefreshToken = UUID()
        refreshToken = UUID()
    }
}

struct QuickLookPreview: NSViewRepresentable {
    let url: URL

    func makeNSView(context: Context) -> QLPreviewView {
        let view = QLPreviewView(frame: .zero, style: .normal)!
        view.autostarts = true
        view.previewItem = PreviewItem(url: url)
        return view
    }

    func updateNSView(_ nsView: QLPreviewView, context: Context) {
        nsView.previewItem = PreviewItem(url: url)
        nsView.refreshPreviewItem()
    }
}

struct KeyboardCaptureView: NSViewRepresentable {
    let onKeyDown: (NSEvent) -> Void

    func makeNSView(context: Context) -> KeyCaptureNSView {
        let view = KeyCaptureNSView()
        view.onKeyDown = onKeyDown
        DispatchQueue.main.async {
            view.window?.makeFirstResponder(view)
        }
        return view
    }

    func updateNSView(_ nsView: KeyCaptureNSView, context: Context) {
        nsView.onKeyDown = onKeyDown
        DispatchQueue.main.async {
            nsView.window?.makeFirstResponder(nsView)
        }
    }
}

final class KeyCaptureNSView: NSView {
    var onKeyDown: ((NSEvent) -> Void)?

    override var acceptsFirstResponder: Bool {
        true
    }

    override func viewDidMoveToWindow() {
        super.viewDidMoveToWindow()
        DispatchQueue.main.async {
            self.window?.makeFirstResponder(self)
        }
    }

    override func keyDown(with event: NSEvent) {
        onKeyDown?(event)
    }
}

struct TriageButtonStyle: ButtonStyle {
    var isSelected: Bool
    var isDestructive = false
    var isFlashing = false

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .padding(.horizontal, 12)
            .padding(.vertical, 9)
            .background(backgroundColor(isPressed: configuration.isPressed))
            .foregroundStyle(isDestructive ? Color.red : Color.primary)
            .clipShape(RoundedRectangle(cornerRadius: 8))
            .overlay {
                RoundedRectangle(cornerRadius: 8)
                    .stroke(borderColor, lineWidth: isSelected ? 2 : 1)
            }
            .scaleEffect(isFlashing ? 1.08 : (configuration.isPressed ? 0.98 : 1))
    }

    private func backgroundColor(isPressed: Bool) -> Color {
        if isFlashing {
            return Color.red.opacity(0.18)
        }
        if isPressed {
            return Color.accentColor.opacity(0.18)
        }
        if isSelected {
            return Color.accentColor.opacity(0.12)
        }
        return Color(nsColor: .controlBackgroundColor)
    }

    private var borderColor: Color {
        if isDestructive && isSelected {
            return .red
        }
        return isSelected ? .accentColor : Color(nsColor: .separatorColor)
    }
}

final class PreviewItem: NSObject, QLPreviewItem {
    let previewItemURL: URL?

    init(url: URL) {
        previewItemURL = url
    }
}

private struct TriageModelKey: FocusedValueKey {
    typealias Value = TriageModel
}

extension FocusedValues {
    var triageModel: TriageModel? {
        get { self[TriageModelKey.self] }
        set { self[TriageModelKey.self] = newValue }
    }
}
