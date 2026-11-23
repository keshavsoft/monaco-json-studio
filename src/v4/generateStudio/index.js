import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildHtml } from '../buildHtml/index.js';
import { resolvePaneConfigs } from '../assembleSpec/index.js';

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.resolve(moduleDir, '..', '..', '..', 'assets');
const sampleFiles = ['instructions.json', 'data.json', 'columns.json'];
const cssFiles = ['base.css', 'studio.css', 'pane-layout.css', 'pane-regions.css'];

const generateStudio = ({ inPanes = 2, inPaneConfigs, inTargetDir, inTitle = 'Monaco Studio' } = {}) => {
    if (!inTargetDir) throw new Error('Missing required parameter: inTargetDir');

    const panes = resolvePaneConfigs({ inPanes, inPaneConfigs });
    const targetDir = path.resolve(process.cwd(), inTargetDir);
    const cssDir = path.join(targetDir, 'css');
    const dataDir = path.join(targetDir, 'data');
    const jsDir = path.join(targetDir, 'js');
    [cssDir, dataDir, jsDir].forEach((directory) => fs.mkdirSync(directory, { recursive: true }));

    fs.writeFileSync(path.join(targetDir, 'index.html'), buildHtml({ inPanes, inPaneConfigs, inTitle }), 'utf8');

    const cssSourceDir = path.join(assetsDir, 'v4', 'css');
    cssFiles.forEach((file) => fs.copyFileSync(path.join(cssSourceDir, file), path.join(cssDir, file)));

    const dataSourceDir = path.join(assetsDir, 'data');
    sampleFiles.forEach((file) => {
        fs.copyFileSync(path.join(dataSourceDir, file), path.join(dataDir, file));
    });

    const runtimePaneConfigs = panes.map((pane, index) => ({
        paneNumber: index + 1,
        label: pane.label,
        fileName: pane.fileName,
        headerType: pane.header.type,
        bodyType: pane.body.type,
        language: pane.body.language || 'json',
        footerType: pane.footer.type
    }));
    const stateModule = [
        `export const paneConfigs = ${JSON.stringify(runtimePaneConfigs, null, 2)};`,
        `export const state = { editors: [], contents: [] };`,
        ''
    ].join('\n');
    fs.writeFileSync(path.join(jsDir, 'state.js'), stateModule, 'utf8');

    const runtimeSource = fs.readFileSync(path.join(assetsDir, 'v4', 'templates', 'index.js'), 'utf8');
    fs.writeFileSync(path.join(jsDir, 'index.js'), runtimeSource, 'utf8');

    return { success: true, targetDir, panes: panes.length };
};

export { generateStudio };
export default generateStudio;
