import { createStudioDocument } from '../createStudioDocument/index.js';
import { serializeHtml } from '../serializeHtml/index.js';
import { validatePaneCount } from '../internal/paneCount.js';

function buildHtml(paneCount) {
    const count = validatePaneCount(paneCount);
    return `<!doctype html>\n${serializeHtml(createStudioDocument(count))}\n`;
}

export { buildHtml };
