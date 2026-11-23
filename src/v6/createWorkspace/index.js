import { createPane } from '../createPane/index.js';
import { getPaneProfiles } from '../internal/paneProfiles.js';
import { renderTemplate, trustedMarkup } from '../internal/templateEngine.js';

function createWorkspace(paneCount) {
    const paneMarkup = getPaneProfiles(paneCount)
        .map((pane, index) => createPane(pane, index + 1).toString())
        .join('\n');

    return trustedMarkup(renderTemplate('workspace.hbs', {
        paneCount,
        panes: trustedMarkup(paneMarkup)
    }));
}

export { createWorkspace };
