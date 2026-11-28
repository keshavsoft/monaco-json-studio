import { renderTemplate, trustedMarkup } from '../internal/templateEngine.js';
import { renderHeader } from '../header/index.js';
import { renderBody } from '../body/index.js';
import { renderFooter } from '../footer/index.js';

function paneWord(paneCount) {
    return paneCount === 1 ? 'pane' : 'panes';
}

function buildPaneHtml(pane) {
    return renderTemplate('pane.hbs', {
        paneNumber: pane.paneNumber,
        key: pane.key,
        header: trustedMarkup(renderHeader(pane)),
        body: trustedMarkup(renderBody(pane)),
        footer: trustedMarkup(renderFooter(pane))
    });
}

export function buildHtml(config) {
    const paneCount = config.panes.length;
    const countLabel = `${paneCount} ${paneCount === 1 ? 'Pane' : 'Panes'} Active`;

    const studioHeader = renderTemplate('studio-header.hbs', {
        title: config.title,
        countLabel
    });

    const panesMarkup = config.panes.map(buildPaneHtml).join('\n');
    const workspace = renderTemplate('workspace.hbs', {
        paneCount,
        panes: trustedMarkup(panesMarkup)
    });

    const studioFooter = renderTemplate('studio-footer.hbs', { countLabel });

    return `${renderTemplate('document.hbs', {
        title: config.title,
        paneCount,
        paneWord: paneWord(paneCount),
        studioHeader: trustedMarkup(studioHeader),
        workspace: trustedMarkup(workspace),
        studioFooter: trustedMarkup(studioFooter)
    })}\n`;
}
