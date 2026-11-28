import { requireObject, requireText } from './validators.js';
import { normalizeHeader } from './normalizeHeader.js';
import { normalizeBody } from './normalizeBody.js';
import { normalizeFooter } from './normalizeFooter.js';

const paneKeyPattern = /^[A-Za-z][A-Za-z0-9_-]*$/;

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
        const paneLocation = `panes[${index}]`;
        const pane = requireObject(rawPane, paneLocation);
        const key = requireText(pane.key, `${paneLocation}.key`, undefined);

        if (!paneKeyPattern.test(key)) {
            throw new TypeError(`${paneLocation}.key must start with a letter and contain only letters, numbers, "-" or "_".`);
        }
        if (usedKeys.has(key)) {
            throw new TypeError(`Duplicate pane key "${key}" in config.panes.`);
        }
        usedKeys.add(key);

        const label = requireText(pane.label, `${paneLocation}.label`, key);
        const header = normalizeHeader(pane.header, key, paneNumber, `${paneLocation}.header`);
        const body = normalizeBody(pane.body, key, paneNumber, header, `${paneLocation}.body`);
        const footer = normalizeFooter(pane.footer, paneNumber, `${paneLocation}.footer`);
        const dataFiles = header.type === 'select'
            ? header.options.map((option) => ({ fileName: option.fileName, contentText: option.contentText }))
            : [{ fileName: body.fileName, contentText: body.contentText }];

        return { paneNumber, key, label, header, body, footer, dataFiles };
    });

    return { title, outputDir, panes };
}
