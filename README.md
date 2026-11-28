# Monaco JSON Studio

Monaco JSON Studio creates a static editor studio. Its public API has two inputs: pane count and output folder name.

## Use with NPM

```js
import createStudio from 'monaco-json-studio';

createStudio();                       // 1 pane in ./monaco-studio
createStudio(2);                      // 2 panes in ./monaco-studio
createStudio(3, './review-studio');   // 3 panes in ./review-studio
```

The named export works too:

```js
import { createStudio } from 'monaco-json-studio';

const result = createStudio(2, './review-studio');
console.log(result.message);
console.log(result.folderPath);
```

Pane count must be `1`, `2`, or `3`. If omitted, it defaults to `1`. The folder defaults to `./monaco-studio`. A missing folder is created; an existing folder is reused and its generated files are refreshed.

## Use with NPX

```bash
npx monaco-json-studio
npx monaco-json-studio 2
npx monaco-json-studio 3 ./review-studio
```

The first argument is pane count; the second is the output folder name or path. Both are optional.

## Run local samples

```bash
npm ci
npm run samples
```

The samples call the same two-input API and write into their own `generated/` folders.

## Generation story

V12 follows a short sequence:

1. Validate the pane count and folder name.
2. Check the output folder; create it when it is missing.
3. Build the studio page and the requested number of panes.
4. Copy V12 styles and browser runtime files.
5. Return the output path and folder status.

The implementation and its assets live in `src/v12/` and `assets/v12/`.
