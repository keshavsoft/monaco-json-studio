import fs from 'node:fs';
import path from 'node:path';
import { buildHtml } from '../buildHtml/index.js';
import { assetsDir } from '../internal/templateEngine.js';

const cssFiles = ['base.css', 'studio.css', 'pane-layout.css', 'pane-regions.css'];

function generateStudio(config) {
    const targetDir = path.resolve(process.cwd(), config.outputDir);
    const cssDir = path.join(targetDir, 'css');
    const dataDir = path.join(targetDir, 'data');
    const jsDir = path.join(targetDir, 'js');
    [cssDir, dataDir, jsDir].forEach((directory) => fs.mkdirSync(directory, { recursive: true }));

    fs.writeFileSync(path.join(targetDir, 'index.html'), buildHtml(config), 'utf8');

    const cssSourceDir = path.join(assetsDir, 'v7', 'css');
    cssFiles.forEach((file) => fs.copyFileSync(path.join(cssSourceDir, file), path.join(cssDir, file)));

    config.panes.forEach((pane) => {
        pane.dataFiles.forEach((dataFile) => {
            fs.writeFileSync(path.join(dataDir, dataFile.fileName), `${dataFile.contentText}\n`, 'utf8');
        });
    });

    const paneConfigs = config.panes.map((pane, index) => ({
        paneNumber: index + 1,
        key: pane.key,
        label: pane.label,
        fileName: pane.body.fileName,
        headerType: pane.header.type,
        selectOptions: pane.header.options ?? [],
        bodyType: pane.body.type,
        language: pane.body.language,
        footerType: pane.footer.type
    }));
    const stateModule = [
        `export const paneConfigs = ${JSON.stringify(paneConfigs, null, 2)};`,
        'export const state = { editors: [], contents: [] };',
        ''
    ].join('\n');
    fs.writeFileSync(path.join(jsDir, 'state.js'), stateModule, 'utf8');

    const runtimeJsDir = path.join(assetsDir, 'v7', 'templates', 'js');
    fs.readdirSync(runtimeJsDir)
        .filter((file) => file.endsWith('.js'))
        .forEach((file) => fs.copyFileSync(path.join(runtimeJsDir, file), path.join(jsDir, file)));

    return targetDir;
}

export { generateStudio };
