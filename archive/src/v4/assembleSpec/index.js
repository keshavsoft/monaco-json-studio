import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.resolve(moduleDir, '..', '..', '..', 'assets');
const regionsDir = path.join(assetsDir, 'v4', 'specs', 'regions');
const defaultPaneConfigs = [
    { label: 'Instructions', fileName: 'instructions.json' },
    { label: 'Data', fileName: 'data.json' },
    { label: 'Output', fileName: 'columns.json' }
];

const regionTypes = {
    header: ['file-picker', 'title'],
    body: ['monaco'],
    footer: ['cursor', 'note', 'none']
};

function readSpec(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function interpolate(spec, values) {
    if (typeof spec === 'string') {
        return spec.replace(/\{\{([A-Za-z0-9_]+)\}\}/g, (_, key) => String(values[key] ?? ''));
    }
    if (Array.isArray(spec)) return spec.map((item) => interpolate(item, values));
    if (spec && typeof spec === 'object') {
        return Object.fromEntries(Object.entries(spec).map(([key, value]) => [key, interpolate(value, values)]));
    }
    return spec;
}

function assertRegionType(region, regionName, paneNumber) {
    if (!region || typeof region !== 'object' || typeof region.type !== 'string') {
        throw new Error(`Pane ${paneNumber}: ${regionName} must include a type.`);
    }
    if (!regionTypes[regionName].includes(region.type)) {
        throw new Error(`Pane ${paneNumber}: unsupported ${regionName} type "${region.type}". Available: ${regionTypes[regionName].join(', ')}.`);
    }
}

function renderRegion(regionName, region, values, paneNumber) {
    assertRegionType(region, regionName, paneNumber);
    if (region.type === 'none') return null;

    const specPath = path.join(regionsDir, regionName, `${region.type}.spec.json`);
    const spec = readSpec(specPath);
    return interpolate(spec, { ...values, ...region, ...region.options });
}

function normalizePaneConfig(config, index) {
    const paneNumber = index + 1;
    if (!config || typeof config !== 'object') {
        throw new Error(`Pane ${paneNumber} must be an object with header, body, and footer regions.`);
    }

    const normalized = {
        key: config.key || `pane${paneNumber}`,
        label: config.label || `Pane ${paneNumber}`,
        fileName: config.fileName || `file${paneNumber}.json`,
        header: config.header,
        body: config.body,
        footer: config.footer
    };

    for (const regionName of ['header', 'body', 'footer']) {
        assertRegionType(normalized[regionName], regionName, paneNumber);
    }
    if (normalized.body.type !== 'monaco') {
        throw new Error(`Pane ${paneNumber}: v4 preview currently supports the "monaco" body type.`);
    }

    return normalized;
}

function resolvePaneConfigs({ inPaneConfigs, inPanes = 2 } = {}) {
    if (inPaneConfigs !== undefined) {
        if (!Array.isArray(inPaneConfigs) || inPaneConfigs.length < 1 || inPaneConfigs.length > 3) {
            throw new Error('inPaneConfigs must contain one, two, or three pane configurations.');
        }
        return inPaneConfigs.map(normalizePaneConfig);
    }

    const count = Math.max(1, Math.min(3, Number.parseInt(inPanes, 10) || 2));
    return defaultPaneConfigs.slice(0, count).map((pane, index) => normalizePaneConfig({
        ...pane,
        header: { type: 'file-picker' },
        body: { type: 'monaco', language: 'json' },
        footer: { type: 'cursor' }
    }, index));
}

function assemblePane(config, index) {
    const paneNumber = index + 1;
    const values = {
        paneId: `pane${paneNumber}`,
        paneNumber,
        label: config.label,
        fileName: config.fileName,
        fileBtnId: `openFileBtn${paneNumber}`,
        fileInputId: `fileInput${paneNumber}`,
        fileNameId: `fileName${paneNumber}`,
        editorId: `editor${paneNumber}`,
        language: config.body.language || 'json',
        cursorId: `paneCursor${paneNumber}`,
        footerText: config.footer.text || ''
    };

    const children = [
        renderRegion('header', config.header, values, paneNumber),
        renderRegion('body', config.body, values, paneNumber),
        renderRegion('footer', config.footer, values, paneNumber)
    ].filter(Boolean);

    return {
        tagName: 'section',
        attributes: {
            class: 'studio-pane',
            id: values.paneId,
            'data-pane-key': config.key
        },
        children
    };
}

const assembleSpec = ({ inPanes = 2, inPaneConfigs, inTitle = 'Monaco Studio' } = {}) => {
    const panes = resolvePaneConfigs({ inPaneConfigs, inPanes });
    const title = String(inTitle);
    const headerSpec = readSpec(path.join(assetsDir, 'specs', 'header.spec.json'));
    const footerSpec = readSpec(path.join(assetsDir, 'specs', 'footer.spec.json'));

    const brandLink = headerSpec.children?.[0]?.children?.[0];
    if (brandLink?.attributes) brandLink.attributes.title = title;
    if (brandLink?.children?.[1]) brandLink.children[1].textContent = title;
    if (brandLink?.children?.[2]) brandLink.children[2].textContent = 'v4 preview';

    const layoutLabel = headerSpec.children?.[1]?.children
        ?.find((item) => item.attributes?.class === 'pane-file-pill')?.children
        ?.find((item) => item.tagName === 'span');
    if (layoutLabel) layoutLabel.textContent = `${panes.length} Pane${panes.length === 1 ? '' : 's'} • Typed Regions`;

    const layoutMeta = footerSpec.children?.[0]?.children?.find((item) => item.attributes?.id === 'layoutMeta');
    if (layoutMeta) layoutMeta.textContent = `${panes.length} Panes Active`;

    const cssFiles = ['base.css', 'studio.css', 'pane-layout.css', 'pane-regions.css'];
    const headChildren = [
        { tagName: 'meta', attributes: { charset: 'utf-8' } },
        { tagName: 'meta', attributes: { name: 'viewport', content: 'width=device-width, initial-scale=1' } },
        { tagName: 'title', textContent: `${title} (${panes.length} Pane Preview) | KeshavSoft` },
        { tagName: 'link', attributes: { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css' } },
        { tagName: 'link', attributes: { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs/editor/editor.main.min.css' } },
        ...cssFiles.map((file) => ({ tagName: 'link', attributes: { rel: 'stylesheet', href: `./css/${file}` } }))
    ];

    return {
        tagName: 'html',
        attributes: { lang: 'en' },
        children: [
            { tagName: 'head', children: headChildren },
            {
                tagName: 'body',
                children: [
                    {
                        tagName: 'div',
                        attributes: { class: 'studio-app' },
                        children: [
                            headerSpec,
                            {
                                tagName: 'main',
                                attributes: { class: 'studio-workspace', 'data-panes': String(panes.length) },
                                children: panes.map(assemblePane)
                            },
                            footerSpec
                        ]
                    },
                    { tagName: 'script', attributes: { src: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs/loader.min.js' } },
                    { tagName: 'script', attributes: { type: 'module', src: './js/index.js' } }
                ]
            }
        ]
    };
};

export { assembleSpec, resolvePaneConfigs };
export default assembleSpec;
