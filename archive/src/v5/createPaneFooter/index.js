import { interpolate, readSpec } from '../internal/specTools.js';

function createPaneFooter(pane, paneNumber) {
    if (pane.footerType === 'none') return null;
    const template = readSpec(`v5/specs/regions/footer/${pane.footerType}.spec.json`);
    return interpolate(template, {
        cursorId: `paneCursor${paneNumber}`,
        text: pane.footerText || ''
    });
}

export { createPaneFooter };
