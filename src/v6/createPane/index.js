import { createPaneBody } from '../createPaneBody/index.js';
import { createPaneFooter } from '../createPaneFooter/index.js';
import { createPaneHeader } from '../createPaneHeader/index.js';
import { renderTemplate, trustedMarkup } from '../internal/templateEngine.js';

function createPane(pane, paneNumber) {
    return trustedMarkup(renderTemplate('pane.hbs', {
        key: pane.key,
        paneNumber,
        header: createPaneHeader(pane, paneNumber),
        body: createPaneBody(pane, paneNumber),
        footer: createPaneFooter(pane, paneNumber)
    }));
}

export { createPane };
