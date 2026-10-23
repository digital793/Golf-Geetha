import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getContent } from '../server/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

const content = getContent();
const seedFile = path.join(rootDir, 'src/cms/seedContent.json');

fs.writeFileSync(seedFile, JSON.stringify(content, null, 2), 'utf-8');
console.log('Successfully exported database content to src/cms/seedContent.json');
console.log('Settings book_cover:', content.settings.book_cover);
console.log('Author photo:', content.sections.author.photo);
console.log('Holes count:', content.holes.length);
