import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Handlebars from 'handlebars';

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
export const assetsDir = path.resolve(moduleDir, '..', '..', '..', 'assets');
const templatesDir = path.join(assetsDir, 'v9', 'templates');
const compiledTemplates = new Map();

export function renderTemplate(templateName, values = {}) {
    let template = compiledTemplates.get(templateName);
    if (!template) {
        const source = fs.readFileSync(path.join(templatesDir, templateName), 'utf8');
        template = Handlebars.compile(source);
        compiledTemplates.set(templateName, template);
    }
    return template(values);
}

export function trustedMarkup(html) {
    return new Handlebars.SafeString(html || '');
}
