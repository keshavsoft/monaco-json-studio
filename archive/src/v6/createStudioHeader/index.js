import { renderTemplate, trustedMarkup } from '../internal/templateEngine.js';

function createStudioHeader(paneCount) {
    return trustedMarkup(renderTemplate('studio-header.hbs', {
        title: 'Monaco Studio',
        paneCount,
        paneSuffix: paneCount === 1 ? '' : 's'
    }));
}

export { createStudioHeader };
