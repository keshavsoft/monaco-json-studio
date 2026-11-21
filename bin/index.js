#!/usr/bin/env node
import path from 'path';
import { generateStudio } from '../src/index.js';

const args = process.argv.slice(2);

function printHelp() {
    console.log(`
========================================================================
  🚀 @keshavsoft/monaco-json-studio (v3)
  Zero-dependency Physical Static Monaco Studio Generator (Spec-Driven)
========================================================================

Usage:
  npx @keshavsoft / monaco - json - studio < panes > [targetDir][options]

Arguments:
        <panes>         Required. Number of Monaco editor panes (1, 2, or 3):
            1  → Single Full-Width Monaco Studio (100% width)
            2  → Dual Split Monaco Studio (50/50 split)
            3  → Triple Split Monaco Studio (33/33/33 split)

            [targetDir]     Optional. Destination directory path:
            - Pass a folder name (e.g., ./my-studio)
            - Pass '.' to scaffold directly into current folder
            (Default: ./monaco-studio)

            Options:
                    --title=<title> Custom branding title for studio header
                        -h, --help      Display this guide

                        Examples:
                        npx @keshavsoft/monaco-json-studio 1 ./single-viewer
                        npx @keshavsoft/monaco-json-studio 2 ./dual-studio --title="API Data Studio"
                        npx @keshavsoft/monaco-json-studio 3 .
========================================================================
`);
}

// 1. If no arguments provided or help requested, show guide
if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
    printHelp();
    process.exit(0);
}

// 2. Parse arguments
let panes = null;
let targetDir = './monaco-studio';
let title = 'Monaco Studio';

for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--panes=')) {
        panes = parseInt(arg.split('=')[1], 10);
    } else if (arg.startsWith('--target=')) {
        targetDir = arg.split('=')[1];
    } else if (arg.startsWith('--title=')) {
        title = arg.split('=')[1];
    } else if (!arg.startsWith('-')) {
        if (panes === null && !isNaN(parseInt(arg, 10))) {
            panes = parseInt(arg, 10);
        } else if (targetDir === './monaco-studio') {
            targetDir = arg;
        }
    }
}

// 3. Validate pane count (strictly 1, 2, or 3)
if (panes === null || isNaN(panes) || panes < 1 || panes > 3) {
    console.error(`\n❌ Error: Invalid pane count "${panes}". Must be 1, 2, or 3.`);
    printHelp();
    process.exit(1);
}

const resolvedTarget = path.resolve(process.cwd(), targetDir);

console.log(`\n======================================================`);
console.log(`  🚀 @keshavsoft/monaco-json-studio (v3)`);
console.log(`  Mode: ${panes} Pane${panes > 1 ? 's' : ''} (100% Static HTML)`);
console.log(`  Target: ${resolvedTarget}`);
console.log(`======================================================\n`);

try {
    const result = generateStudio({
        inPanes: panes,
        inTargetDir: resolvedTarget,
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
