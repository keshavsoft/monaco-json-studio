import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createStudio } from '../../src/index.js';

const sampleDir = path.dirname(fileURLToPath(import.meta.url));

const outputDir = createStudio({
    title: 'Input and Output Studio',
    outputDir: path.join(sampleDir, 'generated'),
    panes: [
        {
            key: 'input',
            label: 'Input',
            header: { type: 'file-picker' },
            body: {
                type: 'monaco',
                language: 'json',
                fileName: 'https://keshavsoft.github.io/declarative-definitions/json/v6/definitions.json',
                content: {
                    customer: 'Asha',
                    items: ['notebook', 'pen']
                }
            },
            footer: { type: 'note', text: 'Original order' }
        }
    ]
});

console.log(`Generated two-pane sample: ${outputDir}`);
