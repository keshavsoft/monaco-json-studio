import { renderTemplate, trustedMarkup } from '../internal/templateEngine.js';

function createPaneFooter(pane, paneNumber) {
    if (pane.footer.type === 'none') return trustedMarkup('');
    const html = renderTemplate(`regions/footer/${pane.footer.type}.hbs`, {
        cursorId: `paneCursor${paneNumber}`,
        text: pane.footer.text
    });
    return trustedMarkup(html);
}

export { createPaneFooter };
