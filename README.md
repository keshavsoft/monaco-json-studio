# @keshavsoft/monaco-json-studio

> **Zero-dependency physical and static Monaco JSON Studio scaffold generator and specification assembler.**

Generates disciplined, modular, production-grade Monaco Studio projects for **1, 2, or 3 JSON panes** with **100% pre-compiled static HTML**.

[![npm version](https://img.shields.io/npm/v/@keshavsoft/monaco-json-studio.svg)](https://www.npmjs.com/package/@keshavsoft/monaco-json-studio)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Docs](https://img.shields.io/badge/Docs-Multi--Page%20HTML-cyan)](docs/index.html)

---

## 📖 The Story & Purpose

Inspecting, comparing, and validating structured JSON data often forces teams to configure complex frontend build tools (Webpack, Vite, React bundles) just to mount a few Monaco editors side-by-side. 

**`@keshavsoft/monaco-json-studio`** changes this paradigm by treating Monaco workspaces as **physical, spec-driven static scaffolds**:
- **One-Shot NPX Execution**: Generate a full working workspace anywhere with zero setup.
- **100% Static HTML Markup**: The DOM tree, headers, split panes, and file triggers are baked directly into `index.html`.
- **Modular Control-Scoped CSS**: Pre-packaged clean stylesheets (`base.css`, `header.css`, `workspace.css`, `footer.css`) instead of monolithic bundles.
- **Zero Runtime Assembler Overhead**: Generated projects run standalone on any static web server or CDN (GitHub Pages, Cloudflare Pages, S3).

---

## 📚 Multi-Page Documentation

Full documentation is available in the [`docs/`](docs/index.html) directory:
- [📖 **Overview & Story**](docs/index.html): Philosophy, core features, and live benefits.
- [⚡ **NPX Quickstart & CLI Guide**](docs/npx-quickstart.html): Complete reference for CLI options, flags, and quick commands.
- [🪟 **Multi-Pane Layouts Guide**](docs/panes-guide.html): 1-Pane (100%), 2-Pane (50/50), and 3-Pane (33/33/33) specs.
- [🏛️ **Static Architecture**](docs/architecture.html): Spec compilation pipeline, directory blueprints, and CSS modularity.
- [🔧 **Programmatic API Reference**](docs/api-reference.html): How to use `generateStudio`, `buildHtml`, and `assembleSpec` in Node.js.

---

## ⚡ Instant NPX Quick Start

You can run it instantly without prior installation:

```bash
# 1-Pane Single JSON Visualizer (100% width)
npx @keshavsoft/monaco-json-studio 1 ./my-single-studio

# 2-Pane Dual JSON Studio (50/50 Split)
npx @keshavsoft/monaco-json-studio 2 ./my-dual-studio --title="API Data Diff"

# 3-Pane Triple JSON Studio (33/33/33 Split)
npx @keshavsoft/monaco-json-studio 3 ./my-triple-studio --title="ETL Pipeline Studio"
```

### Scaffold Directly into Current Folder
```bash
npx @keshavsoft/monaco-json-studio 2 .
```

---

## 💻 CLI Usage & Arguments

```bash
npx @keshavsoft/monaco-json-studio <panes> [targetDir] [options]
```

### Arguments & Flags:
| Argument | Description | Default |
| :--- | :--- | :--- |
| `<panes>` | **Required.** Number of Monaco editor panes (`1`, `2`, or `3`). | - |
| `[targetDir]` | **Optional.** Destination folder path. | `./monaco-studio` |
| `--title=<title>` | Branding title for studio header. | `"Monaco Studio"` |
| `--panes=<num>` | Named variant for specifying pane count. | - |
| `--target=<path>` | Named variant for specifying output path. | `./monaco-studio` |
| `-h, --help` | Display CLI help and argument table. | - |

---

## 📁 Scaffolded Project Structure

```text
my-studio/
├── css/
│   ├── base.css          # Theme tokens & typography
│   ├── header.css        # Studio title & top bar
│   ├── workspace.css     # Flexbox layout, split panes & editors
│   └── footer.css        # Status bar & badges
├── data/
│   ├── data.json         # Seed dataset 1
│   ├── instructions.json # Seed dataset 2 (if panes >= 2)
│   └── columns.json      # Seed dataset 3 (if panes >= 3)
├── js/
│   ├── state.js          # Reactive runtime state & utilities
│   └── index.js          # Monaco loader & pane wiring controller
└── index.html            # 100% pre-rendered static HTML markup
```

---

## 🔧 Programmatic Usage (Node.js API)

You can also import it as a library inside your own automation scripts:

```javascript
import { generateStudio, buildHtml, assembleSpec, specToHtml } from "@keshavsoft/monaco-json-studio";

// Scaffold a physical project folder
generateStudio({
    inPanes: 2,
    inTargetDir: "./dist/client-studio",
    inTitle: "Custom Client Studio"
});

// Or assemble specifications programmatically
const spec = assembleSpec({ inPanes: 2, inTitle: "Diff Studio" });
const bodyMarkup = specToHtml(spec);
```

---

## 🧪 Testing Locally

Inside the repository root:
```bash
# Test 2-pane scaffold generation:
npm test

# Run CLI directly from source:
node ./bin/index.js 2 ./test-output
```

---

## 📄 License

MIT © [KeshavSoft](https://github.com/keshavsoft)
