/**
 * buildHtml (v2) - The Story of Building the Monaco Studio HTML Document.
 *
 * All HTML for the studio is generated from this ONE SINGLE PLACE.
 *
 * Narrative Flow:
 * - Chapter 1: Document Head & Metadata (Icons, Monaco stylesheet, Modular CSS links)
 * - Chapter 2: Studio Topbar Header (Brand, Version badge, Layout pill)
 * - Chapter 3: Studio Workspace & Panes (1, 2, or 3 static editor panes)
 * - Chapter 4: Studio Status Footer (Status brand, Active panes count, Cursor position)
 * - Chapter 5: Script Injections (Monaco AMD loader & ES module controller)
 *
 * @param {Object} inArgs
 * @param {number} [inArgs.inPanes=2] - Number of editor panes (1, 2, or 3)
 * @param {string} [inArgs.inTitle="Monaco Studio"] - Studio branding title
 * @param {Array<string>} [inArgs.inFiles] - Default file names for each pane
 * @returns {string} The complete, self-contained, 100% static HTML document
 */
const buildHtml = ({ inPanes = 2, inTitle = "Monaco Studio", inFiles } = {}) => {
    const localPanes = Math.max(1, Math.min(3, parseInt(inPanes, 10) || 2));
    const localTitle = inTitle;
    const defaultFiles = ['instructions.json', 'data.json', 'columns.json'];
    const localFiles = inFiles || defaultFiles.slice(0, localPanes);

    // -------------------------------------------------------------------------
    // Chapter 1: Document Head & Metadata
    // -------------------------------------------------------------------------
    const headSection = `    <meta charset="utf-8">
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
    <link rel="stylesheet" href="./css/footer.css">`;

    // -------------------------------------------------------------------------
    // Chapter 2: Studio Topbar Header
    // -------------------------------------------------------------------------
    const headerSection = `        <!-- Top Bar Header Section -->
        <header class="studio-header">
            <div class="header-left">
                <a href="#" class="brand-link" title="${localTitle}">
                    <i class="bi bi-cpu-fill brand-icon"></i>
                    <span>${localTitle}</span>
                    <span class="version-pill">v2</span>
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

    // -------------------------------------------------------------------------
    // Chapter 3: Studio Workspace & Panes
    // -------------------------------------------------------------------------
    const paneElements = [];
    for (let i = 0; i < localPanes; i++) {
        const num = i + 1;
        const fileName = localFiles[i] || `file${num}.json`;
        const paneHtml = `            <!-- Pane ${num}: Editor ${num} (${fileName}) -->
            <section class="studio-pane" id="pane${num}">
                <div class="pane-header">
                    <div class="pane-header-left">
                        <span class="pane-badge">Editor ${num}</span>
                        <button id="openFileBtn${num}" type="button" class="btn-pane-file" title="Open JSON file for Editor ${num}">
                            <i class="bi bi-folder2-open"></i>
                            <span>Select File</span>
                        </button>
                        <input type="file" id="fileInput${num}" style="display: none;" accept=".json,.js,.txt,application/json">
                    </div>
                    <div class="pane-header-right">
                        <span class="pane-file-pill">
                            <i class="bi bi-filetype-json"></i>
                            <span id="fileName${num}" class="pane-file-name">${fileName}</span>
                        </span>
                    </div>
                </div>
                <div id="editor${num}" class="editor-pane-body"></div>
            </section>`;
        paneElements.push(paneHtml);
    }

    const workspaceSection = `        <!-- Main Workspace Section: ${localPanes} Static Panes -->
        <main class="studio-workspace" data-panes="${localPanes}">
${paneElements.join('\n\n')}
        </main>`;

    // -------------------------------------------------------------------------
    // Chapter 4: Studio Status Footer
    // -------------------------------------------------------------------------
    const footerSection = `        <!-- Footer Status Section -->
        <footer class="studio-footer">
            <div class="footer-left">
                <span class="footer-brand">
                    <i class="bi bi-braces-asterisk"></i>
                    <span>JSON-Driven Monaco Studio</span>
                </span>
                <span>|</span>
                <span id="layoutMeta">${localPanes} Pane${localPanes > 1 ? 's' : ''} Active</span>
            </div>
            <div class="footer-right">
                <span id="cursorPos">Ln 1, Col 1</span>
            </div>
        </footer>`;

    // -------------------------------------------------------------------------
    // Chapter 5: Script Injections & Document Assembly
    // -------------------------------------------------------------------------
    const fullHtml = `<!DOCTYPE html>
<html lang="en">

<head>
${headSection}
</head>

<body>
    <div class="studio-app">
${headerSection}

${workspaceSection}

${footerSection}
    </div>

    <!-- Monaco AMD Loader -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs/loader.min.js"></script>
    
    <!-- Functional Controller -->
    <script type="module" src="./js/index.js"></script>
</body>

</html>
`;

    return fullHtml;
};

export { buildHtml };
export default buildHtml;
