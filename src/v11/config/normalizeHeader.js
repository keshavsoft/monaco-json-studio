import { jsonText, normalizeDataLocation, requireObject, requireText } from './validators.js';

export const HEADER_TYPES = new Set(['file-picker', 'title', 'select', 'none']);
const selectValuePattern = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;

function normalizeSelectOptions({ inOptions, inPaneKey, inLocation }) {
    const localOptions = inOptions;
    const localPaneKey = inPaneKey;
    const localLocation = inLocation;
    if (!Array.isArray(localOptions) || localOptions.length === 0) {
        throw new TypeError(`${localLocation}.options must contain at least one option.`);
    }

    const localUsedValues = new Set();
    return localOptions.map((inRawOption, index) => {
        const localRawOption = inRawOption;
        const localOptionLocation = `${localLocation}.options[${index}]`;
        const localOption = requireObject(localRawOption, localOptionLocation);
        const localLabel = requireText(localOption.label, `${localOptionLocation}.label`, undefined);
        const localValue = requireText(localOption.value, `${localOptionLocation}.value`, undefined);

        if (!selectValuePattern.test(localValue)) {
            throw new TypeError(`${localOptionLocation}.value must start with a letter or number and contain only letters, numbers, "-" or "_".`);
        }
        if (localUsedValues.has(localValue)) {
            throw new TypeError(`Duplicate select option value "${localValue}" in ${localLocation}.`);
        }
        localUsedValues.add(localValue);

        const localDataLocation = normalizeDataLocation(
            localOption.fileName ?? `${localPaneKey}-${localValue}.json`,
            `${localOptionLocation}.fileName`
        );
        const localContentText = jsonText(localOption.content ?? {}, `${localOptionLocation}.content`);
        return {
            label: localLabel,
            value: localValue,
            ...localDataLocation,
            contentText: localContentText
        };
    });
}

export function normalizeHeader({ inRawHeader, inPaneKey, inPaneNumber, inLocation }) {
    const localRawHeader = inRawHeader;
    const localPaneKey = inPaneKey;
    const localPaneNumber = inPaneNumber;
    const localLocation = inLocation;
    const localHeaderConfig = localRawHeader === undefined
        ? { type: 'title' }
        : requireObject(localRawHeader, localLocation);
    const localType = requireText(localHeaderConfig.type, `${localLocation}.type`, 'title');
    if (!HEADER_TYPES.has(localType)) {
        throw new TypeError(`${localLocation}.type must be one of: ${Array.from(HEADER_TYPES).join(', ')}.`);
    }

    const localNormalizedHeader = {
        type: localType,
        fileBtnId: `openFileBtn${localPaneNumber}`,
        fileInputId: `fileInput${localPaneNumber}`,
        fileNameId: `fileName${localPaneNumber}`,
        selectId: `paneSelect${localPaneNumber}`
    };

    if (localType !== 'select') return localNormalizedHeader;

    const localOptions = normalizeSelectOptions({
        inOptions: localHeaderConfig.options,
        inPaneKey: localPaneKey,
        inLocation: localLocation
    });
    const localSelectedValue = localHeaderConfig.selected === undefined
        ? localOptions[0].value
        : requireText(localHeaderConfig.selected, `${localLocation}.selected`, undefined);
    const localSelectedOption = localOptions.find((option) => option.value === localSelectedValue);
    if (!localSelectedOption) {
        throw new TypeError(`${localLocation}.selected "${localSelectedValue}" does not match any option value.`);
    }

    return {
        ...localNormalizedHeader,
        options: localOptions.map((option) => ({ ...option, selected: option.value === localSelectedOption.value })),
        selectedOption: localSelectedOption
    };
}
