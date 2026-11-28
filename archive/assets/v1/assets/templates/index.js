import { $, state, pretty, loadInitialData, setStatus } from './state.js';

async function initMonaco() {
    return new Promise((resolve, reject) => {
        if (window.monaco) {
            return resolve(window.monaco);
        }
        require.config({
            paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs' }
        });
        require(['vs/editor/editor.main'], () => resolve(window.monaco), reject);
    });
}

function wirePane({ editor, fileBtnId, fileInputId, fileNameId, index }) {
    const fileBtn = $(fileBtnId);
    const fileInput = $(fileInputId);
    const fileNameEl = $(fileNameId);

    if (!fileBtn || !fileInput) return;

    fileBtn.addEventListener('click', () => {
        fileInput.value = '';
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
            const text = ev.target.result;
            const formatted = pretty(text);
            editor.setValue(formatted);

            if (fileNameEl) fileNameEl.textContent = file.name;
            state.fileNames[index] = file.name;
            state.contents[index] = formatted;

            setStatus(`Loaded: ${file.name}`);
        };
        reader.readAsText(file);
    });
}

async function start() {
    try {
        const monaco = await initMonaco();

        const editorConfig = {
            language: 'json',
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

        for (let i = 0; i < state.paneCount; i++) {
            const num = i + 1;
            const container = $(`editor${num}`);
            if (!container) continue;

            const initialText = await loadInitialData(state.fileNames[i]);
            state.contents[i] = initialText;

            const ed = monaco.editor.create(container, {
                ...editorConfig,
                value: initialText
            });
            state.editors[i] = ed;

            wirePane({
                editor: ed,
                fileBtnId: `openFileBtn${num}`,
                fileInputId: `fileInput${num}`,
                fileNameId: `fileName${num}`,
                index: i
            });

            ed.onDidChangeModelContent(() => {
                state.contents[i] = ed.getValue();
            });

            const updateCursor = () => {
                const pos = ed.getPosition();
                const el = $('cursorPos');
                if (el && pos) el.textContent = `Editor ${num} | Ln ${pos.lineNumber}, Col ${pos.column}`;
            };

            ed.onDidFocusEditorText(updateCursor);
            ed.onDidChangeCursorPosition(updateCursor);
        }

        setStatus('Ready ✓');
    } catch (err) {
        console.error('Failed to initialize Monaco studio:', err);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
} else {
    start();
}
