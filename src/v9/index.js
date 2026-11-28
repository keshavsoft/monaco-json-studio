import { generateStudio } from './generateStudio/index.js';
import { normalizeStudioConfig } from './config/normalizeStudioConfig.js';

export function createStudio(rawConfig) {
    const studio = normalizeStudioConfig(rawConfig);
    return generateStudio(studio);
}

export default createStudio;
