import { assembleSpec } from '../assembleSpec/index.js';
import { specToHtml } from '../specToHtml/index.js';

const buildHtml = (inArgs = {}) => `<!DOCTYPE html>\n${specToHtml({ inSpec: assembleSpec(inArgs) })}\n`;

export { buildHtml };
export default buildHtml;
