import { renderTemplate } from '../internal/templateEngine.js';

export function buildPaneHeader({ inHeaderConfig, inPaneLabel, inFileName }) {
    const localHeaderConfig = inHeaderConfig;
    const localPaneLabel = inPaneLabel;
    const localFileName = inFileName;
    if (localHeaderConfig.type === 'none') return '';

    return renderTemplate(`header/${localHeaderConfig.type}.hbs`, {
        label: localPaneLabel,
        fileName: localFileName,
        fileBtnId: localHeaderConfig.fileBtnId,
        fileInputId: localHeaderConfig.fileInputId,
        fileNameId: localHeaderConfig.fileNameId,
        selectId: localHeaderConfig.selectId,
        options: localHeaderConfig.options ?? []
    });
}
