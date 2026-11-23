import { renderTemplate, trustedMarkup } from '../internal/templateEngine.js';

function createStudioHeader(config) {
    const paneCount = config.panes.length;
    return trustedMarkup(renderTemplate('studio-header.hbs', {
        title: config.title,
        paneCount,
        paneSuffix: paneCount === 1 ? '' : 's'
    }));
}

export { createStudioHeader };
