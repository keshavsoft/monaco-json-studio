import { renderTemplate, trustedMarkup } from '../internal/templateEngine.js';
import { buildPaneHeader } from './buildPaneHeader.js';
import { buildPaneBody } from './buildPaneBody.js';
import { buildPaneFooter } from './buildPaneFooter.js';

export function buildPane(pane) {
    const header = buildPaneHeader(pane);
    const body = buildPaneBody(pane);
    const footer = buildPaneFooter(pane.footer);

    return renderTemplate('pane.hbs', {
        paneNumber: pane.paneNumber,
        key: pane.key,
        header: trustedMarkup(header),
        body: trustedMarkup(body),
        footer: trustedMarkup(footer)
    });
}
