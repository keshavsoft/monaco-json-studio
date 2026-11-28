import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createStudio } from '../../src/index.js';

const sampleDir = path.dirname(fileURLToPath(import.meta.url));

const outputDir = createStudio({
    title: 'One Pane JSON Studio',
    outputDir: path.join(sampleDir, 'generated'),
    panes: [
        {
            key: 'source',
            label: 'Source JSON',
            header: { type: 'file-picker' },
            body: {
                type: 'monaco',
                language: 'json',
                fileName: 'source.json',
                content: {
                    project: 'Monaco JSON Studio',
                    version: 9,
                    ready: true
                }
            },
            footer: { type: 'cursor' }
        }
    ]
});

console.log(`Generated one-pane sample: ${outputDir}`);
