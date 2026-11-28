import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createStudio } from '../../src/index.js';

const sampleDir = path.dirname(fileURLToPath(import.meta.url));

const outputDir = createStudio({
    title: 'Three Stage JSON Studio',
    outputDir: path.join(sampleDir, 'generated'),
    panes: [
        {
            key: 'source',
            label: 'Source Dataset',
            header: {
                type: 'select',
                options: [
                    {
                        label: 'Orders',
                        value: 'orders',
                        content: { orders: [{ id: 101, total: 24.5 }] }
                    },
                    {
                        label: 'Returns',
                        value: 'returns',
                        content: { returns: [{ id: 101, reason: 'size' }] }
                    }
                ]
            },
            body: { type: 'monaco', language: 'json' },
            footer: { type: 'cursor' }
        },
        {
            key: 'rules',
            label: 'Transform Rules',
            header: { type: 'file-picker' },
            body: {
                type: 'monaco',
                language: 'json',
                fileName: 'rules.json',
                content: {
                    include: ['id', 'total'],
                    currency: 'USD'
                }
            },
            footer: { type: 'note', text: 'Rules applied to the source' }
        },
        {
            key: 'result',
            label: 'Result',
            header: { type: 'title' },
            body: {
                type: 'monaco',
                language: 'json',
                fileName: 'result.json',
                content: {
                    id: 101,
                    total: 24.5,
                    currency: 'USD'
                }
            },
            footer: { type: 'cursor' }
        }
    ]
});

console.log(`Generated three-pane sample: ${outputDir}`);
