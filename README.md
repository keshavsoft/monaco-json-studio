# Monaco JSON Studio

Monaco JSON Studio creates a static editor studio. Its public API has two inputs: pane count and output folder name.

## Use with NPM

```js
import { createStudio } from 'monaco-json-studio';

createStudio();                       // 1 pane in ./monaco-studio
createStudio(2);                      // 2 panes in ./monaco-studio
createStudio(3, './review-studio');   // 3 panes in ./review-studio
```

`createStudio` is the package's single public function. It returns the generated folder path and a status message.

Pane count must be `1`, `2`, or `3`. If omitted, it defaults to `1`. The folder defaults to `./monaco-studio`. V12 creates a missing folder. If the folder already exists, it stops with an error before generating any files; choose another folder or remove the existing one first.

## Use with NPX

```bash
npx monaco-json-studio
npx monaco-json-studio 2
npx monaco-json-studio 3 ./review-studio
```

The first argument is pane count; the second is the output folder name or path. Both are optional. If the output folder is already present, the command stops and reports the conflict.

## Run local samples

```bash
npm ci
npm run samples
```

The samples call the same two-input API and write into their own `generated/` folders. Remove a sample's existing `generated/` folder before running that sample again.

## Generation story

V12 follows the work in order:

1. `validateInputs/` checks pane count and output folder name.
2. `createPanes/` creates the standard pane definitions.
3. `generateStudio/` stops if the output folder already exists, then creates it.
4. `buildStudioUi/` builds the studio header, pane workspace, and footer.
5. `wireStudioJavaScript/` writes pane runtime state and copies browser code; V12 styles are copied alongside it.

V12 keeps its product inputs and pane defaults in `src/v12/`. The shared page builder, output folder guard, templates, and browser assets are provided by `monaco-json-studio-base/v1`.

During local development this repository consumes the sibling base repository through a `file:` dependency. Publish the base package and replace that local dependency before publishing this package.
