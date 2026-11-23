import { createStudio } from 'monaco-json-studio';

const simpleStudio = createStudio({
    title: 'Quick JSON Desk',
    outputDir: './preview-v7/quick-desk',
    panes: [
        {
            key: 'request',
            label: 'Request',
            header: { type: 'title' },
            body: {
                type: 'monaco',
                language: 'json',
                initialValue: { method: 'GET', path: '/api/items' }
            },
            footer: { type: 'note', text: 'One pane, configured from npm.' }
        }
    ]
});

const compareStudio = createStudio({
    title: 'Dataset Review',
    outputDir: './preview-v7/dataset-review',
    brandFooter: 'KeshavSoft · Dataset Review',
    panes: [
        {
            key: 'instructions',
            label: 'Instructions',
            header: { type: 'file-picker' },
            body: {
                type: 'monaco',
                language: 'json',
                fileName: 'instructions.json',
                initialValue: { task: 'Review each record for completeness.' }
            },
            footer: { type: 'cursor' }
        },
        {
            key: 'catalog',
            label: 'Choose catalog',
            header: {
                type: 'select',
                options: [
                    { label: 'Fasteners', value: 'fasteners', content: [{ item: 'Bolt', unit: 'Kg' }, { item: 'Nut', unit: 'Kg' }] },
                    { label: 'Electrical', value: 'electrical', content: [{ item: 'Cable', unit: 'Mtr' }, { item: 'Switch', unit: 'Each' }] }
                ]
            },
            body: { type: 'monaco', language: 'json' },
            footer: { type: 'note', text: 'Changing the selection loads that dataset into Monaco.' }
        }
    ]
});

const pipelineStudio = createStudio({
    title: 'Three-Step Data Pipeline',
    outputDir: './preview-v7/data-pipeline',
    panes: [
        {
            key: 'instructions',
            label: 'Instructions',
            header: { type: 'file-picker' },
            body: { type: 'monaco', language: 'json', initialValue: { operation: 'map', source: 'data' } },
            footer: { type: 'note', text: 'Step 1 · describe the transformation.' }
        },
        {
            key: 'data',
            label: 'Source data',
            header: {
                type: 'select',
                options: [
                    { label: 'Inventory', value: 'inventory', content: [{ sku: 'B-100', quantity: 24 }, { sku: 'C-210', quantity: 7 }] },
                    { label: 'Orders', value: 'orders', content: [{ orderId: 'SO-01', total: 2400 }, { orderId: 'SO-02', total: 875 }] }
                ]
            },
            body: { type: 'monaco', language: 'json' },
            footer: { type: 'cursor' }
        },
        {
            key: 'output',
            label: 'Output',
            header: { type: 'title' },
            body: { type: 'monaco', language: 'json', initialValue: { result: 'Generated output appears here.' } },
            footer: { type: 'note', text: 'Step 3 · inspect the result.' }
        }
    ]
});

console.log('Generated npm API variations:');
console.log(`  1 pane: ${simpleStudio}`);
console.log(`  2 panes: ${compareStudio}`);
console.log(`  3 panes: ${pipelineStudio}`);
