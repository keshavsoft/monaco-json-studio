import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { specToHtml } from '../specToHtml/index.js';

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
 * Generates a clean, 100% physical Static Monaco Studio project folder.
 *
 * @param {Object} inArgs
 * @param {number} [inArgs.inPanes=2] - Number of panes (1, 2, or 3)
 * @param {string} inArgs.inTargetDir - Absolute or relative path to output directory
 * @param {string} [inArgs.inTitle="Monaco Studio"] - Custom page title
 * @returns {Object} Result summary { success: true, targetDir, panes }
 */
const generateStudio = ({ inPanes = 2, inTargetDir, inTitle = "Monaco Studio" } = {}) => {
    const localPanes = Math.max(1, Math.min(3, parseInt(inPanes, 10) || 2));
    if (!inTargetDir) {
        throw new Error("Missing required parameter: inTargetDir");
    }
    const localTargetDir = path.resolve(process.cwd(), inTargetDir);
    const localTitle = inTitle;

    const filesForPanes = ['instructions.json', 'data.json', 'columns.json'];

    // 1. Prepare Target Directory Structure
    fs.mkdirSync(path.join(localTargetDir, 'css'), { recursive: true });
    fs.mkdirSync(path.join(localTargetDir, 'data'), { recursive: true });
    fs.mkdirSync(path.join(localTargetDir, 'js'), { recursive: true });

    // 2. Read Source Specs
    const specsDir = path.join(assetsDir, 'specs');
    const paneTemplate = JSON.parse(fs.readFileSync(path.join(specsDir, 'pane.spec.json'), 'utf-8'));
    const footerSpec = JSON.parse(fs.readFileSync(path.join(specsDir, 'footer.spec.json'), 'utf-8'));

    // 3. Compile Static Panes HTML
    const paneHtmls = [];
    for (let i = 0; i < localPanes; i++) {
        const vars = {
            paneId: `pane${i + 1}`,
            badgeText: `Editor ${i + 1}`,
            fileBtnId: `openFileBtn${i + 1}`,
            fileInputId: `fileInput${i + 1}`,
            fileNameId: `fileName${i + 1}`,
            defaultFileName: filesForPanes[i] || `file${i + 1}.json`,
            editorId: `editor${i + 1}`
        };
        const pSpec = interpolateSpec({ inSpec: paneTemplate, inVars: vars });
        paneHtmls.push(specToHtml({ inSpec: pSpec, inIndent: 12 }));
    }

    // Static Header HTML
    const headerHtml = `        <!-- Top Bar Header Section -->
        <header class="studio-header">
            <div class="header-left">
                <a href="#" class="brand-link" title="${localTitle}">
                    <i class="bi bi-cpu-fill brand-icon"></i>
                    <span>${localTitle}</span>
                    <span class="version-pill">v1</span>
                </a>
            </div>
            <div class="header-right">
                <span id="statusPill" class="status-pill success hidden">
                    <i class="bi bi-check2"></i> <span id="statusText">Loaded ✓</span>
                </span>
                <div class="header-divider"></div>
                <span class="pane-file-pill">
                    <i class="bi bi-layout-split"></i>
                    <span>${localPanes} Pane${localPanes > 1 ? 's' : ''} Static Layout</span>
                </span>
            </div>
        </header>`;

    const workspaceHtml = `        <!-- Main Workspace Section: ${localPanes} Static Panes -->
        <main class="studio-workspace" data-panes="${localPanes}">
${paneHtmls.join('\n\n')}
        </main>`;

    // Static Footer HTML
    if (footerSpec.children?.[0]?.children?.[2]) {
        footerSpec.children[0].children[2].textContent = `${localPanes} Pane${localPanes > 1 ? 's' : ''} Active`;
    }
    const footerHtml = specToHtml({ inSpec: footerSpec, inIndent: 8 });

    // 4. Assemble Full Physical index.html
    const fullHtml = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${localTitle} (${localPanes} Pane Static Project) | KeshavSoft</title>

    <!-- Auto-normalize trailing slash so relative paths ./css and ./js always resolve correctly -->
    <script>
        if (!location.pathname.endsWith('/') && !location.pathname.endsWith('.html')) {
            location.replace(location.pathname + '/' + location.search + location.hash);
        }
    </script>
    
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    
    <!-- Monaco Editor Stylesheet -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs/editor/editor.main.min.css">
    
    <!-- Modular Control-Scoped CSS -->
    <link rel="stylesheet" href="./css/base.css">
    <link rel="stylesheet" href="./css/header.css">
    <link rel="stylesheet" href="./css/workspace.css">
    <link rel="stylesheet" href="./css/footer.css">
</head>

<body>
    <div class="studio-app">
${headerHtml}

${workspaceHtml}

${footerHtml}
    </div>

    <!-- Monaco AMD Loader -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs/loader.min.js"></script>
    
    <!-- Functional Controller -->
    <script type="module" src="./js/index.js"></script>
</body>

</html>
`;

    fs.writeFileSync(path.join(localTargetDir, 'index.html'), fullHtml, 'utf-8');

    // 5. Copy Modular CSS
    const cssSourceDir = path.join(assetsDir, 'css');
    const cssFiles = ['base.css', 'header.css', 'workspace.css', 'footer.css'];
    for (const f of cssFiles) {
        const src = path.join(cssSourceDir, f);
        if (fs.existsSync(src)) {
            fs.copyFileSync(src, path.join(localTargetDir, 'css', f));
        }
    }

    // 6. Copy Data Files
    const dataSourceDir = path.join(assetsDir, 'data');
    for (let i = 0; i < localPanes; i++) {
        const f = filesForPanes[i];
        const src = path.join(dataSourceDir, f);
        if (fs.existsSync(src)) {
            fs.copyFileSync(src, path.join(localTargetDir, 'data', f));
        }
    }

    // 7. Generate Static JS Files
    const templatesDir = path.join(assetsDir, 'templates');
    fs.copyFileSync(path.join(templatesDir, 'index.js'), path.join(localTargetDir, 'js', 'index.js'));

    const stateContent = `export const $ = (id) => document.getElementById(id);

export const state = {
    paneCount: ${localPanes},
    editors: [],
    fileNames: ${JSON.stringify(filesForPanes.slice(0, localPanes))},
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
        const data = await res.json();
        return pretty(data);
    } catch (err) {
        console.warn('Fallback loading', filename, err);
        return pretty({ "status": "ready", "file": filename });
    }
}

export function setStatus(text) {
    const pill = $('statusPill');
    const textEl = $('statusText');
    if (!pill || !textEl) return;
    
    textEl.textContent = text;
    pill.classList.remove('hidden');
    
    clearTimeout(setStatus._timer);
    setStatus._timer = setTimeout(() => {
        pill.classList.add('hidden');
    }, 3000);
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
