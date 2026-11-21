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
 * assembleSpec (v3) - Single Source of Truth Declarative Specification Assembler.
 * 
 * Composes clean, atomic JSON component specs into a complete, 100% spec-driven HTML document tree.
 * Free of runtime Monaco bloat; completely zero-dependency.
 *
 * @param {Object} inArgs
 * @param {number} [inArgs.inPanes=2] - Number of editor panes (1, 2, or 3)
 * @param {Array<string>} [inArgs.inFiles] - Optional custom file names for each pane
 * @param {string} [inArgs.inTitle="Monaco Studio"] - Studio branding title
 * @returns {Object} Complete assembled HTML document specification tree
 */
const assembleSpec = ({ inPanes = 2, inFiles, inTitle = "Monaco Studio" } = {}) => {
    const localPanes = Math.max(1, Math.min(3, parseInt(inPanes, 10) || 2));
    const defaultFiles = ['instructions.json', 'data.json', 'columns.json'];
    const localFiles = inFiles || defaultFiles.slice(0, localPanes);
    const localTitle = inTitle;

    const specsDir = path.join(assetsDir, 'specs');
    const headerSpec = JSON.parse(fs.readFileSync(path.join(specsDir, 'header.spec.json'), 'utf-8'));
    const paneTemplate = JSON.parse(fs.readFileSync(path.join(specsDir, 'pane.spec.json'), 'utf-8'));
    const footerSpec = JSON.parse(fs.readFileSync(path.join(specsDir, 'footer.spec.json'), 'utf-8'));

    // 1. Customize Header: Title, version pill v3, and pane layout pill
    try {
        const brandLink = headerSpec.children[0].children[0];
        brandLink.attributes.title = localTitle;
        brandLink.children[1].textContent = localTitle;
        brandLink.children[2].textContent = 'v3'; // Version pill updated to v3

        // Right side layout pill
        const headerRight = headerSpec.children[1];
        const layoutPill = headerRight.children.find(c => c.attributes?.class === 'pane-file-pill');
        if (layoutPill) {
            const spanText = layoutPill.children.find(c => c.tagName === 'span');
            if (spanText) {
                spanText.textContent = `${localPanes} Pane${localPanes > 1 ? 's' : ''} Static Layout`;
            }
        }
    } catch {
        // Safe fallback
    }

    // 2. Assemble Panes dynamically from clean single-source template
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

    // 3. Customize Footer: Active panes count
    try {
        const layoutMeta = footerSpec.children[0].children.find(c => c.attributes?.id === 'layoutMeta');
        if (layoutMeta) {
            layoutMeta.textContent = `${localPanes} Pane${localPanes > 1 ? 's' : ''} Active`;
        }
    } catch {
        // Safe fallback
    }

    // 4. Construct Complete W3C HTML Document Specification Tree
    return {
        tagName: 'html',
        attributes: {
            lang: 'en'
        },
        children: [
            {
                tagName: 'head',
                children: [
                    { tagName: 'meta', attributes: { charset: 'utf-8' } },
                    { tagName: 'meta', attributes: { name: 'viewport', content: 'width=device-width, initial-scale=1' } },
                    { tagName: 'title', textContent: `${localTitle} (${localPanes} Pane Static Project) | KeshavSoft` },
                    {
                        tagName: 'script',
                        textContent: `if (!location.pathname.endsWith('/') && !location.pathname.endsWith('.html')) { location.replace(location.pathname + '/' + location.search + location.hash); }`
                    },
                    { tagName: 'link', attributes: { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css' } },
                    { tagName: 'link', attributes: { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs/editor/editor.main.min.css' } },
                    { tagName: 'link', attributes: { rel: 'stylesheet', href: './css/base.css' } },
                    { tagName: 'link', attributes: { rel: 'stylesheet', href: './css/header.css' } },
                    { tagName: 'link', attributes: { rel: 'stylesheet', href: './css/workspace.css' } },
                    { tagName: 'link', attributes: { rel: 'stylesheet', href: './css/footer.css' } }
                ]
            },
            {
                tagName: 'body',
                children: [
                    {
                        tagName: 'div',
                        attributes: { class: 'studio-app' },
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
                    },
                    {
                        tagName: 'script',
                        attributes: { src: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs/loader.min.js' }
                    },
                    {
                        tagName: 'script',
                        attributes: { type: 'module', src: './js/index.js' }
                    }
                ]
            }
        ]
    };
};

export { assembleSpec };
export default assembleSpec;
