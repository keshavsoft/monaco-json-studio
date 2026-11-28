import { readSpec } from '../internal/specTools.js';

function createStudioHeader(paneCount) {
    const header = readSpec('specs/header.spec.json');
    const brand = header.children?.[0]?.children?.[0];
    if (brand?.attributes) brand.attributes.title = 'Monaco Studio';
    if (brand?.children?.[1]) brand.children[1].textContent = 'Monaco Studio';
    if (brand?.children?.[2]) brand.children[2].textContent = 'v5';

    const layoutLabel = header.children?.[1]?.children
        ?.find((child) => child.attributes?.class === 'pane-file-pill')?.children
        ?.find((child) => child.tagName === 'span');
    if (layoutLabel) layoutLabel.textContent = `${paneCount} Pane${paneCount === 1 ? '' : 's'} Active`;

    return header;
}

export { createStudioHeader };
