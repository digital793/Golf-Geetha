import { db } from './db.js';
import { buildDefaultContent } from '../src/cms/defaults.js';

const content = buildDefaultContent();

const tx = db.transaction(() => {
  const upsertSetting = db.prepare(`
    INSERT INTO site_settings (key, value) VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `);
  for (const [key, value] of Object.entries(content.settings)) {
    upsertSetting.run(key, value ?? '');
  }

  db.prepare('DELETE FROM platforms').run();
  const insertPlatform = db.prepare(`
    INSERT INTO platforms (slug, name, formats, icon, url, sort_order, is_active)
    VALUES (@slug, @name, @formats, @icon, @url, @sort_order, @is_active)
  `);
  for (const platform of content.platforms) insertPlatform.run(platform);

  const upsertHole = db.prepare(`
    INSERT INTO holes (hole, par, distance, numeral, title, subtitle, sanskrit, devanagari, description, image)
    VALUES (@hole, @par, @distance, @numeral, @title, @subtitle, @sanskrit, @devanagari, @description, @image)
    ON CONFLICT(hole) DO UPDATE SET
      par = excluded.par,
      numeral = excluded.numeral,
      title = excluded.title,
      subtitle = excluded.subtitle,
      sanskrit = excluded.sanskrit,
      devanagari = excluded.devanagari,
      description = excluded.description
  `);
  for (const hole of content.holes) upsertHole.run(hole);

  db.prepare('DELETE FROM articles').run();
  const insertArticle = db.prepare(`
    INSERT INTO articles (title, description, body, image, read_time, category, hole_tag, sort_order, is_active)
    VALUES (@title, @description, @body, @image, @read_time, @category, @hole_tag, @sort_order, @is_active)
  `);
  for (const article of content.articles) insertArticle.run(article);

  db.prepare('DELETE FROM faqs').run();
  const insertFaq = db.prepare('INSERT INTO faqs (question, answer, sort_order) VALUES (?, ?, ?)');
  for (const faq of content.faqs) insertFaq.run(faq.question, faq.answer, faq.sort_order);

  db.prepare('DELETE FROM nav_links').run();
  const insertNav = db.prepare('INSERT INTO nav_links (page_id, label, sort_order) VALUES (?, ?, ?)');
  for (const item of content.nav) insertNav.run(item.page_id, item.label, item.sort_order);

  const upsertBlock = db.prepare(`
    INSERT INTO content_blocks (section, field_key, value) VALUES (?, ?, ?)
    ON CONFLICT(section, field_key) DO UPDATE SET value = excluded.value
  `);
  for (const [section, fields] of Object.entries(content.sections)) {
    for (const [field_key, value] of Object.entries(fields)) {
      upsertBlock.run(section, field_key, value ?? '');
    }
  }

  db.prepare("DELETE FROM list_items WHERE list_key IN ('marquee', 'who_for', 'social', 'quiz_options')").run();
  const insertList = db.prepare(`
    INSERT INTO list_items (list_key, title, subtitle, description, extra, icon, image, sort_order)
    VALUES (@list_key, @title, @subtitle, @description, @extra, @icon, @image, @sort_order)
  `);
  for (const key of ['marquee', 'who_for', 'social', 'quiz_options']) {
    for (const item of content.lists[key] || []) insertList.run(item);
  }
});

tx();
console.log('Excel content applied to the Golf Gita database.');
