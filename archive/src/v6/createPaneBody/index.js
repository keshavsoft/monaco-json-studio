import { renderTemplate, trustedMarkup } from '../internal/templateEngine.js';

function createPaneBody(pane, paneNumber) {
    const templatePath = `regions/body/${pane.bodyType}.hbs`;
    const html = renderTemplate(templatePath, {
        editorId: `editor${paneNumber}`,
        language: pane.language
    });
    return trustedMarkup(html);
}

export { createPaneBody };
