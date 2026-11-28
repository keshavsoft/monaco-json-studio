import { renderTemplate } from '../internal/templateEngine.js';

export function buildPaneFooter(pane) {
    const { footer } = pane;
    if (footer.type === 'none') return '';

    return renderTemplate(`footer/${footer.type}.hbs`, {
        cursorId: footer.cursorId,
        text: footer.text
    });
}
