import { renderTemplate, trustedMarkup } from '../internal/templateEngine.js';

function createPaneBody(pane, paneNumber) {
    const html = renderTemplate(`regions/body/${pane.body.type}.hbs`, {
        editorId: `editor${paneNumber}`,
        language: pane.body.language
    });
    return trustedMarkup(html);
}

export { createPaneBody };
