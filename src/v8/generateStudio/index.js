import fs from 'node:fs';
import path from 'node:path';
import { buildHtml } from '../buildHtml/index.js';
import { assetsDir } from '../internal/templateEngine.js';

const cssFiles = ['base.css', 'studio.css', 'pane-layout.css', 'pane-regions.css'];
const regionDirs = ['header', 'body', 'footer'];

function copyDirFiles(sourceDir, targetDir, extensions) {
    fs.mkdirSync(targetDir, { recursive: true });
    fs.readdirSync(sourceDir)
        .filter((file) => extensions.some((ext) => file.endsWith(ext)))
        .forEach((file) => fs.copyFileSync(path.join(sourceDir, file), path.join(targetDir, file)));
}

export function generateStudio(config) {
    const targetDir = path.resolve(process.cwd(), config.outputDir);
    const cssDir = path.join(targetDir, 'css');
    const dataDir = path.join(targetDir, 'data');
    const jsDir = path.join(targetDir, 'js');
    [cssDir, dataDir, jsDir].forEach((directory) => fs.mkdirSync(directory, { recursive: true }));

    fs.writeFileSync(path.join(targetDir, 'index.html'), buildHtml(config), 'utf8');

    const cssSourceDir = path.join(assetsDir, 'v8', 'css');
    cssFiles.forEach((file) => fs.copyFileSync(path.join(cssSourceDir, file), path.join(cssDir, file)));

    config.panes.forEach((pane) => {
        pane.dataFiles.forEach((dataFile) => {
            fs.writeFileSync(path.join(dataDir, dataFile.fileName), `${dataFile.contentText}\n`, 'utf8');
        });
    });

    const paneConfigs = config.panes.map((pane) => ({
        paneNumber: pane.paneNumber,
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

    const templatesDir = path.join(assetsDir, 'v8', 'templates');
    copyDirFiles(path.join(templatesDir, 'js'), jsDir, ['.js']);
    regionDirs.forEach((region) => {
        copyDirFiles(path.join(templatesDir, region), path.join(jsDir, region), ['.js', '.json']);
    });

    return targetDir;
}
