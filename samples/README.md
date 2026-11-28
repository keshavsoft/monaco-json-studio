# Local V9 samples

These examples import the checkout's current package entry point, so they run V10 directly without publishing or installing a new package version.

From the repository root, install the locked dependencies once:

```bash
npm ci
```

Run one sample from the repository root:

```bash
npm run sample:1
npm run sample:2
npm run sample:3
```

Generate all three:

```bash
npm run samples
```

Each command writes a static studio into that sample's `generated/` folder. Open its `index.html` through a local static web server to use Monaco and the sample data.
