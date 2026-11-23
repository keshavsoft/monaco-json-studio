import { createStudioFooter } from '../createStudioFooter/index.js';
import { createStudioHeader } from '../createStudioHeader/index.js';
import { createWorkspace } from '../createWorkspace/index.js';
import { renderTemplate, trustedMarkup } from '../internal/templateEngine.js';

function createStudioDocument(paneCount) {
    const title = 'Monaco Studio';
    return trustedMarkup(renderTemplate('document.hbs', {
        title,
        paneCount,
        paneWord: paneCount === 1 ? 'pane' : 'panes',
        studioHeader: createStudioHeader(paneCount),
        workspace: createWorkspace(paneCount),
        studioFooter: createStudioFooter(paneCount)
    }));
}

export { createStudioDocument };
