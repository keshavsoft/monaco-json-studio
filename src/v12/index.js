import { validatePaneCount, validateFolderName } from './validateInputs/index.js';
import { createPanes } from './createPanes/index.js';
import { generateStudio } from 'monaco-json-studio-base/v1';

export function createStudio(inPaneCount = 1, inFolderName = './monaco-studio') {
    const localPaneCount = validatePaneCount(inPaneCount);
    const localFolderName = validateFolderName(inFolderName);
    const localPanes = createPanes({ inPaneCount: localPaneCount });

    return generateStudio({
        inTitle: 'Monaco Studio',
        inFolderName: localFolderName,
        inPanes: localPanes
    });
}
