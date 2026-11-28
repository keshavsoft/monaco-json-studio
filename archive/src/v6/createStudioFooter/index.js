import { renderTemplate, trustedMarkup } from '../internal/templateEngine.js';

function createStudioFooter(paneCount) {
    return trustedMarkup(renderTemplate('studio-footer.hbs', {
        paneCount,
        paneSuffix: paneCount === 1 ? '' : 's'
    }));
}

export { createStudioFooter };
