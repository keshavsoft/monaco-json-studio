import { renderTemplate } from '../internal/templateEngine.js';

export function buildPaneFooter({ inFooterConfig }) {
    const localFooterConfig = inFooterConfig;
    if (localFooterConfig.type === 'none') return '';

    return renderTemplate(`footer/${localFooterConfig.type}.hbs`, {
        cursorId: localFooterConfig.cursorId,
        text: localFooterConfig.text
    });
}
