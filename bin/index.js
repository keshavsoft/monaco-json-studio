#!/usr/bin/env node
import generateStudio from '../src/index.js';

const args = process.argv.slice(2);

function showHelp() {
    console.log(`
Monaco JSON Studio v5

Create a static studio by choosing its pane count:

  npx monaco-json-studio <1|2|3>

Examples:
  npx monaco-json-studio 1
  npx monaco-json-studio 2
  npx monaco-json-studio 3

The generated project is written to ./monaco-studio.
`);
}

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    showHelp();
    process.exit(0);
}

if (args.length !== 1 || !/^[123]$/.test(args[0])) {
    console.error('Pane count must be exactly 1, 2, or 3.');
    showHelp();
    process.exit(1);
}

const paneCount = Number(args[0]);
try {
    const targetDir = generateStudio(paneCount);
    console.log(`Generated Monaco Studio v5 with ${paneCount} pane${paneCount === 1 ? '' : 's'}.`);
    console.log(`Open: ${targetDir}/index.html`);
} catch (error) {
    console.error(`Could not generate Monaco Studio: ${error.message}`);
    process.exit(1);
}
