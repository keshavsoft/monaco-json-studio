import path from 'node:path';

const headerTypes = new Set(['file-picker', 'title', 'select', 'none']);
const bodyTypes = new Set(['monaco']);
const footerTypes = new Set(['cursor', 'note', 'none']);
const keyPattern = /^[A-Za-z][A-Za-z0-9_-]*$/;
const selectValuePattern = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;

function requireObject(value, location) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        throw new TypeError(`${location} must be an object.`);
    }
    return value;
}

function requireText(value, location, fallback) {
    const result = value === undefined ? fallback : value;
    if (typeof result !== 'string' || result.trim() === '') {
        throw new TypeError(`${location} must be a non-empty string.`);
    }
    return result.trim();
}

function jsonText(value, location) {
    try {
        const result = JSON.stringify(value, null, 2);
        if (result === undefined) throw new TypeError('value is not JSON serializable');
        return result;
    } catch (error) {
        throw new TypeError(`${location} must be JSON serializable: ${error.message}`);
    }
}

function validateFileName(fileName, location) {
    const result = requireText(fileName, location, undefined);
    if (path.basename(result) !== result || !/^[A-Za-z0-9][A-Za-z0-9._-]*\.json$/i.test(result)) {
        throw new TypeError(`${location} must be a plain .json file name without a directory path.`);
    }
    return result;
}

function normalizeSelectOptions(header, paneKey, location) {
    if (!Array.isArray(header.options) || header.options.length === 0) {
        throw new TypeError(`${location}.options must contain at least one option.`);
    }

    const seenValues = new Set();
    const options = header.options.map((option, index) => {
        const optionLocation = `${location}.options[${index}]`;
        requireObject(option, optionLocation);
        const value = requireText(option.value, `${optionLocation}.value`, undefined);
        if (!selectValuePattern.test(value)) {
            throw new TypeError(`${optionLocation}.value may contain letters, numbers, underscores, and hyphens.`);
        }
        if (seenValues.has(value)) throw new TypeError(`${location} has duplicate option value "${value}".`);
        seenValues.add(value);
        if (!Object.hasOwn(option, 'content')) {
            throw new TypeError(`${optionLocation}.content is required and must be JSON serializable.`);
        }
        return {
            label: requireText(option.label, `${optionLocation}.label`, value),
            value,
            fileName: `${paneKey}-${value}.json`,
            contentText: jsonText(option.content, `${optionLocation}.content`)
        };
    });

    const selectedValue = header.selectedValue === undefined ? options[0].value : requireText(header.selectedValue, `${location}.selectedValue`, undefined);
    const selectedOption = options.find((option) => option.value === selectedValue);
    if (!selectedOption) throw new TypeError(`${location}.selectedValue must match one of its option values.`);

    return { options, selectedValue, selectedOption };
}

function normalizePane(pane, index, knownKeys) {
    const location = `panes[${index}]`;
    requireObject(pane, location);

    const key = requireText(pane.key, `${location}.key`, undefined);
    if (!keyPattern.test(key)) throw new TypeError(`${location}.key must start with a letter and contain only letters, numbers, underscores, or hyphens.`);
    if (knownKeys.has(key)) throw new TypeError(`Pane key "${key}" is duplicated.`);
    knownKeys.add(key);

    const label = requireText(pane.label, `${location}.label`, key);
    const header = requireObject(pane.header ?? { type: 'title' }, `${location}.header`);
    const body = requireObject(pane.body, `${location}.body`);
    const footer = requireObject(pane.footer ?? { type: 'none' }, `${location}.footer`);
    const headerType = requireText(header.type, `${location}.header.type`, undefined);
    const bodyType = requireText(body.type, `${location}.body.type`, undefined);
    const footerType = requireText(footer.type, `${location}.footer.type`, undefined);

    if (!headerTypes.has(headerType)) throw new TypeError(`${location}.header.type must be one of: ${[...headerTypes].join(', ')}.`);
    if (!bodyTypes.has(bodyType)) throw new TypeError(`${location}.body.type must be one of: ${[...bodyTypes].join(', ')}.`);
    if (!footerTypes.has(footerType)) throw new TypeError(`${location}.footer.type must be one of: ${[...footerTypes].join(', ')}.`);

    const language = requireText(body.language, `${location}.body.language`, 'json');
    const normalizedHeader = {
        type: headerType,
        label: requireText(header.label, `${location}.header.label`, label)
    };
    let initialContentText;
    let fileName;
    let dataFiles;

    if (headerType === 'select') {
        if (Object.hasOwn(body, 'initialValue') || Object.hasOwn(body, 'fileName')) {
            throw new TypeError(`${location}.body should omit initialValue and fileName when header.type is "select"; each option supplies its content.`);
        }
        const select = normalizeSelectOptions(header, key, `${location}.header`);
        normalizedHeader.options = select.options.map(({ label: optionLabel, value, fileName: optionFileName }) => ({ label: optionLabel, value, fileName: optionFileName }));
        normalizedHeader.selectedValue = select.selectedValue;
        initialContentText = select.selectedOption.contentText;
        fileName = select.selectedOption.fileName;
        dataFiles = select.options.map(({ fileName: optionFileName, contentText }) => ({ fileName: optionFileName, contentText }));
    } else {
        fileName = validateFileName(body.fileName ?? `${key}.json`, `${location}.body.fileName`);
        const initialValue = Object.hasOwn(body, 'initialValue') ? body.initialValue : {};
        initialContentText = jsonText(initialValue, `${location}.body.initialValue`);
        dataFiles = [{ fileName, contentText: initialContentText }];
    }

    return {
        key,
        label,
        header: normalizedHeader,
        body: { type: bodyType, language, fileName },
        footer: {
            type: footerType,
            text: footerType === 'note' ? requireText(footer.text, `${location}.footer.text`, label) : ''
        },
        initialContentText,
        dataFiles
    };
}

function normalizeStudioConfig(config) {
    requireObject(config, 'config');
    if (!Array.isArray(config.panes) || config.panes.length < 1 || config.panes.length > 3) {
        throw new TypeError('config.panes must contain one, two, or three pane definitions.');
    }

    const knownKeys = new Set();
    const panes = config.panes.map((pane, index) => normalizePane(pane, index, knownKeys));
    const knownFiles = new Set();
    panes.forEach((pane) => pane.dataFiles.forEach(({ fileName }) => {
        const normalizedName = fileName.toLowerCase();
        if (knownFiles.has(normalizedName)) throw new TypeError(`Generated data file "${fileName}" is used more than once.`);
        knownFiles.add(normalizedName);
    }));
    const outputDir = requireText(config.outputDir, 'config.outputDir', './monaco-studio');
    const title = requireText(config.title, 'config.title', 'Monaco Studio');
    const brandFooter = requireText(config.brandFooter, 'config.brandFooter', 'JSON-Driven Monaco Studio');

    return { title, outputDir, brandFooter, panes };
}

export { normalizeStudioConfig };
