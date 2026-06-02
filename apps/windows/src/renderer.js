const state = {
  sources: [],
  targets: [],
  files: [],
  currentIndex: 0,
  selectedActionIndex: 0,
  undoStack: [],
  language: 'en',
  statusKey: 'chooseFolder',
  statusValues: {}
};

const translations = {
  en: {
    chooseFolder: 'Choose a folder to begin',
    addSources: '📁 Sources',
    rescan: '↻ Rescan',
    subfolders: 'Subfolders',
    hiddenFiles: 'Hidden Files',
    undo: '↶ Undo',
    sources: 'Sources',
    targets: 'Targets',
    addSourceHint: 'Add one or more folders to scan.',
    addTargetHint: 'Add target folders to show sorting buttons below.',
    noFileSelected: 'No File Selected',
    emptyHint: 'Choose a source folder or add more files to continue.',
    reveal: 'Reveal',
    reload: 'Reload',
    open: 'Open',
    skip: 'Skip',
    trash: 'Recycle Bin',
    unsupportedTitle: 'Cannot Preview Directly',
    unsupportedCopy: '{name} can be revealed in File Explorer or opened with the default app.',
    chooseSources: 'Choose one or more source folders',
    noFiles: 'No files found',
    scanned: 'Scanned {files} files from {sources} sources',
    scanFailed: 'Scan failed: {message}',
    movedTo: 'Moved to {name}',
    moveFailed: 'Move failed: {message}',
    movedToTrash: 'Moved to Recycle Bin',
    trashFailed: 'Recycle Bin failed: {message}',
    nothingToUndo: 'Nothing to undo',
    trashUndoManual: 'Recycle Bin items must be restored manually from Windows Recycle Bin',
    undone: 'Undone',
    undoFailed: 'Undo failed: {message}',
    skipped: 'Skipped',
    addSourceDialog: 'Add source folders',
    addTargetDialog: 'Add target folders',
    addSourcesHelp: 'Add one or more folders to sort.',
    rescanHelp: 'Rebuild the queue from current sources.',
    subfoldersHelp: 'Scan files inside source subfolders.',
    hiddenHelp: 'Include hidden files. Keep this off for everyday sorting.',
    undoHelp: 'Undo the last move. Recycle Bin items must be restored manually.',
    addSourceHelp: 'Add source folders.',
    addTargetHelp: 'Add target folders for sorting.',
    removeSourceHelp: 'Remove this source and rescan.',
    removeTargetHelp: 'Remove this target button.',
    revealHelp: 'Reveal current file in File Explorer.',
    reloadHelp: 'Reload current preview.',
    openHelp: 'Open with the default app.',
    moveHelp: 'Move current file to: {path}',
    skipHelp: 'Skip current file. Shortcut: Space.',
    trashHelp: 'Move current file to Windows Recycle Bin. Shortcut: Delete or Backspace.'
  },
  zh: {
    chooseFolder: '请选择一个文件夹开始',
    addSources: '📁 来源',
    rescan: '↻ 重新扫描',
    subfolders: '子文件夹',
    hiddenFiles: '隐藏文件',
    undo: '↶ 撤销',
    sources: '来源',
    targets: '目标',
    addSourceHint: '添加一个或多个文件夹后开始扫描。',
    addTargetHint: '添加目标文件夹后，下方会出现分拣按钮。',
    noFileSelected: '没有选中文件',
    emptyHint: '请选择来源文件夹，或添加更多文件后继续。',
    reveal: '定位',
    reload: '刷新',
    open: '打开',
    skip: '跳过',
    trash: '回收站',
    unsupportedTitle: '无法直接预览',
    unsupportedCopy: '{name} 可以用“定位”在资源管理器中查看，或点“打开”用默认程序确认。',
    chooseSources: '请选择一个或多个来源文件夹',
    noFiles: '没有找到文件',
    scanned: '已从 {sources} 个来源扫描 {files} 个文件',
    scanFailed: '扫描失败：{message}',
    movedTo: '已移动到 {name}',
    moveFailed: '移动失败：{message}',
    movedToTrash: '已移入回收站',
    trashFailed: '移入回收站失败：{message}',
    nothingToUndo: '没有可撤销的操作',
    trashUndoManual: 'Windows 回收站项目请在回收站中手动还原',
    undone: '已撤销',
    undoFailed: '撤销失败：{message}',
    skipped: '已跳过',
    addSourceDialog: '添加来源文件夹',
    addTargetDialog: '添加目标文件夹',
    addSourcesHelp: '添加一个或多个需要整理的文件夹',
    rescanHelp: '根据当前来源重新生成待整理文件队列',
    subfoldersHelp: '开启后会扫描来源文件夹里的子文件夹',
    hiddenHelp: '开启后会包含隐藏文件，日常整理建议关闭',
    undoHelp: '撤销上一次移动操作。注意：Windows 回收站恢复需要手动从回收站还原。',
    addSourceHelp: '添加来源文件夹',
    addTargetHelp: '添加文件要移动到的目标文件夹',
    removeSourceHelp: '删除这个来源，并重新扫描',
    removeTargetHelp: '删除这个目标文件夹按钮',
    revealHelp: '在资源管理器中定位当前文件',
    reloadHelp: '重新加载当前文件预览',
    openHelp: '用系统默认程序打开当前文件',
    moveHelp: '将当前文件移动到：{path}',
    skipHelp: '暂时跳过当前文件，快捷键：空格',
    trashHelp: '将当前文件移入 Windows 回收站，快捷键：Delete 或 Backspace'
  }
};

const elements = {
  addSources: document.getElementById('addSources'),
  addSourcesSmall: document.getElementById('addSourcesSmall'),
  addTargets: document.getElementById('addTargets'),
  rescan: document.getElementById('rescan'),
  language: document.getElementById('language'),
  includeSubfolders: document.getElementById('includeSubfolders'),
  includeHidden: document.getElementById('includeHidden'),
  subfoldersLabel: document.getElementById('subfoldersLabel'),
  hiddenLabel: document.getElementById('hiddenLabel'),
  undo: document.getElementById('undo'),
  sourcesTitle: document.getElementById('sourcesTitle'),
  targetsTitle: document.getElementById('targetsTitle'),
  sources: document.getElementById('sources'),
  targets: document.getElementById('targets'),
  preview: document.getElementById('preview'),
  details: document.getElementById('details'),
  fileName: document.getElementById('fileName'),
  fileMeta: document.getElementById('fileMeta'),
  filePath: document.getElementById('filePath'),
  reveal: document.getElementById('reveal'),
  reload: document.getElementById('reload'),
  openFile: document.getElementById('openFile'),
  actions: document.getElementById('actions'),
  progress: document.getElementById('progress'),
  status: document.getElementById('status')
};

elements.addSources.addEventListener('click', addSources);
elements.addSourcesSmall.addEventListener('click', addSources);
elements.addTargets.addEventListener('click', addTargets);
elements.rescan.addEventListener('click', scan);
elements.includeSubfolders.addEventListener('change', scan);
elements.includeHidden.addEventListener('change', scan);
elements.language.addEventListener('change', () => {
  state.language = elements.language.value;
  render();
  setStatus(state.statusKey, state.statusValues);
});
elements.undo.addEventListener('click', undo);
elements.reveal.addEventListener('click', () => currentFile() && window.fileTriage.revealFile(currentFile().path));
elements.openFile.addEventListener('click', () => currentFile() && window.fileTriage.openFile(currentFile().path));
elements.reload.addEventListener('click', renderPreview);

document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.key.toLowerCase() === 'z') {
    event.preventDefault();
    undo();
    return;
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    moveSelection(-1);
  } else if (event.key === 'ArrowRight') {
    event.preventDefault();
    moveSelection(1);
  } else if (event.key === 'Enter') {
    event.preventDefault();
    performSelectedAction();
  } else if (event.key === 'Delete' || event.key === 'Backspace') {
    event.preventDefault();
    selectTrash();
    trashCurrentFile();
  } else if (event.key === ' ') {
    event.preventDefault();
    skipCurrentFile();
  } else if (/^[1-9]$/.test(event.key)) {
    const index = Number(event.key) - 1;
    if (state.targets[index]) {
      event.preventDefault();
      state.selectedActionIndex = index;
      moveCurrentFile(state.targets[index]);
    }
  }
});

render();

async function addSources() {
  const folders = await window.fileTriage.chooseFolders(t('addSourceDialog'));
  mergePaths(state.sources, folders);
  await scan();
}

async function addTargets() {
  const folders = await window.fileTriage.chooseFolders(t('addTargetDialog'));
  mergePaths(state.targets, folders);
  render();
}

async function scan() {
  if (state.sources.length === 0) {
    state.files = [];
    state.currentIndex = 0;
    state.undoStack = [];
    setStatus('chooseSources');
    render();
    return;
  }

  try {
    state.files = await window.fileTriage.scanFiles({
      sources: state.sources,
      includeSubfolders: elements.includeSubfolders.checked,
      includeHidden: elements.includeHidden.checked
    });
    state.currentIndex = 0;
    state.undoStack = [];
    setStatus(state.files.length === 0 ? 'noFiles' : 'scanned', { files: state.files.length, sources: state.sources.length });
  } catch (error) {
    setStatus('scanFailed', { message: error.message });
  }

  render();
}

async function moveCurrentFile(target) {
  const file = currentFile();
  if (!file) return;

  try {
    const movedPath = await window.fileTriage.moveFile({
      filePath: file.path,
      destinationFolder: target
    });
    state.undoStack.push({ type: 'move', originalPath: file.path, movedPath });
    removeCurrentFile();
    setStatus('movedTo', { name: baseName(target) });
    render();
  } catch (error) {
    setStatus('moveFailed', { message: error.message });
  }
}

async function trashCurrentFile() {
  const file = currentFile();
  if (!file) return;

  try {
    await window.fileTriage.trashFile(file.path);
    state.undoStack.push({ type: 'trash', originalPath: file.path });
    removeCurrentFile();
    setStatus('movedToTrash');
    render();
  } catch (error) {
    setStatus('trashFailed', { message: error.message });
  }
}

async function undo() {
  const lastAction = state.undoStack.pop();
  if (!lastAction) {
    setStatus('nothingToUndo');
    return;
  }

  if (lastAction.type === 'trash') {
    setStatus('trashUndoManual');
    return;
  }

  try {
    const restoredPath = await window.fileTriage.restoreFile({
      fromPath: lastAction.movedPath,
      toPath: lastAction.originalPath
    });
    state.files.splice(state.currentIndex, 0, {
      path: restoredPath,
      name: baseName(restoredPath),
      size: 0,
      createdAt: new Date().toISOString(),
      previewUrl: pathToPreviewUrl(restoredPath),
      previewKind: previewKind(restoredPath)
    });
    setStatus('undone');
    render();
  } catch (error) {
    setStatus('undoFailed', { message: error.message });
  }
}

function skipCurrentFile() {
  if (state.files.length === 0) return;
  state.currentIndex = Math.min(state.currentIndex + 1, state.files.length - 1);
  setStatus('skipped');
  render();
}

function render() {
  renderSources();
  renderTargets();
  renderPreview();
  renderActions();
  renderStaticText();
  elements.progress.textContent = state.files.length === 0 ? '0 / 0' : `${state.currentIndex + 1} / ${state.files.length}`;
}

function renderSources() {
  renderPathList(elements.sources, state.sources, t('removeSourceHelp'), async (source) => {
    state.sources = state.sources.filter((item) => item !== source);
    await scan();
  }, t('addSourceHint'));
}

function renderTargets() {
  renderPathList(elements.targets, state.targets, t('removeTargetHelp'), (target) => {
    state.targets = state.targets.filter((item) => item !== target);
    state.selectedActionIndex = Math.min(state.selectedActionIndex, actionCount() - 1);
    render();
  }, t('addTargetHint'));
}

function renderPathList(container, paths, removeTitle, onRemove, emptyText) {
  container.innerHTML = '';
  container.classList.toggle('empty', paths.length === 0);

  if (paths.length === 0) {
    container.textContent = emptyText;
    return;
  }

  for (const itemPath of paths) {
    const item = document.createElement('div');
    item.className = 'list-item';
    item.title = itemPath;

    const text = document.createElement('div');
    text.innerHTML = `<div class="item-name">${escapeHtml(baseName(itemPath))}</div><div class="item-path">${escapeHtml(itemPath)}</div>`;

    const removeButton = document.createElement('button');
    removeButton.className = 'remove';
    removeButton.textContent = '×';
    removeButton.title = removeTitle;
    removeButton.addEventListener('click', () => onRemove(itemPath));

    item.append(text, removeButton);
    container.append(item);
  }
}

async function renderPreview() {
  const file = currentFile();
  elements.details.classList.toggle('hidden', !file);

  if (!file) {
    elements.preview.className = 'preview empty-preview';
    elements.preview.innerHTML = `<div class="empty-icon">▣</div><div class="empty-title">${escapeHtml(t('noFileSelected'))}</div><div class="empty-copy">${escapeHtml(t('emptyHint'))}</div>`;
    return;
  }

  elements.fileName.textContent = file.name;
  elements.fileMeta.textContent = `${formatDate(file.createdAt)} · ${formatSize(file.size)}`;
  elements.filePath.textContent = file.path;

  elements.preview.className = 'preview';
  if (file.previewKind === 'text') {
    try {
      const text = await window.fileTriage.readTextFile(file.path);
      elements.preview.innerHTML = `<pre>${escapeHtml(text.slice(0, 250000))}</pre>`;
    } catch {
      renderUnsupported(file);
    }
  } else if (file.previewKind === 'video') {
    elements.preview.innerHTML = `<video controls src="${file.previewUrl}"></video>`;
  } else if (file.previewKind === 'audio') {
    elements.preview.innerHTML = `<audio controls src="${file.previewUrl}"></audio>`;
  } else if (file.previewKind === 'embed') {
    elements.preview.innerHTML = `<embed src="${file.previewUrl}">`;
  } else {
    renderUnsupported(file);
  }
}

function renderUnsupported(file) {
  elements.preview.className = 'preview unsupported-preview';
  elements.preview.innerHTML = `<div class="empty-icon">▣</div><div class="empty-title">${escapeHtml(t('unsupportedTitle'))}</div><div class="empty-copy">${escapeHtml(t('unsupportedCopy', { name: file.name }))}</div>`;
}

function renderActions() {
  elements.actions.innerHTML = '';

  state.targets.forEach((target, index) => {
    const button = actionButton(`${index + 1} 📁 ${baseName(target)}`, t('moveHelp', { path: target }), () => {
      state.selectedActionIndex = index;
      moveCurrentFile(target);
    });
    button.classList.toggle('selected', state.selectedActionIndex === index);
    button.disabled = !currentFile() || index > 8;
    elements.actions.append(button);
  });

  const skipIndex = state.targets.length;
  const skip = actionButton(t('skip'), t('skipHelp'), () => {
    state.selectedActionIndex = skipIndex;
    skipCurrentFile();
  });
  skip.classList.toggle('selected', state.selectedActionIndex === skipIndex);
  skip.disabled = !currentFile();
  elements.actions.append(skip);

  const trashIndex = state.targets.length + 1;
  const trash = actionButton(t('trash'), t('trashHelp'), () => {
    state.selectedActionIndex = trashIndex;
    trashCurrentFile();
  });
  trash.classList.add('danger');
  trash.classList.toggle('selected', state.selectedActionIndex === trashIndex);
  trash.disabled = !currentFile();
  elements.actions.append(trash);
}

function actionButton(text, title, onClick) {
  const button = document.createElement('button');
  button.className = 'action-button';
  button.textContent = text;
  button.title = title;
  button.addEventListener('click', onClick);
  return button;
}

function performSelectedAction() {
  const selected = state.selectedActionIndex;
  if (state.targets[selected]) {
    moveCurrentFile(state.targets[selected]);
  } else if (selected === state.targets.length) {
    skipCurrentFile();
  } else {
    trashCurrentFile();
  }
}

function moveSelection(offset) {
  const count = actionCount();
  if (count === 0) return;
  state.selectedActionIndex = (state.selectedActionIndex + offset + count) % count;
  renderActions();
}

function selectTrash() {
  state.selectedActionIndex = state.targets.length + 1;
}

function removeCurrentFile() {
  state.files.splice(state.currentIndex, 1);
  if (state.currentIndex >= state.files.length) {
    state.currentIndex = Math.max(state.files.length - 1, 0);
  }
}

function currentFile() {
  return state.files[state.currentIndex] || null;
}

function actionCount() {
  return state.targets.length + 2;
}

function mergePaths(target, additions) {
  for (const folder of additions) {
    if (!target.includes(folder)) {
      target.push(folder);
    }
  }
}

function renderStaticText() {
  elements.addSources.textContent = t('addSources');
  elements.addSources.title = t('addSourcesHelp');
  elements.rescan.textContent = t('rescan');
  elements.rescan.title = t('rescanHelp');
  elements.subfoldersLabel.querySelector('span').textContent = t('subfolders');
  elements.subfoldersLabel.title = t('subfoldersHelp');
  elements.hiddenLabel.querySelector('span').textContent = t('hiddenFiles');
  elements.hiddenLabel.title = t('hiddenHelp');
  elements.undo.textContent = t('undo');
  elements.undo.title = t('undoHelp');
  elements.sourcesTitle.textContent = t('sources');
  elements.targetsTitle.textContent = t('targets');
  elements.addSourcesSmall.title = t('addSourceHelp');
  elements.addTargets.title = t('addTargetHelp');
  elements.reveal.textContent = t('reveal');
  elements.reveal.title = t('revealHelp');
  elements.reload.textContent = t('reload');
  elements.reload.title = t('reloadHelp');
  elements.openFile.textContent = t('open');
  elements.openFile.title = t('openHelp');
  document.title = 'File Triage';
}

function setStatus(key, values = {}) {
  state.statusKey = key;
  state.statusValues = values;
  elements.status.textContent = t(key, values);
}

function t(key, values = {}) {
  let text = translations[state.language][key] || translations.en[key] || key;
  for (const [name, value] of Object.entries(values)) {
    text = text.replaceAll(`{${name}}`, value);
  }
  return text;
}

function baseName(filePath) {
  return filePath.split(/[\\/]/).filter(Boolean).pop() || filePath;
}

function formatDate(value) {
  return new Intl.DateTimeFormat(state.language === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value));
}

function formatSize(bytes) {
  return new Intl.NumberFormat(state.language === 'zh' ? 'zh-CN' : 'en-US', {
    style: 'unit',
    unit: 'byte',
    unitDisplay: 'narrow',
    notation: bytes > 1024 * 1024 ? 'compact' : 'standard'
  }).format(bytes);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function pathToPreviewUrl(filePath) {
  return `file:///${filePath.replaceAll('\\', '/').replace(/^\/+/, '')}`;
}

function previewKind(filePath) {
  const extension = filePath.toLowerCase().match(/\.[^.]+$/)?.[0] || '';
  if (['.txt', '.md', '.csv', '.json', '.xml', '.html', '.css', '.js', '.ts', '.log'].includes(extension)) return 'text';
  if (['.mp4', '.m4v', '.mov', '.webm'].includes(extension)) return 'video';
  if (['.mp3', '.wav', '.ogg'].includes(extension)) return 'audio';
  if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.pdf'].includes(extension)) return 'embed';
  return 'unsupported';
}
