import { readSpec } from '../internal/specTools.js';

function createStudioFooter(paneCount) {
    const footer = readSpec('specs/footer.spec.json');
    const layoutMeta = footer.children?.[0]?.children?.find((child) => child.attributes?.id === 'layoutMeta');
    if (layoutMeta) layoutMeta.textContent = `${paneCount} Pane${paneCount === 1 ? '' : 's'} Active`;
    return footer;
}

export { createStudioFooter };
