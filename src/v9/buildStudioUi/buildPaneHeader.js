import { renderTemplate } from '../internal/templateEngine.js';

export function buildPaneHeader(pane) {
    const { header, label, body } = pane;
    if (header.type === 'none') return '';

    return renderTemplate(`header/${header.type}.hbs`, {
        label,
        fileName: body.fileName,
        fileBtnId: header.fileBtnId,
        fileInputId: header.fileInputId,
        fileNameId: header.fileNameId,
        selectId: header.selectId,
        options: header.options ?? []
    });
}
