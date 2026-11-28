import { renderTemplate } from '../internal/templateEngine.js';

export function buildStudioFooter({ inPaneCount }) {
    const localPaneCount = inPaneCount;
    const localCountLabel = `${localPaneCount} ${localPaneCount === 1 ? 'Pane' : 'Panes'} Active`;

    return renderTemplate('studio-footer.hbs', { countLabel: localCountLabel });
}
