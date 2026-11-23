import { createStudioDocument } from '../createStudioDocument/index.js';

function buildHtml(config) {
    return `${createStudioDocument(config)}\n`;
}

export { buildHtml };
