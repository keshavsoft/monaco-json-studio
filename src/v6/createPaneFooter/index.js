import { renderTemplate, trustedMarkup } from '../internal/templateEngine.js';

function createPaneFooter(pane, paneNumber) {
    if (pane.footerType === 'none') return trustedMarkup('');
    const templatePath = `regions/footer/${pane.footerType}.hbs`;
    const html = renderTemplate(templatePath, {
        cursorId: `paneCursor${paneNumber}`,
        text: pane.footerText || ''
    });
    return trustedMarkup(html);
}

export { createPaneFooter };
