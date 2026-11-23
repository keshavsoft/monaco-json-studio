import { renderTemplate, trustedMarkup } from '../internal/templateEngine.js';

function createStudioFooter(config) {
    const paneCount = config.panes.length;
    return trustedMarkup(renderTemplate('studio-footer.hbs', {
        brandFooter: config.brandFooter,
        paneCount,
        paneSuffix: paneCount === 1 ? '' : 's'
    }));
}

export { createStudioFooter };
