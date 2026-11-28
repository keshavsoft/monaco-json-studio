import { createPaneBody } from '../createPaneBody/index.js';
import { createPaneFooter } from '../createPaneFooter/index.js';
import { createPaneHeader } from '../createPaneHeader/index.js';

function createPane(pane, paneNumber) {
    const children = [
        createPaneHeader(pane, paneNumber),
        createPaneBody(pane, paneNumber),
        createPaneFooter(pane, paneNumber)
    ].filter(Boolean);

    return {
        tagName: 'section',
        attributes: {
            id: `pane${paneNumber}`,
            class: 'studio-pane',
            'data-pane-key': pane.key
        },
        children
    };
}

export { createPane };
