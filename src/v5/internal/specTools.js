import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.resolve(moduleDir, '..', '..', '..', 'assets');

function readSpec(relativePath) {
    return JSON.parse(fs.readFileSync(path.join(assetsDir, relativePath), 'utf8'));
}

function interpolate(spec, values) {
    if (typeof spec === 'string') {
        return spec.replace(/\{\{([A-Za-z0-9_]+)\}\}/g, (_, key) => String(values[key] ?? ''));
    }
    if (Array.isArray(spec)) return spec.map((item) => interpolate(item, values));
    if (spec && typeof spec === 'object') {
        return Object.fromEntries(Object.entries(spec).map(([key, value]) => [key, interpolate(value, values)]));
    }
    return spec;
}

export { assetsDir, interpolate, readSpec };
