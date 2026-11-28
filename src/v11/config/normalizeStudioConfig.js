import { requireObject, requireText } from './validators.js';
import { normalizeHeader } from './normalizeHeader.js';
import { normalizeBody } from './normalizeBody.js';
import { normalizeFooter } from './normalizeFooter.js';

const paneKeyPattern = /^[A-Za-z][A-Za-z0-9_-]*$/;

export function normalizeStudioConfig(inRawConfig) {
    const localRawConfig = inRawConfig;
    const localInputConfig = requireObject(localRawConfig, 'config');
    if (!Array.isArray(localInputConfig.panes) || localInputConfig.panes.length < 1 || localInputConfig.panes.length > 3) {
        throw new TypeError('config.panes must be an array with 1 to 3 panes.');
    }

    const localTitle = requireText(localInputConfig.title, 'config.title', 'Monaco Studio');
    const localOutputDir = requireText(localInputConfig.outputDir, 'config.outputDir', './monaco-studio');
    const localUsedKeys = new Set();

    const localPanes = localInputConfig.panes.map((inRawPaneConfig, index) => {
        const localRawPaneConfig = inRawPaneConfig;
        const localPaneNumber = index + 1;
        const localPaneLocation = `panes[${index}]`;
        const localPaneConfig = requireObject(localRawPaneConfig, localPaneLocation);
        const localPaneKey = requireText(localPaneConfig.key, `${localPaneLocation}.key`, undefined);

        if (!paneKeyPattern.test(localPaneKey)) {
            throw new TypeError(`${localPaneLocation}.key must start with a letter and contain only letters, numbers, "-" or "_".`);
        }
        if (localUsedKeys.has(localPaneKey)) {
            throw new TypeError(`Duplicate pane key "${localPaneKey}" in config.panes.`);
        }
        localUsedKeys.add(localPaneKey);

        const localPaneLabel = requireText(localPaneConfig.label, `${localPaneLocation}.label`, localPaneKey);
        const localHeaderConfig = normalizeHeader({
            inRawHeader: localPaneConfig.header,
            inPaneKey: localPaneKey,
            inPaneNumber: localPaneNumber,
            inLocation: `${localPaneLocation}.header`
        });
        const localBodyConfig = normalizeBody({
            inRawBody: localPaneConfig.body,
            inPaneKey: localPaneKey,
            inPaneNumber: localPaneNumber,
            inSelectedOption: localHeaderConfig.selectedOption,
            inLocation: `${localPaneLocation}.body`
        });
        const localFooterConfig = normalizeFooter({
            inRawFooter: localPaneConfig.footer,
            inPaneNumber: localPaneNumber,
            inLocation: `${localPaneLocation}.footer`
        });
        const localDataFiles = localHeaderConfig.type === 'select'
            ? localHeaderConfig.options
                .filter((option) => option.writeToDataDir)
                .map((option) => ({ fileName: option.fileName, contentText: option.contentText }))
            : localBodyConfig.writeToDataDir
                ? [{ fileName: localBodyConfig.fileName, contentText: localBodyConfig.contentText }]
                : [];

        return {
            paneNumber: localPaneNumber,
            key: localPaneKey,
            label: localPaneLabel,
            header: localHeaderConfig,
            body: localBodyConfig,
            footer: localFooterConfig,
            dataFiles: localDataFiles
        };
    });

    return { title: localTitle, outputDir: localOutputDir, panes: localPanes };
}
