import { renderTemplate, trustedMarkup } from '../internal/templateEngine.js';
import { buildPane } from './buildPane.js';

export function buildWorkspace({ inPanes }) {
    const localPanes = inPanes;
    const localPanesHtml = localPanes.map((inPaneConfig) => {
        const localPaneConfig = inPaneConfig;
        return buildPane({
            inPaneNumber: localPaneConfig.paneNumber,
            inPaneKey: localPaneConfig.key,
            inPaneLabel: localPaneConfig.label,
            inPaneHeaderConfig: localPaneConfig.header,
            inPaneBodyConfig: localPaneConfig.body,
            inPaneFooterConfig: localPaneConfig.footer
        });
    }).join('\n');

    return renderTemplate('workspace.hbs', {
        paneCount: localPanes.length,
        panes: trustedMarkup(localPanesHtml)
    });
}
