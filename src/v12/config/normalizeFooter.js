import { requireObject, requireText } from './validators.js';

export const FOOTER_TYPES = new Set(['cursor', 'note', 'none']);

export function normalizeFooter({ inRawFooter, inPaneNumber, inLocation }) {
    const localRawFooter = inRawFooter;
    const localPaneNumber = inPaneNumber;
    const localLocation = inLocation;
    const localFooterConfig = localRawFooter === undefined
        ? { type: 'none' }
        : requireObject(localRawFooter, localLocation);
    const localType = requireText(localFooterConfig.type, `${localLocation}.type`, 'none');
    if (!FOOTER_TYPES.has(localType)) {
        throw new TypeError(`${localLocation}.type must be one of: ${Array.from(FOOTER_TYPES).join(', ')}.`);
    }

    return {
        type: localType,
        cursorId: `paneCursor${localPaneNumber}`,
        text: localType === 'note' ? requireText(localFooterConfig.text, `${localLocation}.text`, undefined) : ''
    };
}
