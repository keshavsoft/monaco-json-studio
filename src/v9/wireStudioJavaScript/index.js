import fs from 'node:fs';
import path from 'node:path';
import { assetsDir } from '../internal/templateEngine.js';

const regionNames = ['header', 'body', 'footer'];

function createPaneRuntimeConfig(panes) {
    return panes.map((pane) => ({
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
}

function writeRuntimeState(panes, jsDir) {
    const paneConfigs = createPaneRuntimeConfig(panes);
    const stateModule = [
        `export const paneConfigs = ${JSON.stringify(paneConfigs, null, 2)};`,
        'export const state = { editors: [], contents: [] };',
        ''
    ].join('\n');

    fs.writeFileSync(path.join(jsDir, 'state.js'), stateModule, 'utf8');
}

function copyJavaScriptFiles(sourceDir, targetDir, extensions) {
    fs.mkdirSync(targetDir, { recursive: true });
    fs.readdirSync(sourceDir)
        .filter((file) => extensions.some((extension) => file.endsWith(extension)))
        .forEach((file) => fs.copyFileSync(path.join(sourceDir, file), path.join(targetDir, file)));
}

function copyBrowserRuntime(jsDir) {
    const templatesDir = path.join(assetsDir, 'v9', 'templates');
    copyJavaScriptFiles(path.join(templatesDir, 'js'), jsDir, ['.js']);

    regionNames.forEach((regionName) => {
        copyJavaScriptFiles(
            path.join(templatesDir, regionName),
            path.join(jsDir, regionName),
            ['.js', '.json']
        );
    });
}

export function wireStudioJavaScript(config, jsDir) {
    writeRuntimeState(config.panes, jsDir);
    copyBrowserRuntime(jsDir);
}
