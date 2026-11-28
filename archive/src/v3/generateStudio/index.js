import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildHtml } from '../buildHtml/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsDir = path.resolve(__dirname, '..', '..', '..', 'assets');

/**
 * generateStudio (v3) - Scaffolds a Physical Monaco Studio with Spec-Driven 100% Static HTML.
 *
 * Narrative Flow:
 * - Chapter 1: Prepare Clean Directory Architecture (css/, data/, js/)
 * - Chapter 2: Compile & Emit 100% Static HTML (via v3 buildHtml & assembleSpec)
 * - Chapter 3: Deploy Control-Scoped Modular CSS (base, header, workspace, footer)
 * - Chapter 4: Deploy Sample JSON Data & JS Controller
 *
 * @param {Object} inArgs
 * @param {number} [inArgs.inPanes=2] - Number of editor panes (1, 2, or 3)
 * @param {string} inArgs.inTargetDir - Output directory path
 * @param {string} [inArgs.inTitle="Monaco Studio"] - Studio branding title
 * @returns {Object} Result summary { success: true, targetDir, panes }
 */
const generateStudio = ({ inPanes = 2, inTargetDir, inTitle = "Monaco Studio" } = {}) => {
    const localPanes = Math.max(1, Math.min(3, parseInt(inPanes, 10) || 2));
    if (!inTargetDir) {
        throw new Error("Missing required parameter: inTargetDir");
    }
    const localTargetDir = path.resolve(process.cwd(), inTargetDir);
    const localTitle = inTitle;
    const defaultDataFiles = ['instructions.json', 'data.json', 'columns.json'];

    // -------------------------------------------------------------------------
    // Chapter 1: Prepare Clean Directory Architecture
    // -------------------------------------------------------------------------
    fs.mkdirSync(path.join(localTargetDir, 'css'), { recursive: true });
    fs.mkdirSync(path.join(localTargetDir, 'data'), { recursive: true });
    fs.mkdirSync(path.join(localTargetDir, 'js'), { recursive: true });

    // -------------------------------------------------------------------------
    // Chapter 2: Compile & Emit 100% Static HTML (via Spec-Driven Compiler)
    // -------------------------------------------------------------------------
    const staticHtml = buildHtml({
        inPanes: localPanes,
        inTitle: localTitle,
        inFiles: defaultDataFiles.slice(0, localPanes)
    });
    fs.writeFileSync(path.join(localTargetDir, 'index.html'), staticHtml, 'utf-8');

    // -------------------------------------------------------------------------
    // Chapter 3: Deploy Control-Scoped Modular CSS
    // -------------------------------------------------------------------------
    const cssSourceDir = path.join(assetsDir, 'css');
    const cssFiles = ['base.css', 'header.css', 'workspace.css', 'footer.css'];
    for (const f of cssFiles) {
        const srcPath = path.join(cssSourceDir, f);
        if (fs.existsSync(srcPath)) {
            fs.copyFileSync(srcPath, path.join(localTargetDir, 'css', f));
        }
    }

    // -------------------------------------------------------------------------
    // Chapter 4: Deploy Sample JSON Data & JS Controller
    // -------------------------------------------------------------------------
    // 4a. Copy sample data files for the requested pane count
    const dataSourceDir = path.join(assetsDir, 'data');
    for (let i = 0; i < localPanes; i++) {
        const f = defaultDataFiles[i];
        const srcPath = path.join(dataSourceDir, f);
        if (fs.existsSync(srcPath)) {
            fs.copyFileSync(srcPath, path.join(localTargetDir, 'data', f));
        }
    }

    // 4b. Deploy functional JS controller
    const templatesDir = path.join(assetsDir, 'templates');
    fs.copyFileSync(path.join(templatesDir, 'index.js'), path.join(localTargetDir, 'js', 'index.js'));

    const stateContent = `export const $ = (id) => document.getElementById(id);

export const state = {
    paneCount: ${localPanes},
    editors: [],
    fileNames: ${JSON.stringify(defaultDataFiles.slice(0, localPanes))},
    contents: []
};

export const pretty = (v) => {
    if (typeof v === 'string') {
        try {
            return JSON.stringify(JSON.parse(v), null, 2);
        } catch {
            return v;
        }
    }
    return JSON.stringify(v, null, 2);
};

export async function loadInitialData(filename) {
    try {
        const res = await fetch(\`./data/\${filename}\`);
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
        const text = await res.text();
        return pretty(text);
    } catch {
        return pretty({ message: \`Default content for \${filename}\`, timestamp: new Date().toISOString() });
    }
}

export function setStatus(msg, isError = false) {
    const pill = $('statusPill');
    const text = $('statusText');
    if (!pill || !text) return;

    text.textContent = msg;
    pill.classList.remove('hidden', 'success', 'error');
    pill.classList.add(isError ? 'error' : 'success');
}
`;
    fs.writeFileSync(path.join(localTargetDir, 'js', 'state.js'), stateContent, 'utf-8');

    return {
        success: true,
        targetDir: localTargetDir,
        panes: localPanes
    };
};

export { generateStudio };
export default generateStudio;
