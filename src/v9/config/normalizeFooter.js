import { requireObject, requireText } from './validators.js';

export const FOOTER_TYPES = new Set(['cursor', 'note', 'none']);

export function normalizeFooter(rawFooter, paneNumber, location) {
    const footer = rawFooter === undefined ? { type: 'none' } : requireObject(rawFooter, location);
    const type = requireText(footer.type, `${location}.type`, 'none');
    if (!FOOTER_TYPES.has(type)) {
        throw new TypeError(`${location}.type must be one of: ${Array.from(FOOTER_TYPES).join(', ')}.`);
    }

    return {
        type,
        cursorId: `paneCursor${paneNumber}`,
        text: type === 'note' ? requireText(footer.text, `${location}.text`, undefined) : ''
    };
}
