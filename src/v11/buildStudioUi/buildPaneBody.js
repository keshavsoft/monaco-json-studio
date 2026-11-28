import { renderTemplate } from '../internal/templateEngine.js';

export function buildPaneBody({ inBodyConfig }) {
    const localBodyConfig = inBodyConfig;

    return renderTemplate(`body/${localBodyConfig.type}.hbs`, {
        editorId: localBodyConfig.editorId,
        language: localBodyConfig.language
    });
}
