import { renderTemplate, trustedMarkup } from '../internal/templateEngine.js';
import { buildPaneHeader } from './buildPaneHeader.js';
import { buildPaneBody } from './buildPaneBody.js';
import { buildPaneFooter } from './buildPaneFooter.js';

export function buildPane({
    inPaneNumber,
    inPaneKey,
    inPaneLabel,
    inPaneHeaderConfig,
    inPaneBodyConfig,
    inPaneFooterConfig
}) {
    const localPaneNumber = inPaneNumber;
    const localPaneKey = inPaneKey;
    const localPaneLabel = inPaneLabel;
    const localPaneHeaderConfig = inPaneHeaderConfig;
    const localPaneBodyConfig = inPaneBodyConfig;
    const localPaneFooterConfig = inPaneFooterConfig;

    const localHeaderHtml = buildPaneHeader({
        inHeaderConfig: localPaneHeaderConfig,
        inPaneLabel: localPaneLabel,
        inFetchUrl: localPaneBodyConfig.fetchUrl
    });
    const localBodyHtml = buildPaneBody({ inBodyConfig: localPaneBodyConfig });
    const localFooterHtml = buildPaneFooter({ inFooterConfig: localPaneFooterConfig });

    return renderTemplate('pane.hbs', {
        paneNumber: localPaneNumber,
        key: localPaneKey,
        header: trustedMarkup(localHeaderHtml),
        body: trustedMarkup(localBodyHtml),
        footer: trustedMarkup(localFooterHtml)
    });
}
