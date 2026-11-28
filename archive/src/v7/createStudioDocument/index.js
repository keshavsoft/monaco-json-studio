import { createStudioFooter } from '../createStudioFooter/index.js';
import { createStudioHeader } from '../createStudioHeader/index.js';
import { createWorkspace } from '../createWorkspace/index.js';
import { renderTemplate, trustedMarkup } from '../internal/templateEngine.js';

function createStudioDocument(config) {
    const paneCount = config.panes.length;
    return trustedMarkup(renderTemplate('document.hbs', {
        title: config.title,
        paneCount,
        paneWord: paneCount === 1 ? 'pane' : 'panes',
        studioHeader: createStudioHeader(config),
        workspace: createWorkspace(config),
        studioFooter: createStudioFooter(config)
    }));
}

export { createStudioDocument };
