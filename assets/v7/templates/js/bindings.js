import { state } from './state.js';
import { byId, pretty, setStatus } from './dom.js';
import { loadInitialValue } from './monaco.js';

function connectFilePicker(pane, editor) {
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

const headerBindings = {
    'file-picker': connectFilePicker,
    'select': connectSelect
};

export function bindPaneHeader(pane, editor) {
    const connect = headerBindings[pane.headerType];
    if (connect) connect(pane, editor);
}
