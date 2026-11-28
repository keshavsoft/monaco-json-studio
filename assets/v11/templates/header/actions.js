import { paneConfigs, state } from '../state.js';
import { byId, pretty, setStatus } from '../dom.js';
import { loadInitialValue } from '../body/monaco.js';

function getPaneContext(matchElement) {
    const paneEl = matchElement.closest('.studio-pane');
    const paneKey = paneEl?.dataset.paneKey;
    const pane = paneConfigs.find((item) => item.key === paneKey);
    const editor = pane ? state.editors[pane.paneNumber - 1] : null;
    return { pane, editor };
}

export const actions = {
    openFilePicker: (_event, matchElement) => {
        const { pane } = getPaneContext(matchElement);
        if (!pane) return;
        const input = byId(`fileInput${pane.paneNumber}`);
        if (!input) return;
        input.value = '';
        input.click();
    },

    loadSelectedFile: (_event, matchElement) => {
        const { pane, editor } = getPaneContext(matchElement);
        if (!pane || !editor) return;

        const file = matchElement.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const value = pretty(String(reader.result ?? ''));
            editor.setValue(value);
            state.contents[pane.paneNumber - 1] = value;
            setStatus('Loaded selected file');
        };
        reader.readAsText(file);
    },

    selectPaneDataset: async (_event, matchElement) => {
        const { pane, editor } = getPaneContext(matchElement);
        if (!pane || !editor) return;

        const option = pane.selectOptions.find((item) => item.value === matchElement.value);
        if (!option) return;

        const fetchUrlLabel = byId(`fetchUrl${pane.paneNumber}`);
        const value = await loadInitialValue(option.fetchUrl);
        editor.setValue(value);
        if (fetchUrlLabel) fetchUrlLabel.textContent = option.fetchUrl;
        state.contents[pane.paneNumber - 1] = value;
        setStatus(`Loaded: ${option.label}`);
    }
};

export default actions;
