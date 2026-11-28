import { createStudioDocument } from '../createStudioDocument/index.js';
import { validatePaneCount } from '../internal/paneCount.js';

function buildHtml(paneCount) {
    const count = validatePaneCount(paneCount);
    return `${createStudioDocument(count)}\n`;
}

export { buildHtml };
