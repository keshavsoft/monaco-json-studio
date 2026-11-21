export const $ = (id) => document.getElementById(id);

export const state = {
    paneCount: 2,
    editors: [],
    fileNames: ['instructions.json', 'data.json'],
    contents: []
};

export const pretty = (v) => {
    if (typeof v === 'string') {
        try {
            return JSON.stringify(JSON.parse(v), null, 2);
        } catch {
            return v;
        }
    }
    return JSON.stringify(v, null, 2);
};

export async function loadInitialData(filename) {
    try {
        const res = await fetch(`./data/${filename}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        return pretty(data);
    } catch (err) {
        console.warn('Fallback loading', filename, err);
        return pretty({ "status": "ready", "file": filename });
    }
}

export function setStatus(text) {
    const pill = $('statusPill');
    const textEl = $('statusText');
    if (!pill || !textEl) return;
    
    textEl.textContent = text;
    pill.classList.remove('hidden');
    
    clearTimeout(setStatus._timer);
    setStatus._timer = setTimeout(() => {
        pill.classList.add('hidden');
    }, 3000);
}
