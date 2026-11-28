/**
 * specToHtml (v3) - Compiles a KeshavSoft JSON specification object into indented, valid static HTML5.
 * Completely self-contained: zero cross-version dependencies.
 * Follows strict parameter convention: inArgs object with 'in'-prefix and 'local'-prefixed internal variables.
 *
 * @param {Object} inArgs
 * @param {Object} inArgs.inSpec - The JSON specification node
 * @param {number} [inArgs.inIndent=0] - Leading space indentation
 * @returns {string} Formatted HTML string
 */
const specToHtml = ({ inSpec, inIndent = 0 } = {}) => {
    const localSpec = inSpec;
    const localIndent = inIndent;

    if (localSpec === null || localSpec === undefined) return '';
    if (typeof localSpec === 'string' || typeof localSpec === 'number') {
        return ' '.repeat(localIndent) + String(localSpec);
    }

    const spaces = ' '.repeat(localIndent);
    const tagName = localSpec.tagName || 'div';

    let attrStr = '';
    if (localSpec.attributes && typeof localSpec.attributes === 'object') {
        for (const [k, v] of Object.entries(localSpec.attributes)) {
            attrStr += ` ${k}="${String(v).replace(/"/g, '&quot;')}"`;
        }
    }

    // W3C HTML void elements
    const voidElements = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
    if (voidElements.has(tagName.toLowerCase())) {
        return `${spaces}<${tagName}${attrStr}>`;
    }

    // Leaf text node
    if (localSpec.textContent !== undefined && localSpec.textContent !== null && (!localSpec.children || localSpec.children.length === 0)) {
        return `${spaces}<${tagName}${attrStr}>${localSpec.textContent}</${tagName}>`;
    }

    // Container children
    if (Array.isArray(localSpec.children) && localSpec.children.length > 0) {
        const childHtmls = localSpec.children.map(child => {
            if (typeof child === 'string') {
                return `${spaces}    ${child}`;
            }
            return specToHtml({ inSpec: child, inIndent: localIndent + 4 });
        }).join('\n');
        return `${spaces}<${tagName}${attrStr}>\n${childHtmls}\n${spaces}</${tagName}>`;
    }

    return `${spaces}<${tagName}${attrStr}></${tagName}>`;
};

export { specToHtml };
export default specToHtml;
