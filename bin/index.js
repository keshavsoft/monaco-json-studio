#!/usr/bin/env node
import generateStudio from '../src/index.js';

const args = process.argv.slice(2);

function showHelp() {
    console.log(`
Monaco JSON Studio v8

Create a static studio by pane count or by specifying <header> <body> <footer>:

  npx monaco-json-studio <1|2|3>
  npx monaco-json-studio <header> <body> <footer>
  npx monaco-json-studio <1|2|3> <header> <body> <footer>

Region options:
  header : title | file-picker | select | none
  body   : monaco
  footer : cursor | note | none

Examples:
  npx monaco-json-studio 1
  npx monaco-json-studio file-picker monaco cursor
  npx monaco-json-studio 2 file-picker monaco cursor

The generated project is written to ./monaco-studio.
`);
}

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    showHelp();
    process.exit(0);
}

let paneCount = 1;
let headerType = 'title';
let bodyType = 'monaco';
let footerType = 'none';

if (args.length === 1 && /^[123]$/.test(args[0])) {
    paneCount = Number(args[0]);
} else if (args.length === 3) {
    [headerType, bodyType, footerType] = args;
} else if (args.length === 4 && /^[123]$/.test(args[0])) {
    paneCount = Number(args[0]);
    [, headerType, bodyType, footerType] = args;
} else {
    console.error('Invalid arguments.');
    showHelp();
    process.exit(1);
}

function buildHeader(type) {
    if (type !== 'select') return { type };
    return {
        type: 'select',
        options: [
            { label: 'Sample A', value: 'sampleA', content: { sample: 'A' } },
            { label: 'Sample B', value: 'sampleB', content: { sample: 'B' } }
        ]
    };
}

function buildFooter(type) {
    if (type !== 'note') return { type };
    return { type: 'note', text: 'Monaco JSON Studio' };
}

const panes = Array.from({ length: paneCount }, (_, index) => ({
    key: `pane${index + 1}`,
    label: `Pane ${index + 1}`,
    header: buildHeader(headerType),
    body: { type: bodyType, language: 'json' },
    footer: buildFooter(footerType)
}));

try {
    const targetDir = generateStudio({
        outputDir: './monaco-studio',
        panes
    });
    console.log(`Generated Monaco Studio v8 (${paneCount} pane${paneCount === 1 ? '' : 's'}: ${headerType} / ${bodyType} / ${footerType}).`);
    console.log(`Open: ${targetDir}/index.html`);
} catch (error) {
    console.error(`Could not generate Monaco Studio: ${error.message}`);
    process.exit(1);
}
