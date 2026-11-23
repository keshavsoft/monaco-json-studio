import { paneConfigs, state } from './state.js';

const byId = (id) => document.getElementById(id);
const pretty = (value) => {
    if (typeof value === 'string') {
        try { return JSON.stringify(JSON.parse(value), null, 2); } catch { return value; }
    }
    return JSON.stringify(value, null, 2);
};

function setStatus(message, isError = false) {
    const pill = byId('statusPill');
    const text = byId('statusText');
    if (!pill || !text) return;
    text.textContent = message;
    pill.classList.remove('hidden', 'success', 'error');
    pill.classList.add(isError ? 'error' : 'success');
}

function loadMonaco() {
    if (window.monaco) return Promise.resolve(window.monaco);
    if (typeof window.require !== 'function') return Promise.reject(new Error('Monaco loader is unavailable.'));
    window.require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs' } });
    return new Promise((resolve, reject) => {
        window.require(['vs/editor/editor.main'], () => resolve(window.monaco), reject);
    });
}

async function loadInitialValue(fileName) {
    try {
        const response = await fetch(`./data/${encodeURIComponent(fileName)}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return pretty(await response.text());
    } catch {
        return pretty({ message: `Default content for ${fileName}` });
    }
}

function connectFilePicker(pane, editor) {
    if (pane.headerType !== 'file-picker') return;
    const button = byId(`openFileBtn${pane.paneNumber}`);
    const input = byId(`fileInput${pane.paneNumber}`);
    const fileName = byId(`fileName${pane.paneNumber}`);
    if (!button || !input) return;

    button.addEventListener('click', () => {
        input.value = '';
        input.click();
    });
    input.addEventListener('change', (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const value = pretty(String(reader.result ?? ''));
            editor.setValue(value);
            if (fileName) fileName.textContent = file.name;
            state.contents[pane.paneNumber - 1] = value;
            setStatus(`Loaded: ${file.name}`);
        };
        reader.readAsText(file);
    });
}

function connectSelect(pane, editor) {
    if (pane.headerType !== 'select') return;
    const select = byId(`paneSelect${pane.paneNumber}`);
    const fileName = byId(`fileName${pane.paneNumber}`);
    if (!select) return;

    select.addEventListener('change', async () => {
        const option = pane.selectOptions.find((item) => item.value === select.value);
        if (!option) return;
        const value = await loadInitialValue(option.fileName);
        editor.setValue(value);
        if (fileName) fileName.textContent = option.fileName;
        state.contents[pane.paneNumber - 1] = value;
        setStatus(`Loaded: ${option.label}`);
    });
}

function updateCursor(editor, pane) {
    const position = editor.getPosition();
    if (!position) return;
    const text = `${pane.label} | Ln ${position.lineNumber}, Col ${position.column}`;
    const globalCursor = byId('cursorPos');
    if (globalCursor) globalCursor.textContent = text;
    if (pane.footerType === 'cursor') {
        const paneCursor = byId(`paneCursor${pane.paneNumber}`);
        if (paneCursor) paneCursor.textContent = `Ln ${position.lineNumber}, Col ${position.column}`;
    }
}

async function start() {
    let monaco;
    try {
        monaco = await loadMonaco();
    } catch (error) {
        console.error('Failed to load Monaco:', error);
        setStatus('Monaco unavailable', true);
        return;
    }

    const commonOptions = {
        theme: 'vs-dark',
        automaticLayout: true,
        tabSize: 2,
        fontSize: 13,
        lineNumbers: 'on',
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        cursorBlinking: 'smooth',
        renderLineHighlight: 'all',
        padding: { top: 10 }
    };

    await Promise.all(paneConfigs.map(async (pane) => {
        if (pane.bodyType !== 'monaco') return;
        const container = byId(`editor${pane.paneNumber}`);
        if (!container) return;

        const initialValue = await loadInitialValue(pane.fileName);
        const editor = monaco.editor.create(container, {
            ...commonOptions,
            language: pane.language,
            value: initialValue
        });
        state.editors[pane.paneNumber - 1] = editor;
        state.contents[pane.paneNumber - 1] = initialValue;
        connectFilePicker(pane, editor);
        connectSelect(pane, editor);

        const update = () => updateCursor(editor, pane);
        editor.onDidFocusEditorText(update);
        editor.onDidChangeCursorPosition(update);
        editor.onDidChangeModelContent(() => { state.contents[pane.paneNumber - 1] = editor.getValue(); });
    }));

    setStatus('Ready ✓');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
} else {
    start();
}
