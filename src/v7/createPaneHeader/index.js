import { renderTemplate, trustedMarkup } from '../internal/templateEngine.js';

function createPaneHeader(pane, paneNumber) {
    if (pane.header.type === 'none') return trustedMarkup('');

    const options = (pane.header.options ?? []).map((option) => ({
        ...option,
        selected: option.value === pane.header.selectedValue
    }));
    const templateName = `regions/header/${pane.header.type}.hbs`;
    const html = renderTemplate(templateName, {
        label: pane.header.label,
        fileName: pane.body.fileName,
        fileBtnId: `openFileBtn${paneNumber}`,
        fileInputId: `fileInput${paneNumber}`,
        fileNameId: `fileName${paneNumber}`,
        selectId: `paneSelect${paneNumber}`,
        options
    });
    return trustedMarkup(html);
}

export { createPaneHeader };
