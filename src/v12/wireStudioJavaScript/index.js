import fs from 'node:fs';
import path from 'node:path';
import { assetsDir } from '../internal/templateEngine.js';

const regionNames = ['header', 'body', 'footer'];

function writeRuntimeState({ inPaneRuntimeConfigs, inJsDir }) {
    const localPaneRuntimeConfigs = inPaneRuntimeConfigs;
    const localJsDir = inJsDir;
    const localStateModule = [
        `export const paneConfigs = ${JSON.stringify(localPaneRuntimeConfigs, null, 2)};`,
        'export const state = { editors: [], contents: [] };',
        ''
    ].join('\n');

    fs.writeFileSync(path.join(localJsDir, 'state.js'), localStateModule, 'utf8');
}

function copyJavaScriptFiles({ inSourceDir, inTargetDir, inExtensions }) {
    const localSourceDir = inSourceDir;
    const localTargetDir = inTargetDir;
    const localExtensions = inExtensions;

    fs.mkdirSync(localTargetDir, { recursive: true });
    fs.readdirSync(localSourceDir)
        .filter((inFileName) => localExtensions.some((inExtension) => inFileName.endsWith(inExtension)))
        .forEach((inFileName) => {
            const localFileName = inFileName;
            fs.copyFileSync(path.join(localSourceDir, localFileName), path.join(localTargetDir, localFileName));
        });
}

function copyBrowserRuntime({ inJsDir }) {
    const localJsDir = inJsDir;
    const localTemplatesDir = path.join(assetsDir, 'templates');
    copyJavaScriptFiles({
        inSourceDir: path.join(localTemplatesDir, 'js'),
        inTargetDir: localJsDir,
        inExtensions: ['.js']
    });

    regionNames.forEach((inRegionName) => {
        const localRegionName = inRegionName;
        copyJavaScriptFiles({
            inSourceDir: path.join(localTemplatesDir, localRegionName),
            inTargetDir: path.join(localJsDir, localRegionName),
            inExtensions: ['.js', '.json']
        });
    });
}

export function wireStudioJavaScript({ inPaneRuntimeConfigs, inJsDir }) {
    const localPaneRuntimeConfigs = inPaneRuntimeConfigs;
    const localJsDir = inJsDir;

    writeRuntimeState({
        inPaneRuntimeConfigs: localPaneRuntimeConfigs,
        inJsDir: localJsDir
    });
    copyBrowserRuntime({ inJsDir: localJsDir });
}
