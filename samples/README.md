# Local V12 samples

Each sample calls `createStudio(paneCount, folderName)` through the repository entry point.

From the repository root, install dependencies once and generate all three samples:

```bash
npm ci
npm run samples
```

Run one sample with `npm run sample:1`, `npm run sample:2`, or `npm run sample:3`. Each writes to its own `generated/` folder. If you run a sample again, remove its existing `generated/` folder first; V12 stops rather than overwrite it.
