import { generateStudio } from './generateStudio/index.js';
import { normalizeStudioConfig } from './internal/normalizeStudioConfig.js';

function createStudio(config) {
    return generateStudio(normalizeStudioConfig(config));
}

export { createStudio };
export default createStudio;
