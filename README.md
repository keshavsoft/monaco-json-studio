# @keshavsoft/monaco-json-studio

Zero-dependency physical and static Monaco JSON Studio scaffold generator and specification assembler.

Generates disciplined, modular, production-grade Monaco Studio projects for 1, 2, or 3 JSON panes with 100% static HTML.

---

## Quick Start (CLI)

### If your terminal is inside `monaco-json-studio`:
```bash
# 1-Pane Single JSON Visualizer
node ./bin/index.js 1 ./my-single-studio

# 2-Pane Dual JSON Studio (50/50 Split)
node ./bin/index.js 2 ./my-dual-studio

# 3-Pane Triple JSON Studio (33/33/33 Split)
node ./bin/index.js 3 ./my-triple-studio
```

### If your terminal is in the parent `table` folder:
```bash
node ./monaco-json-studio/bin/index.js 2 ./my-dual-studio
```

### When published / linked globally via NPX:
```bash
npx @keshavsoft/monaco-json-studio 2 ./my-dual-studio
```

---

## Programmatic Usage (NPM Library)

```javascript
import { generateStudio, specToHtml, assembleSpec } from "@keshavsoft/monaco-json-studio";

// Scaffold a physical project folder
generateStudio({
    inPanes: 2,
    inTargetDir: "./client-studio",
    inTitle: "Custom Client Studio"
});
```

---

## Architecture & Features

- **100% Static HTML Generation**: No blank mount points. Full HTML elements are compiled directly into `index.html`.
- **Modular Control-Scoped CSS**: Pre-packaged with disciplined `base.css`, `header.css`, `workspace.css`, and `footer.css`.
- **Independent File Pickers**: Each editor pane has its own file open button and active file badge.
- **Zero Runtime Assembler Dependencies**: Client output runs standalone, offline, and lightweight.

---

## License

MIT © KeshavSoft
