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
                fileName: 'input.json',
                content: {
                    customer: 'Asha',
                    items: ['notebook', 'pen']
                }
            },
            footer: { type: 'note', text: 'Original order' }
        },
        {
            key: 'output',
            label: 'Output',
            header: { type: 'title' },
            body: {
                type: 'monaco',
                language: 'json',
                fileName: 'output.json',
                content: {
                    customer: 'Asha',
                    itemCount: 2,
                    status: 'ready'
                }
            },
            footer: { type: 'cursor' }
        }
    ]
});

console.log(`Generated two-pane sample: ${outputDir}`);
