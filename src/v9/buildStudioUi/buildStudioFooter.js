import { renderTemplate } from '../internal/templateEngine.js';

export function buildStudioFooter(config) {
    const paneCount = config.panes.length;
    const countLabel = `${paneCount} ${paneCount === 1 ? 'Pane' : 'Panes'} Active`;

    return renderTemplate('studio-footer.hbs', { countLabel });
}
