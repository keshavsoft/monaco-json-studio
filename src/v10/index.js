import { generateStudio } from './generateStudio/index.js';
import { normalizeStudioConfig } from './config/normalizeStudioConfig.js';

export function createStudio(inConfig) {
    const localStudioConfig = normalizeStudioConfig(inConfig);
    const localTitle = localStudioConfig.title;
    const localOutputDir = localStudioConfig.outputDir;
    const localPanes = localStudioConfig.panes;

    return generateStudio({
        inTitle: localTitle,
        inOutputDir: localOutputDir,
        inPanes: localPanes
    });
}

export default createStudio;
