import { renderTemplate } from '../internal/templateEngine.js';

export function buildStudioHeader({ inPanes, inTitle }) {
    const localPanes = inPanes;
    const localTitle = inTitle;
    const localPaneCount = localPanes.length;
    const localCountLabel = `${localPaneCount} ${localPaneCount === 1 ? 'Pane' : 'Panes'} Active`;

    return renderTemplate('studio-header.hbs', {
        title: localTitle,
        countLabel: localCountLabel
    });
}
