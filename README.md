# Monaco JSON Studio

**Choose a pane count. Get a complete static studio.**

Monaco JSON Studio creates one, two, or three side-by-side panes with a ready-made studio header, pane headers, Monaco bodies, pane footers, and a global status footer. The generated HTML already contains the complete page structure; modular CSS arranges and styles it.

## Use the v5 command

The v5 consumer contract is one number:

```bash
npx monaco-json-studio 1
npx monaco-json-studio 2
npx monaco-json-studio 3
```

The generator writes a `monaco-studio/` folder in the current directory. The number controls both the number of pane sections in the HTML and the workspace grid.

### Try the local source preview

v5 is local source work and has not been published. To run this checkout, use:

```bash
node ./bin/index.js 3
```

The published npm package will keep serving its current release until a new release is published. This repository has not been pushed or published as part of the v5 work.

## The generation story

The CLI passes the count to one high-level generator. Internally, the generator:

1. Creates the studio-level header and footer.
2. Builds a one-, two-, or three-column workspace.
3. Creates each pane from a pane header, body, and footer.
4. Serializes the assembled document to static HTML.
5. Copies modular CSS, sample data, and the Monaco runtime controller.

The studio header/footer frame the complete page. Each pane has its own header/body/footer regions. These are separate modules because they have separate jobs.

```text
src/v5/
├── generateStudio/       # High-level generation operation
├── createStudioDocument/ # Complete HTML document
├── createStudioHeader/   # Studio-wide header
├── createWorkspace/      # Grid and pane count
├── createPane/           # Composes each pane
├── createPaneHeader/     # Pane controls and label
├── createPaneBody/       # Monaco mount region
├── createPaneFooter/     # Pane status or summary
├── createStudioFooter/   # Studio-wide status bar
├── serializeHtml/        # HTML serialization
└── internal/             # Defaults and spec helpers

assets/v5/
├── specs/regions/        # Region markup specifications
├── css/                  # Shell, layout, and region styles
└── templates/            # Browser-side Monaco controller
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

Serve the generated folder with any static web server and open `index.html` through that server.

## Programmatic use

The package root exposes one default generator. It takes the same pane count and writes to `./monaco-studio`:

```javascript
import generateStudio from 'monaco-json-studio';

generateStudio(3);
```

## Documentation

- [v5 story and source architecture](docs/v5-story.html)
- [v5 command usage](docs/npx-quickstart.html)
- [Generated project architecture](docs/architecture.html)
- [Previous v4 contract draft](docs/v4-consumption.html)

## License

MIT © KeshavSoft
