import { renderTemplate, trustedMarkup } from '../internal/templateEngine.js';

function createPaneHeader(pane, paneNumber) {
    const templatePath = `regions/header/${pane.headerType}.hbs`;
    const html = renderTemplate(templatePath, {
        label: pane.label,
        fileName: pane.fileName,
        fileBtnId: `openFileBtn${paneNumber}`,
        fileInputId: `fileInput${paneNumber}`,
        fileNameId: `fileName${paneNumber}`
    });
    return trustedMarkup(html);
}

export { createPaneHeader };
