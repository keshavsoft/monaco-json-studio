# Monaco JSON Studio

**Choose a pane count. Get a complete static studio.**

Monaco JSON Studio generates one, two, or three editor panes with a ready-made studio header, pane headers, Monaco bodies, pane footers, and global status footer. The public choice stays small; the generator owns the composition.

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

## The v6 generation story

The package root exposes one default generator, and the CLI passes it the pane count. Internally, focused functions build the studio header, workspace, pane header/body/footer, and studio footer. Handlebars templates render those pieces into static HTML.

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
- [Earlier v5 architecture](docs/v5-story.html)

## License

MIT © KeshavSoft
