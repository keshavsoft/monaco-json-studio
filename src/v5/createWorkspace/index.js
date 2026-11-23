import { createPane } from '../createPane/index.js';
import { getPaneProfiles } from '../internal/paneProfiles.js';

function createWorkspace(paneCount) {
    const panes = getPaneProfiles(paneCount);
    return {
        tagName: 'main',
        attributes: {
            class: 'studio-workspace',
            'data-panes': String(paneCount)
        },
        children: panes.map((pane, index) => createPane(pane, index + 1))
    };
}

export { createWorkspace };
