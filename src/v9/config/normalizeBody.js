import { jsonText, requireObject, requireText, validateFileName } from './validators.js';

export const BODY_TYPES = new Set(['monaco']);

export function normalizeBody(rawBody, paneKey, paneNumber, header, location) {
    const body = requireObject(rawBody, location);
    const type = requireText(body.type, `${location}.type`, 'monaco');
    if (!BODY_TYPES.has(type)) {
        throw new TypeError(`${location}.type must be one of: ${Array.from(BODY_TYPES).join(', ')}.`);
    }

    const language = requireText(body.language, `${location}.language`, 'json');
    const selectedOption = header.selectedOption;
    const fileName = validateFileName(
        body.fileName ?? selectedOption?.fileName ?? `${paneKey}.json`,
        `${location}.fileName`
    );
    const contentText = jsonText(
        body.content ?? (selectedOption ? JSON.parse(selectedOption.contentText) : {}),
        `${location}.content`
    );

    return {
        type,
        language,
        editorId: `editor${paneNumber}`,
        fileName,
        contentText
    };
}
