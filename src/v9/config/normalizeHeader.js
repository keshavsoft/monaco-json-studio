import { jsonText, requireObject, requireText, validateFileName } from './validators.js';

export const HEADER_TYPES = new Set(['file-picker', 'title', 'select', 'none']);
const selectValuePattern = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;

function normalizeSelectOptions(header, paneKey, location) {
    if (!Array.isArray(header.options) || header.options.length === 0) {
        throw new TypeError(`${location}.options must contain at least one option.`);
    }

    const usedValues = new Set();
    return header.options.map((rawOption, index) => {
        const optionLocation = `${location}.options[${index}]`;
        const option = requireObject(rawOption, optionLocation);
        const label = requireText(option.label, `${optionLocation}.label`, undefined);
        const value = requireText(option.value, `${optionLocation}.value`, undefined);

        if (!selectValuePattern.test(value)) {
            throw new TypeError(`${optionLocation}.value must start with a letter or number and contain only letters, numbers, "-" or "_".`);
        }
        if (usedValues.has(value)) {
            throw new TypeError(`Duplicate select option value "${value}" in ${location}.`);
        }
        usedValues.add(value);

        const fileName = validateFileName(option.fileName ?? `${paneKey}-${value}.json`, `${optionLocation}.fileName`);
        const contentText = jsonText(option.content ?? {}, `${optionLocation}.content`);
        return { label, value, fileName, contentText };
    });
}

export function normalizeHeader(rawHeader, paneKey, paneNumber, location) {
    const header = rawHeader === undefined ? { type: 'title' } : requireObject(rawHeader, location);
    const type = requireText(header.type, `${location}.type`, 'title');
    if (!HEADER_TYPES.has(type)) {
        throw new TypeError(`${location}.type must be one of: ${Array.from(HEADER_TYPES).join(', ')}.`);
    }

    const normalizedHeader = {
        type,
        fileBtnId: `openFileBtn${paneNumber}`,
        fileInputId: `fileInput${paneNumber}`,
        fileNameId: `fileName${paneNumber}`,
        selectId: `paneSelect${paneNumber}`
    };

    if (type !== 'select') return normalizedHeader;

    const options = normalizeSelectOptions(header, paneKey, location);
    const selectedValue = header.selected === undefined
        ? options[0].value
        : requireText(header.selected, `${location}.selected`, undefined);
    const selectedOption = options.find((option) => option.value === selectedValue);
    if (!selectedOption) {
        throw new TypeError(`${location}.selected "${selectedValue}" does not match any option value.`);
    }

    return {
        ...normalizedHeader,
        options: options.map((option) => ({ ...option, selected: option.value === selectedOption.value })),
        selectedOption
    };
}
