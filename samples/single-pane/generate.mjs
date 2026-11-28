import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createStudio } from '../../src/index.js';

const sampleDir = path.dirname(fileURLToPath(import.meta.url));

const generationResult = createStudio(1, path.join(sampleDir, 'generated'));

console.log(`${generationResult.message} ${generationResult.folderPath}`);
