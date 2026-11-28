import { jsonText, requireObject, requireText, validateFileName } from './validators.js';

export const BODY_TYPES = new Set(['monaco']);

export function normalizeBody({ inRawBody, inPaneKey, inPaneNumber, inSelectedOption, inLocation }) {
    const localRawBody = inRawBody;
    const localPaneKey = inPaneKey;
    const localPaneNumber = inPaneNumber;
    const localSelectedOption = inSelectedOption;
    const localLocation = inLocation;
    const localBodyConfig = requireObject(localRawBody, localLocation);
    const localType = requireText(localBodyConfig.type, `${localLocation}.type`, 'monaco');
    if (!BODY_TYPES.has(localType)) {
        throw new TypeError(`${localLocation}.type must be one of: ${Array.from(BODY_TYPES).join(', ')}.`);
    }

    const localLanguage = requireText(localBodyConfig.language, `${localLocation}.language`, 'json');
    const localFileName = validateFileName(
        localBodyConfig.fileName ?? localSelectedOption?.fileName ?? `${localPaneKey}.json`,
        `${localLocation}.fileName`
    );
    const localContentText = jsonText(
        localBodyConfig.content ?? (localSelectedOption ? JSON.parse(localSelectedOption.contentText) : {}),
        `${localLocation}.content`
    );

    return {
        type: localType,
        language: localLanguage,
        editorId: `editor${localPaneNumber}`,
        fileName: localFileName,
        contentText: localContentText
    };
}
