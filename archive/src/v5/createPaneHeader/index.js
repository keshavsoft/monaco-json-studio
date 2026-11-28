import { interpolate, readSpec } from '../internal/specTools.js';

function createPaneHeader(pane, paneNumber) {
    const template = readSpec(`v5/specs/regions/header/${pane.headerType}.spec.json`);
    return interpolate(template, {
        label: pane.label,
        fileName: pane.fileName,
        fileBtnId: `openFileBtn${paneNumber}`,
        fileInputId: `fileInput${paneNumber}`,
        fileNameId: `fileName${paneNumber}`
    });
}

export { createPaneHeader };
