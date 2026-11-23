import { interpolate, readSpec } from '../internal/specTools.js';

function createPaneBody(pane, paneNumber) {
    const template = readSpec(`v5/specs/regions/body/${pane.bodyType}.spec.json`);
    return interpolate(template, {
        editorId: `editor${paneNumber}`,
        language: pane.language
    });
}

export { createPaneBody };
