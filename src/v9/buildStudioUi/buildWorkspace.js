import { renderTemplate, trustedMarkup } from '../internal/templateEngine.js';
import { buildPane } from './buildPane.js';

export function buildWorkspace(config) {
    const panes = config.panes.map((pane) => buildPane(pane)).join('\n');

    return renderTemplate('workspace.hbs', {
        paneCount: config.panes.length,
        panes: trustedMarkup(panes)
    });
}
