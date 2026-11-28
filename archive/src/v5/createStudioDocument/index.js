import { createStudioFooter } from '../createStudioFooter/index.js';
import { createStudioHeader } from '../createStudioHeader/index.js';
import { createWorkspace } from '../createWorkspace/index.js';

function createStudioDocument(paneCount) {
    const cssFiles = ['base.css', 'studio.css', 'pane-layout.css', 'pane-regions.css'];
    const head = {
        tagName: 'head',
        children: [
            { tagName: 'meta', attributes: { charset: 'utf-8' } },
            { tagName: 'meta', attributes: { name: 'viewport', content: 'width=device-width, initial-scale=1' } },
            { tagName: 'title', textContent: `Monaco Studio v5 · ${paneCount} pane${paneCount === 1 ? '' : 's'}` },
            { tagName: 'link', attributes: { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css' } },
            { tagName: 'link', attributes: { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs/editor/editor.main.min.css' } },
            ...cssFiles.map((file) => ({ tagName: 'link', attributes: { rel: 'stylesheet', href: `./css/${file}` } }))
        ]
    };

    return {
        tagName: 'html',
        attributes: { lang: 'en' },
        children: [
            head,
            {
                tagName: 'body',
                children: [
                    {
                        tagName: 'div',
                        attributes: { class: 'studio-app' },
                        children: [
                            createStudioHeader(paneCount),
                            createWorkspace(paneCount),
                            createStudioFooter(paneCount)
                        ]
                    },
                    { tagName: 'script', attributes: { src: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs/loader.min.js' } },
                    { tagName: 'script', attributes: { type: 'module', src: './js/index.js' } }
                ]
            }
        ]
    };
}

export { createStudioDocument };
