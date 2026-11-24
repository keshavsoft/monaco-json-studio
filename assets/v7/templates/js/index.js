import { bindEvents } from 'https://keshavsoft.github.io/dom-primitive-bindings/dist/v7/min.js';
import bindings from './bindings.json' with { type: 'json' };
import actions from './actions.js';
import { paneConfigs, state } from './state.js';
import { byId, setStatus } from './dom.js';
import { loadMonaco, loadInitialValue, updateCursor } from './monaco.js';

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

async function initPane(monaco, pane) {
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

    const update = () => updateCursor(editor, pane);
    editor.onDidFocusEditorText(update);
    editor.onDidChangeCursorPosition(update);
    editor.onDidChangeModelContent(() => {
        state.contents[pane.paneNumber - 1] = editor.getValue();
    });
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

    await Promise.all(paneConfigs.map((pane) => initPane(monaco, pane)));

    const workspace = document.querySelector('.studio-workspace');
    bindEvents(workspace, bindings, actions);

    setStatus('Ready ✓');
}

start();
