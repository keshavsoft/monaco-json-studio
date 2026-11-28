import { generateStudio } from './generateStudio/index.js';
import { normalizeStudioConfig } from './config/normalizeStudioConfig.js';
import { requirePaneCount } from './config/validators.js';

function createDefaultPanes({ inPaneCount }) {
    const localPaneCount = inPaneCount;

    return Array.from({ length: localPaneCount }, (_, index) => {
        const localPaneNumber = index + 1;
        const localPaneKey = `pane${localPaneNumber}`;

        return {
            key: localPaneKey,
            label: `Pane ${localPaneNumber}`,
            header: { type: 'file-picker' },
            body: {
                type: 'monaco',
                language: 'json',
                fetchUrl: `./data/${localPaneKey}.json`,
                content: {}
            },
            footer: { type: 'none' }
        };
    });
}

export function createStudio(inPaneCount = 1, inFolderName = './monaco-studio', ...inExtraInputs) {
    if (inExtraInputs.length > 0) {
        throw new TypeError('createStudio accepts only paneCount and folderName.');
    }

    const localPaneCount = requirePaneCount(inPaneCount);
    const localPanes = createDefaultPanes({ inPaneCount: localPaneCount });
    const localStudioConfig = normalizeStudioConfig({
        title: 'Monaco Studio',
        folderName: inFolderName,
        panes: localPanes
    });
    const localTitle = localStudioConfig.title;
    const localFolderName = localStudioConfig.folderName;
    const localNormalizedPanes = localStudioConfig.panes;

    return generateStudio({
        inTitle: localTitle,
        inFolderName: localFolderName,
        inPanes: localNormalizedPanes
    });
}

export default createStudio;
