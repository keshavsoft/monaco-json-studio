import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Handlebars from 'handlebars';

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.resolve(moduleDir, '..', '..', '..', 'assets');
const templatesDir = path.join(assetsDir, 'v8', 'templates');
const compiledTemplates = new Map();

function renderTemplate(templateName, values = {}) {
    let template = compiledTemplates.get(templateName);
    if (!template) {
        const source = fs.readFileSync(path.join(templatesDir, templateName), 'utf8');
        template = Handlebars.compile(source);
        compiledTemplates.set(templateName, template);
    }
    return template(values);
}

function trustedMarkup(html) {
    return new Handlebars.SafeString(html || '');
}

export { assetsDir, renderTemplate, trustedMarkup };
