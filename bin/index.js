#!/usr/bin/env node
import path from 'path';
import { generateStudio } from '../src/index.js';

// Parse arguments
const args = process.argv.slice(2);

let panes = 2;
let targetDir = './my-monaco-studio';
let title = 'Monaco Studio';

for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') {
        console.log(`
Usage:
  npx @keshavsoft/monaco-json-studio [panes] [targetDir] [options]

Examples:
  npx @keshavsoft/monaco-json-studio 1 ./single-studio
  npx @keshavsoft/monaco-json-studio 2 ./double-studio
  npx @keshavsoft/monaco-json-studio 3 ./triple-studio --title="Client Studio"

Options:
  --panes=<1|2|3>     Number of Monaco editors (default: 2)
  --target=<dir>      Destination directory (default: ./my-monaco-studio)
  --title=<title>     Studio branding title
  -h, --help          Show help
`);
        process.exit(0);
    } else if (arg.startsWith('--panes=')) {
        panes = parseInt(arg.split('=')[1], 10);
    } else if (arg.startsWith('--target=')) {
        targetDir = arg.split('=')[1];
    } else if (arg.startsWith('--title=')) {
        title = arg.split('=')[1];
    } else if (!arg.startsWith('-')) {
        if (i === 0 && !isNaN(parseInt(arg, 10))) {
            panes = parseInt(arg, 10);
        } else if (i === 1 || (i === 0 && isNaN(parseInt(arg, 10)))) {
            targetDir = arg;
        }
    }
}

console.log(`\n======================================================`);
console.log(`  🚀 @keshavsoft/monaco-json-studio`);
console.log(`  Mode: ${panes} Pane${panes > 1 ? 's' : ''} (100% Static HTML)`);
console.log(`  Target: ${path.resolve(process.cwd(), targetDir)}`);
console.log(`======================================================\n`);

try {
    const result = generateStudio({
        inPanes: panes,
        inTargetDir: targetDir,
        inTitle: title
    });

    console.log(`✓ Generated 100% STATIC index.html with ${panes} panes baked in`);
    console.log(`✓ Copied modular CSS (base.css, header.css, workspace.css, footer.css)`);
    console.log(`✓ Copied ${panes} sample data files`);
    console.log(`✓ Generated static JS controller (zero runtime assemble/fetch dependencies)`);

    console.log(`\n🎉 Success! Scaffolded physical studio at:`);
    console.log(`   ${result.targetDir}\n`);
} catch (err) {
    console.error(`❌ Error generating studio:`, err.message);
    process.exit(1);
}
