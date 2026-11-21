import { assembleSpec } from '../assembleSpec/index.js';
import { specToHtml } from '../specToHtml/index.js';

/**
 * buildHtml (v3) - 100% Spec-Driven HTML Document Compiler.
 *
 * ZERO hardcoded HTML string concatenation.
 * Delegates entirely to:
 * 1. assembleSpec: Assembles the complete JSON specification tree from clean single-source-of-truth specs.
 * 2. specToHtml: Compiles that specification tree into clean static HTML5.
 *
 * @param {Object} inArgs
 * @param {number} [inArgs.inPanes=2] - Number of editor panes (1, 2, or 3)
 * @param {string} [inArgs.inTitle="Monaco Studio"] - Studio branding title
 * @param {Array<string>} [inArgs.inFiles] - Default file names for each pane
 * @returns {string} The complete, self-contained, 100% static HTML5 document
 */
const buildHtml = ({ inPanes = 2, inTitle = "Monaco Studio", inFiles } = {}) => {
    const docSpec = assembleSpec({
        inPanes,
        inTitle,
        inFiles
    });

    const bodyHtml = specToHtml({ inSpec: docSpec, inIndent: 0 });
    return `<!DOCTYPE html>\n${bodyHtml}\n`;
};

export { buildHtml };
export default buildHtml;
