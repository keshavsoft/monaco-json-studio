# Monaco JSON Studio

**Choose a pane count. Get a complete static studio.**

Monaco JSON Studio generates one, two, or three editor panes with a ready-made studio header, pane headers, Monaco bodies, pane footers, and global status footer. Use the npx count command for a quick setup or the npm object API for detailed pane composition.

## Use it

The v6 command takes one number and writes `./monaco-studio` in the current directory:

```bash
npx monaco-json-studio 1
npx monaco-json-studio 2
npx monaco-json-studio 3
```

From this checkout, run the local source directly:

```bash
node ./bin/index.js 3
```

v6 is local source work and has not been published. Registry users continue to receive the published release until a new release is made.

## Use the npm object API (v7 source preview)

The v7 checkout adds a named `createStudio(config)` API for detailed pane layouts. The default export and the existing npx count command remain unchanged. This API is local source work and is not available from the published npm release yet.

```js
import { createStudio } from 'monaco-json-studio';

createStudio({
  title: 'Dataset Review',
  outputDir: './dataset-review',
  panes: [
    {
      key: 'catalog',
      label: 'Catalog',
      header: {
        type: 'select',
        options: [
          { label: 'Fasteners', value: 'fasteners', content: [{ item: 'Bolt' }] },
          { label: 'Electrical', value: 'electrical', content: [{ item: 'Cable' }] }
        ]
      },
      body: { type: 'monaco', language: 'json' },
      footer: { type: 'note', text: 'Choose a dataset above.' }
    }
  ]
});
```

Header types are `file-picker`, `title`, `select`, and `none`. The select header switches the pane’s Monaco content between its configured JSON options. Body type is currently `monaco`; footer types are `cursor`, `note`, and `none`. Each pane gets unique DOM IDs from its position, so consumers configure logical keys rather than IDs.

Try the three local npm API variations:

```bash
npm run demo:v7
npm run dev:v7
```

See the [v7 npm API guide](docs/npm-v7.html) and [runnable examples](examples/npm-v7/generate-variations.mjs).

## The v6 generation story

The default export and CLI still pass only a pane count. Internally, focused functions build the studio header, workspace, pane header/body/footer, and studio footer. Handlebars templates render those pieces into static HTML. The v7 named npm API adds the object-based option described above.

```text
src/v6/
├── generateStudio/       # One high-level generation operation
├── createStudioDocument/ # Complete page composition
├── createStudioHeader/   # Studio-wide header
├── createWorkspace/      # Grid and pane count
├── createPane/           # Composes each pane
├── createPaneHeader/
├── createPaneBody/
├── createPaneFooter/
├── createStudioFooter/   # Studio-wide status footer
└── internal/             # Count validation, defaults, Handlebars loader

assets/v6/
├── templates/            # Handlebars HTML templates and Monaco controller
│   └── regions/          # Header, body, and footer templates
└── css/                  # Base, shell, pane layout, and region styles
```

The generated folder contains plain HTML, CSS, sample data, and the browser-side Monaco controller. Handlebars renders at generation time; it is not shipped into the generated page.

## Local preview with Vite

Vite is a development dependency for serving the generated preview. It does not participate in the consumer command or generated runtime.

```bash
cd preview-v6
node ../bin/index.js 3
cd ..
npm run dev:v6
```

## Generated project

```text
monaco-studio/
├── index.html
├── css/
│   ├── base.css
│   ├── studio.css
│   ├── pane-layout.css
│   └── pane-regions.css
├── data/
└── js/
    ├── index.js
    └── state.js
```

## Documentation

- [v6 story and source architecture](docs/v6-story.html)
- [v6 command usage](docs/npx-quickstart.html)
- [Programmatic entry point](docs/api-reference.html)
- [v7 npm object API](docs/npm-v7.html)
- [Earlier v5 architecture](docs/v5-story.html)

## License

MIT © KeshavSoft
