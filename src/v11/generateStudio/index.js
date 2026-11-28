import fs from 'node:fs';
import path from 'node:path';
import { assetsDir } from '../internal/templateEngine.js';
import { buildStudioUi } from '../buildStudioUi/index.js';
import { wireStudioJavaScript } from '../wireStudioJavaScript/index.js';

const cssFiles = ['base.css', 'studio.css', 'pane-layout.css', 'pane-regions.css'];

function createOutputFolders({ inTargetDir }) {
    const localTargetDir = inTargetDir;
    const localOutputFolders = {
        cssDir: path.join(localTargetDir, 'css'),
        dataDir: path.join(localTargetDir, 'data'),
        jsDir: path.join(localTargetDir, 'js')
    };

    Object.values(localOutputFolders).forEach((inFolder) => {
        const localFolder = inFolder;
        fs.mkdirSync(localFolder, { recursive: true });
    });
    return localOutputFolders;
}

function writeStudioPage({ inTargetDir, inPageHtml }) {
    const localTargetDir = inTargetDir;
    const localPageHtml = inPageHtml;
    fs.writeFileSync(path.join(localTargetDir, 'index.html'), localPageHtml, 'utf8');
}

function copyStudioStyles({ inCssDir }) {
    const localCssDir = inCssDir;
    const localSourceDir = path.join(assetsDir, 'v10', 'css');
    cssFiles.forEach((inFileName) => {
        const localFileName = inFileName;
        fs.copyFileSync(path.join(localSourceDir, localFileName), path.join(localCssDir, localFileName));
    });
}

function prepareUiPaneConfigs({ inPanes }) {
    const localPanes = inPanes;

    return localPanes.map((inPaneConfig) => {
        const localPaneConfig = inPaneConfig;
        return {
            paneNumber: localPaneConfig.paneNumber,
            key: localPaneConfig.key,
            label: localPaneConfig.label,
            header: localPaneConfig.header,
            body: localPaneConfig.body,
            footer: localPaneConfig.footer
        };
    });
}

function collectPaneDataFiles({ inPanes }) {
    const localPanes = inPanes;
    const localDataFiles = [];

    localPanes.forEach((inPaneConfig) => {
        const localPaneConfig = inPaneConfig;
        localDataFiles.push(...localPaneConfig.dataFiles);
    });

    return localDataFiles;
}

function preparePaneRuntimeConfigs({ inPanes }) {
    const localPanes = inPanes;

    return localPanes.map((inPaneConfig) => {
        const localPaneConfig = inPaneConfig;
        const localHeaderConfig = localPaneConfig.header;
        const localBodyConfig = localPaneConfig.body;
        const localFooterConfig = localPaneConfig.footer;

        return {
            paneNumber: localPaneConfig.paneNumber,
            key: localPaneConfig.key,
            label: localPaneConfig.label,
            fileName: localBodyConfig.fileName,
            headerType: localHeaderConfig.type,
            selectOptions: localHeaderConfig.options ?? [],
            bodyType: localBodyConfig.type,
            language: localBodyConfig.language,
            footerType: localFooterConfig.type
        };
    });
}

function writePaneDataFiles({ inDataFiles, inDataDir }) {
    const localDataFiles = inDataFiles;
    const localDataDir = inDataDir;

    localDataFiles.forEach((inDataFileConfig) => {
        const localFileName = inDataFileConfig.fileName;
        const localContentText = inDataFileConfig.contentText;
        fs.writeFileSync(
            path.join(localDataDir, localFileName),
            `${localContentText}\n`,
            'utf8'
        );
    });
}

export function generateStudio({ inTitle, inOutputDir, inPanes }) {
    const localTitle = inTitle;
    const localOutputDir = inOutputDir;
    const localPanes = inPanes;
    const localTargetDir = path.resolve(process.cwd(), localOutputDir);
    const localOutputFolders = createOutputFolders({ inTargetDir: localTargetDir });
    const localUiPaneConfigs = prepareUiPaneConfigs({ inPanes: localPanes });
    const localDataFiles = collectPaneDataFiles({ inPanes: localPanes });
    const localPaneRuntimeConfigs = preparePaneRuntimeConfigs({ inPanes: localPanes });

    const localPageHtml = buildStudioUi({ inTitle: localTitle, inPanes: localUiPaneConfigs });
    writeStudioPage({ inTargetDir: localTargetDir, inPageHtml: localPageHtml });
    copyStudioStyles({ inCssDir: localOutputFolders.cssDir });
    writePaneDataFiles({ inDataFiles: localDataFiles, inDataDir: localOutputFolders.dataDir });

    wireStudioJavaScript({
        inPaneRuntimeConfigs: localPaneRuntimeConfigs,
        inJsDir: localOutputFolders.jsDir
    });

    return localTargetDir;
}
