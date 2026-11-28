import { renderTemplate } from '../internal/templateEngine.js';

export function buildPaneHeader({ inHeaderConfig, inPaneLabel, inFetchUrl }) {
    const localHeaderConfig = inHeaderConfig;
    const localPaneLabel = inPaneLabel;
    const localFetchUrl = inFetchUrl;
    if (localHeaderConfig.type === 'none') return '';

    return renderTemplate(`header/${localHeaderConfig.type}.hbs`, {
        label: localPaneLabel,
        fetchUrl: localFetchUrl,
        fileBtnId: localHeaderConfig.fileBtnId,
        fileInputId: localHeaderConfig.fileInputId,
        fetchUrlId: localHeaderConfig.fetchUrlId,
        selectId: localHeaderConfig.selectId,
        options: localHeaderConfig.options ?? []
    });
}
