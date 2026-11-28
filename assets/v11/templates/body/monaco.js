import { pretty } from '../dom.js';

export function loadMonaco() {
    if (window.monaco) return Promise.resolve(window.monaco);
    if (typeof window.require !== 'function') {
        return Promise.reject(new Error('Monaco loader is unavailable.'));
    }
    window.require.config({
        paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs' }
    });
    return new Promise((resolve, reject) => {
        window.require(['vs/editor/editor.main'], () => resolve(window.monaco), reject);
    });
};

export async function loadInitialValue(fetchUrl) {
    try {
        const response = await fetch(fetchUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return pretty(await response.text());
    } catch {
        return pretty({ message: `Default content for ${fileName}` });
    }
};