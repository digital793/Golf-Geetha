import { db } from './db.js';
import { navDefault } from '../src/cms/defaults.js';

const insert = db.prepare('INSERT INTO nav_links (page_id, label, sort_order) VALUES (?, ?, ?)');
const tx = db.transaction(() => {
  db.prepare('DELETE FROM nav_links').run();
  for (const item of navDefault) {
    insert.run(item.page_id, item.label, item.sort_order);
  }
});
tx();
console.log('Nav restored:', navDefault.map((item) => item.label).join(' · '));
