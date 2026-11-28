import { createPane } from '../createPane/index.js';
import { renderTemplate, trustedMarkup } from '../internal/templateEngine.js';

function createWorkspace(config) {
    const paneMarkup = config.panes
        .map((pane, index) => createPane(pane, index + 1).toString())
        .join('\n');

    return trustedMarkup(renderTemplate('workspace.hbs', {
        paneCount: config.panes.length,
        panes: trustedMarkup(paneMarkup)
    }));
}

export { createWorkspace };
