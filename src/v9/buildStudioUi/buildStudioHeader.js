import { renderTemplate } from '../internal/templateEngine.js';

export function buildStudioHeader(config) {
    const paneCount = config.panes.length;
    const countLabel = `${paneCount} ${paneCount === 1 ? 'Pane' : 'Panes'} Active`;

    return renderTemplate('studio-header.hbs', {
        title: config.title,
        countLabel
    });
}
