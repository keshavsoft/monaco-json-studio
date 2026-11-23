const voidElements = new Set([
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link',
    'meta', 'param', 'source', 'track', 'wbr'
]);

function escapeText(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;');
}

function escapeAttribute(value) {
    return escapeText(value).replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

/** Serialize the small JSON HTML-spec format used by v4 into static HTML. */
const specToHtml = ({ inSpec, inIndent = 0 } = {}) => {
    if (inSpec === null || inSpec === undefined) return '';
    if (typeof inSpec === 'string' || typeof inSpec === 'number') {
        return `${' '.repeat(inIndent)}${escapeText(inSpec)}`;
    }

    const indent = ' '.repeat(inIndent);
    const tagName = inSpec.tagName || 'div';
    const attributes = Object.entries(inSpec.attributes || {})
        .map(([key, value]) => ` ${key}="${escapeAttribute(value)}"`)
        .join('');

    if (voidElements.has(tagName.toLowerCase())) {
        return `${indent}<${tagName}${attributes}>`;
    }

    const children = Array.isArray(inSpec.children) ? inSpec.children : [];
    if (inSpec.textContent !== undefined && children.length === 0) {
        return `${indent}<${tagName}${attributes}>${escapeText(inSpec.textContent)}</${tagName}>`;
    }
    if (children.length === 0) return `${indent}<${tagName}${attributes}></${tagName}>`;

    const childHtml = children.map((child) => {
        if (typeof child === 'string') return `${indent}    ${escapeText(child)}`;
        return specToHtml({ inSpec: child, inIndent: inIndent + 4 });
    }).join('\n');

    return `${indent}<${tagName}${attributes}>\n${childHtml}\n${indent}</${tagName}>`;
};

export { specToHtml };
export default specToHtml;
