import { renderTemplate } from '../internal/templateEngine.js';

export function buildPaneBody(pane) {
    return renderTemplate(`body/${pane.body.type}.hbs`, {
        editorId: pane.body.editorId,
        language: pane.body.language
    });
}
