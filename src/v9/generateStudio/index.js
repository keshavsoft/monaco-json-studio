import fs from 'node:fs';
import path from 'node:path';
import { assetsDir } from '../internal/templateEngine.js';
import { buildStudioUi } from '../buildStudioUi/index.js';
import { wireStudioJavaScript } from '../wireStudioJavaScript/index.js';

const cssFiles = ['base.css', 'studio.css', 'pane-layout.css', 'pane-regions.css'];

function createOutputFolders(targetDir) {
    const folders = {
        cssDir: path.join(targetDir, 'css'),
        dataDir: path.join(targetDir, 'data'),
        jsDir: path.join(targetDir, 'js')
    };

    Object.values(folders).forEach((folder) => fs.mkdirSync(folder, { recursive: true }));
    return folders;
}

function writeStudioPage(targetDir, pageHtml) {
    fs.writeFileSync(path.join(targetDir, 'index.html'), pageHtml, 'utf8');
}

function copyStudioStyles(cssDir) {
    const sourceDir = path.join(assetsDir, 'v9', 'css');
    cssFiles.forEach((file) => fs.copyFileSync(path.join(sourceDir, file), path.join(cssDir, file)));
}

function writePaneDataFiles(panes, dataDir) {
    panes.forEach((pane) => {
        pane.dataFiles.forEach((dataFile) => {
            fs.writeFileSync(
                path.join(dataDir, dataFile.fileName),
                `${dataFile.contentText}\n`,
                'utf8'
            );
        });
    });
}

export function generateStudio(config) {
    const targetDir = path.resolve(process.cwd(), config.outputDir);
    const outputFolders = createOutputFolders(targetDir);

    const pageHtml = buildStudioUi(config);
    writeStudioPage(targetDir, pageHtml);
    copyStudioStyles(outputFolders.cssDir);
    writePaneDataFiles(config.panes, outputFolders.dataDir);

    wireStudioJavaScript(config, outputFolders.jsDir);

    return targetDir;
}
