import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsDir = path.resolve(__dirname, '..', '..', '..', 'assets');

function interpolateSpec({ inSpec, inVars }) {
    const localSpec = inSpec;
    const localVars = inVars;

    if (typeof localSpec === 'string') {
        let result = localSpec;
        for (const [key, val] of Object.entries(localVars)) {
            result = result.replaceAll(`{{${key}}}`, String(val));
        }
        return result;
    }
    if (Array.isArray(localSpec)) {
        return localSpec.map((item) => interpolateSpec({ inSpec: item, inVars: localVars }));
    }
    if (localSpec !== null && typeof localSpec === 'object') {
        const out = {};
        for (const [k, v] of Object.entries(localSpec)) {
            out[k] = interpolateSpec({ inSpec: v, inVars: localVars });
        }
        return out;
    }
    return localSpec;
}

/**
 * Assembles atomic component specifications into a unified Studio specification tree.
 * Follows strict inArgs convention.
 *
 * @param {Object} inArgs
 * @param {number} [inArgs.inPanes=2] - Number of panes (1, 2, or 3)
 * @param {Array<string>} [inArgs.inFiles] - Optional custom file names for each pane
 * @returns {Object} Complete assembled specification tree
 */
const assembleSpec = ({ inPanes = 2, inFiles } = {}) => {
    const localPanes = Math.max(1, Math.min(3, parseInt(inPanes, 10) || 2));
    const defaultFiles = ['instructions.json', 'data.json', 'columns.json'];
    const localFiles = inFiles || defaultFiles.slice(0, localPanes);

    const specsDir = path.join(assetsDir, 'specs');
    const headerSpec = JSON.parse(fs.readFileSync(path.join(specsDir, 'header.spec.json'), 'utf-8'));
    const paneTemplate = JSON.parse(fs.readFileSync(path.join(specsDir, 'pane.spec.json'), 'utf-8'));
    const footerSpec = JSON.parse(fs.readFileSync(path.join(specsDir, 'footer.spec.json'), 'utf-8'));

    const assembledPanes = [];
    for (let i = 0; i < localPanes; i++) {
        const vars = {
            paneId: `pane${i + 1}`,
            badgeText: `Editor ${i + 1}`,
            fileBtnId: `openFileBtn${i + 1}`,
            fileInputId: `fileInput${i + 1}`,
            fileNameId: `fileName${i + 1}`,
            defaultFileName: localFiles[i] || `file${i + 1}.json`,
            editorId: `editor${i + 1}`
        };
        assembledPanes.push(interpolateSpec({ inSpec: paneTemplate, inVars: vars }));
    }

    return {
        tagName: 'div',
        attributes: {
            class: 'studio-app'
        },
        children: [
            headerSpec,
            {
                tagName: 'main',
                attributes: {
                    class: 'studio-workspace',
                    'data-panes': String(localPanes)
                },
                children: assembledPanes
            },
            footerSpec
        ]
    };
};

export { assembleSpec };
export default assembleSpec;
