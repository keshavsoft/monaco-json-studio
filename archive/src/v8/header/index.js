import { renderTemplate } from '../internal/templateEngine.js';
import { jsonText, requireObject, requireText, validateFileName } from '../internal/validators.js';

export const HEADER_TYPES = new Set(['file-picker', 'title', 'select', 'none']);
const selectValuePattern = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;

function normalizeSelectOptions(header, paneKey, location) {
    if (!Array.isArray(header.options) || header.options.length === 0) {
        throw new TypeError(`${location}.options must contain at least one option.`);
    }

    const usedValues = new Set();
    return header.options.map((rawOption, index) => {
        const optLoc = `${location}.options[${index}]`;
        const option = requireObject(rawOption, optLoc);
        const label = requireText(option.label, `${optLoc}.label`, undefined);
        const value = requireText(option.value, `${optLoc}.value`, undefined);

        if (!selectValuePattern.test(value)) {
            throw new TypeError(`${optLoc}.value must start with a letter or number and contain only letters, numbers, "-" or "_".`);
        }
        if (usedValues.has(value)) {
            throw new TypeError(`Duplicate select option value "${value}" in ${location}.`);
        }
        usedValues.add(value);

        const fileName = validateFileName(option.fileName ?? `${paneKey}-${value}.json`, `${optLoc}.fileName`);
        const contentText = jsonText(option.content ?? {}, `${optLoc}.content`);
        return { label, value, fileName, contentText };
    });
}

export function normalizeHeader(rawHeader, paneKey, paneNumber, location) {
    const header = rawHeader === undefined ? { type: 'title' } : requireObject(rawHeader, location);
    const type = requireText(header.type, `${location}.type`, 'title');
    if (!HEADER_TYPES.has(type)) {
        throw new TypeError(`${location}.type must be one of: ${Array.from(HEADER_TYPES).join(', ')}.`);
    }

    const base = {
        type,
        fileBtnId: `openFileBtn${paneNumber}`,
        fileInputId: `fileInput${paneNumber}`,
        fileNameId: `fileName${paneNumber}`,
        selectId: `paneSelect${paneNumber}`
    };

    if (type !== 'select') return base;

    const options = normalizeSelectOptions(header, paneKey, location);
    const selectedValue = header.selected === undefined ? options[0].value : requireText(header.selected, `${location}.selected`, undefined);
    const selectedOption = options.find((item) => item.value === selectedValue);
    if (!selectedOption) {
        throw new TypeError(`${location}.selected "${selectedValue}" does not match any option value.`);
    }

    return {
        ...base,
        options: options.map((opt) => ({ ...opt, selected: opt.value === selectedOption.value })),
        selectedOption
    };
}

export function renderHeader(pane) {
    const { header, label, body } = pane;
    if (header.type === 'none') return '';
    return renderTemplate(`header/${header.type}.hbs`, {
        label,
        fileName: body.fileName,
        fileBtnId: header.fileBtnId,
        fileInputId: header.fileInputId,
        fileNameId: header.fileNameId,
        selectId: header.selectId,
        options: header.options ?? []
    });
}
