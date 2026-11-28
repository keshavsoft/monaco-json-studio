import { renderTemplate, trustedMarkup } from '../internal/templateEngine.js';
import { buildStudioHeader } from './buildStudioHeader.js';
import { buildWorkspace } from './buildWorkspace.js';
import { buildStudioFooter } from './buildStudioFooter.js';

function getPaneWord(paneCount) {
    return paneCount === 1 ? 'pane' : 'panes';
}

function assembleStudioDocument(config, studioHeader, workspace, studioFooter) {
    return `${renderTemplate('document.hbs', {
        title: config.title,
        paneCount: config.panes.length,
        paneWord: getPaneWord(config.panes.length),
        studioHeader: trustedMarkup(studioHeader),
        workspace: trustedMarkup(workspace),
        studioFooter: trustedMarkup(studioFooter)
    })}\n`;
}

export function buildStudioUi(config) {
    const studioHeader = buildStudioHeader(config);
    const workspace = buildWorkspace(config);
    const studioFooter = buildStudioFooter(config);

    return assembleStudioDocument(config, studioHeader, workspace, studioFooter);
}
