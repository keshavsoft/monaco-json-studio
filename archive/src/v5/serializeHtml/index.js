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

function serializeHtml(spec, indentLevel = 0) {
    if (spec === null || spec === undefined) return '';
    const indent = ' '.repeat(indentLevel);
    if (typeof spec === 'string' || typeof spec === 'number') return `${indent}${escapeText(spec)}`;

    const tagName = spec.tagName || 'div';
    const attributes = Object.entries(spec.attributes || {})
        .map(([key, value]) => ` ${key}="${escapeAttribute(value)}"`)
        .join('');
    if (voidElements.has(tagName.toLowerCase())) return `${indent}<${tagName}${attributes}>`;

    const children = Array.isArray(spec.children) ? spec.children : [];
    if (spec.textContent !== undefined && children.length === 0) {
        return `${indent}<${tagName}${attributes}>${escapeText(spec.textContent)}</${tagName}>`;
    }
    if (children.length === 0) return `${indent}<${tagName}${attributes}></${tagName}>`;

    const body = children.map((child) => serializeHtml(child, indentLevel + 4)).join('\n');
    return `${indent}<${tagName}${attributes}>\n${body}\n${indent}</${tagName}>`;
}

export { serializeHtml };
