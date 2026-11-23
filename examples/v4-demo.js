import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateStudio } from '../src/v4/index.js';

const exampleDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(exampleDir, '..');

const result = generateStudio({
    inTitle: 'Typed Pane Regions Demo',
    inTargetDir: path.join(repoRoot, 'preview-v4'),
    inPaneConfigs: [
        {
            key: 'instructions',
            label: 'Instructions',
            fileName: 'instructions.json',
            header: { type: 'file-picker' },
            body: { type: 'monaco', language: 'json' },
            footer: { type: 'cursor' }
        },
        {
            key: 'data',
            label: 'Data',
            fileName: 'data.json',
            header: { type: 'file-picker' },
            body: { type: 'monaco', language: 'json' },
            footer: { type: 'note', text: 'Data pane • editable JSON' }
        },
        {
            key: 'output',
            label: 'Output',
            fileName: 'columns.json',
            header: { type: 'title' },
            body: { type: 'monaco', language: 'json' },
            footer: { type: 'none' }
        }
    ]
});

console.log(`Generated ${result.panes} typed panes at ${result.targetDir}`);
