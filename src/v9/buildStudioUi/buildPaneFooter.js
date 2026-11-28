import { renderTemplate } from '../internal/templateEngine.js';

export function buildPaneFooter(footer) {
    if (footer.type === 'none') return '';

    return renderTemplate(`footer/${footer.type}.hbs`, {
        cursorId: footer.cursorId,
        text: footer.text
    });
}
