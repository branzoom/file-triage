const state = {
  sources: [],
  targets: [],
  files: [],
  currentIndex: 0,
  selectedActionIndex: 0,
  undoStack: []
};

const elements = {
  addSources: document.getElementById('addSources'),
  addSourcesSmall: document.getElementById('addSourcesSmall'),
  addTargets: document.getElementById('addTargets'),
  rescan: document.getElementById('rescan'),
  includeSubfolders: document.getElementById('includeSubfolders'),
  includeHidden: document.getElementById('includeHidden'),
  undo: document.getElementById('undo'),
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
  const folders = await window.fileTriage.chooseFolders('添加来源文件夹');
  mergePaths(state.sources, folders);
  await scan();
}

async function addTargets() {
  const folders = await window.fileTriage.chooseFolders('添加目标文件夹');
  mergePaths(state.targets, folders);
  render();
}

async function scan() {
  if (state.sources.length === 0) {
    state.files = [];
    state.currentIndex = 0;
    state.undoStack = [];
    setStatus('请选择一个或多个来源文件夹');
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
    setStatus(state.files.length === 0 ? '没有找到文件' : `已从 ${state.sources.length} 个来源扫描 ${state.files.length} 个文件`);
  } catch (error) {
    setStatus(`扫描失败：${error.message}`);
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
    setStatus(`已移动到 ${baseName(target)}`);
    render();
  } catch (error) {
    setStatus(`移动失败：${error.message}`);
  }
}

async function trashCurrentFile() {
  const file = currentFile();
  if (!file) return;

  try {
    await window.fileTriage.trashFile(file.path);
    state.undoStack.push({ type: 'trash', originalPath: file.path });
    removeCurrentFile();
    setStatus('已移入回收站');
    render();
  } catch (error) {
    setStatus(`移入回收站失败：${error.message}`);
  }
}

async function undo() {
  const lastAction = state.undoStack.pop();
  if (!lastAction) {
    setStatus('没有可撤销的操作');
    return;
  }

  if (lastAction.type === 'trash') {
    setStatus('Windows 回收站项目请在回收站中手动还原');
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
    setStatus('已撤销');
    render();
  } catch (error) {
    setStatus(`撤销失败：${error.message}`);
  }
}

function skipCurrentFile() {
  if (state.files.length === 0) return;
  state.currentIndex = Math.min(state.currentIndex + 1, state.files.length - 1);
  setStatus('已跳过');
  render();
}

function render() {
  renderSources();
  renderTargets();
  renderPreview();
  renderActions();
  elements.progress.textContent = state.files.length === 0 ? '0 / 0' : `${state.currentIndex + 1} / ${state.files.length}`;
}

function renderSources() {
  renderPathList(elements.sources, state.sources, '删除这个来源，并重新扫描', async (source) => {
    state.sources = state.sources.filter((item) => item !== source);
    await scan();
  }, '添加一个或多个文件夹后开始扫描。');
}

function renderTargets() {
  renderPathList(elements.targets, state.targets, '删除这个目标文件夹按钮', (target) => {
    state.targets = state.targets.filter((item) => item !== target);
    state.selectedActionIndex = Math.min(state.selectedActionIndex, actionCount() - 1);
    render();
  }, '添加目标文件夹后，下方会出现分拣按钮。');
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
    elements.preview.innerHTML = '<div class="empty-icon">▣</div><div class="empty-title">没有选中文件</div><div class="empty-copy">请选择来源文件夹，或添加更多文件后继续。</div>';
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
  elements.preview.innerHTML = `<div class="empty-icon">▣</div><div class="empty-title">无法直接预览</div><div class="empty-copy">${escapeHtml(file.name)} 可以用“定位”在资源管理器中查看，或点“打开”用默认程序确认。</div>`;
}

function renderActions() {
  elements.actions.innerHTML = '';

  state.targets.forEach((target, index) => {
    const button = actionButton(`${index + 1} 📁 ${baseName(target)}`, `将当前文件移动到：${target}`, () => {
      state.selectedActionIndex = index;
      moveCurrentFile(target);
    });
    button.classList.toggle('selected', state.selectedActionIndex === index);
    button.disabled = !currentFile() || index > 8;
    elements.actions.append(button);
  });

  const skipIndex = state.targets.length;
  const skip = actionButton('跳过', '暂时跳过当前文件，快捷键：空格', () => {
    state.selectedActionIndex = skipIndex;
    skipCurrentFile();
  });
  skip.classList.toggle('selected', state.selectedActionIndex === skipIndex);
  skip.disabled = !currentFile();
  elements.actions.append(skip);

  const trashIndex = state.targets.length + 1;
  const trash = actionButton('回收站', '将当前文件移入 Windows 回收站，快捷键：Delete 或 Backspace', () => {
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

function setStatus(text) {
  elements.status.textContent = text;
}

function baseName(filePath) {
  return filePath.split(/[\\/]/).filter(Boolean).pop() || filePath;
}

function formatDate(value) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value));
}

function formatSize(bytes) {
  return new Intl.NumberFormat('zh-CN', {
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
