import { renderTemplate, trustedMarkup } from '../internal/templateEngine.js';
import { buildStudioHeader } from './buildStudioHeader.js';
import { buildWorkspace } from './buildWorkspace.js';
import { buildStudioFooter } from './buildStudioFooter.js';

function getPaneWord({ inPaneCount }) {
    const localPaneCount = inPaneCount;
    return localPaneCount === 1 ? 'pane' : 'panes';
}

function assembleStudioDocument({
    inTitle,
    inPaneCount,
    inStudioHeaderHtml,
    inWorkspaceHtml,
    inStudioFooterHtml
}) {
    const localTitle = inTitle;
    const localPaneCount = inPaneCount;
    const localStudioHeaderHtml = inStudioHeaderHtml;
    const localWorkspaceHtml = inWorkspaceHtml;
    const localStudioFooterHtml = inStudioFooterHtml;

    return `${renderTemplate('document.hbs', {
        title: localTitle,
        paneCount: localPaneCount,
        paneWord: getPaneWord({ inPaneCount: localPaneCount }),
        studioHeader: trustedMarkup(localStudioHeaderHtml),
        workspace: trustedMarkup(localWorkspaceHtml),
        studioFooter: trustedMarkup(localStudioFooterHtml)
    })}\n`;
}

export function buildStudioUi({ inTitle, inPanes }) {
    const localTitle = inTitle;
    const localPanes = inPanes;
    const localPaneCount = localPanes.length;
    const localStudioHeaderHtml = buildStudioHeader({ inPanes: localPanes, inTitle: localTitle });
    const localWorkspaceHtml = buildWorkspace({ inPanes: localPanes });
    const localStudioFooterHtml = buildStudioFooter({ inPaneCount: localPaneCount });

    return assembleStudioDocument({
        inTitle: localTitle,
        inPaneCount: localPaneCount,
        inStudioHeaderHtml: localStudioHeaderHtml,
        inWorkspaceHtml: localWorkspaceHtml,
        inStudioFooterHtml: localStudioFooterHtml
    });
}
