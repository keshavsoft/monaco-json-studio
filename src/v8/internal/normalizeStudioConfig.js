import { requireObject, requireText } from './validators.js';
import { normalizeHeader } from '../header/index.js';
import { normalizeBody } from '../body/index.js';
import { normalizeFooter } from '../footer/index.js';

const keyPattern = /^[A-Za-z][A-Za-z0-9_-]*$/;

export function normalizeStudioConfig(rawConfig) {
    const config = requireObject(rawConfig, 'config');
    if (!Array.isArray(config.panes) || config.panes.length < 1 || config.panes.length > 3) {
        throw new TypeError('config.panes must be an array with 1 to 3 panes.');
    }

    const title = requireText(config.title, 'config.title', 'Monaco Studio');
    const outputDir = requireText(config.outputDir, 'config.outputDir', './monaco-studio');
    const usedKeys = new Set();

    const panes = config.panes.map((rawPane, index) => {
        const paneNumber = index + 1;
        const paneLoc = `panes[${index}]`;
        const pane = requireObject(rawPane, paneLoc);
        const key = requireText(pane.key, `${paneLoc}.key`, undefined);

        if (!keyPattern.test(key)) {
            throw new TypeError(`${paneLoc}.key must start with a letter and contain only letters, numbers, "-" or "_".`);
        }
        if (usedKeys.has(key)) {
            throw new TypeError(`Duplicate pane key "${key}" in config.panes.`);
        }
        usedKeys.add(key);

        const label = requireText(pane.label, `${paneLoc}.label`, key);
        const header = normalizeHeader(pane.header, key, paneNumber, `${paneLoc}.header`);
        const body = normalizeBody(pane.body, key, paneNumber, header, `${paneLoc}.body`);
        const footer = normalizeFooter(pane.footer, paneNumber, `${paneLoc}.footer`);

        const dataFiles = header.type === 'select'
            ? header.options.map((opt) => ({ fileName: opt.fileName, contentText: opt.contentText }))
            : [{ fileName: body.fileName, contentText: body.contentText }];

        return { paneNumber, key, label, header, body, footer, dataFiles };
    });

    return { title, outputDir, panes };
}
