#!/usr/bin/env node
import createStudio from '../src/index.js';

const args = process.argv.slice(2);

function showHelp() {
    console.log(`
Monaco JSON Studio v12

Create a studio with a pane count and optional output folder:

  npx monaco-json-studio [1|2|3] [folder-name]

Defaults:
  pane count : 1
  folder     : ./monaco-studio

Examples:
  npx monaco-json-studio
  npx monaco-json-studio 2
  npx monaco-json-studio 3 ./three-pane-studio
`);
}

if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    process.exit(0);
}

if (args.length > 2) {
    console.error('Provide only a pane count and a folder name.');
    showHelp();
    process.exit(1);
}

let paneCount = 1;
if (args[0] !== undefined) {
    if (!/^[123]$/.test(args[0])) {
        console.error('Pane count must be 1, 2, or 3.');
        process.exit(1);
    }
    paneCount = Number(args[0]);
}

const folderName = args[1];

try {
    const generationResult = createStudio(paneCount, folderName);
    console.log(generationResult.message);
    console.log(`Open: ${generationResult.folderPath}/index.html`);
} catch (error) {
    console.error(`Could not generate Monaco Studio: ${error.message}`);
    process.exit(1);
}
