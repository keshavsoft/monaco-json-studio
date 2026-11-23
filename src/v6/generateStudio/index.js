import fs from 'node:fs';
import path from 'node:path';
import { buildHtml } from '../buildHtml/index.js';
import { validatePaneCount } from '../internal/paneCount.js';
import { getPaneProfiles } from '../internal/paneProfiles.js';
import { assetsDir } from '../internal/templateEngine.js';

const cssFiles = ['base.css', 'studio.css', 'pane-layout.css', 'pane-regions.css'];

function generateStudio(paneCount) {
    const count = validatePaneCount(paneCount);
    const targetDir = path.resolve(process.cwd(), 'monaco-studio');
    const cssDir = path.join(targetDir, 'css');
    const dataDir = path.join(targetDir, 'data');
    const jsDir = path.join(targetDir, 'js');
    [cssDir, dataDir, jsDir].forEach((directory) => fs.mkdirSync(directory, { recursive: true }));

    fs.writeFileSync(path.join(targetDir, 'index.html'), buildHtml(count), 'utf8');

    const cssSourceDir = path.join(assetsDir, 'v6', 'css');
    cssFiles.forEach((file) => fs.copyFileSync(path.join(cssSourceDir, file), path.join(cssDir, file)));

    const panes = getPaneProfiles(count);
    const dataSourceDir = path.join(assetsDir, 'data');
    panes.forEach((pane) => {
        fs.copyFileSync(path.join(dataSourceDir, pane.fileName), path.join(dataDir, pane.fileName));
    });

    const runtimePanes = panes.map((pane, index) => ({
        paneNumber: index + 1,
        label: pane.label,
        fileName: pane.fileName,
        headerType: pane.headerType,
        bodyType: pane.bodyType,
        language: pane.language,
        footerType: pane.footerType
    }));
    const stateModule = [
        `export const paneConfigs = ${JSON.stringify(runtimePanes, null, 2)};`,
        'export const state = { editors: [], contents: [] };',
        ''
    ].join('\n');
    fs.writeFileSync(path.join(jsDir, 'state.js'), stateModule, 'utf8');

    const runtimeSource = fs.readFileSync(path.join(assetsDir, 'v6', 'templates', 'index.js'), 'utf8');
    fs.writeFileSync(path.join(jsDir, 'index.js'), runtimeSource, 'utf8');

    return targetDir;
}

export { generateStudio };
export default generateStudio;
