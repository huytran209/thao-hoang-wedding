import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dist = 'dist';
const base = '/thao-hoang-wedding/';
const mime = { jpg:'image/jpeg', jpeg:'image/jpeg', png:'image/png', webp:'image/webp' };
const html = readFileSync(join(dist, 'index.html'), 'utf8')
  .replace(/<link rel="stylesheet" href="\/thao-hoang-wedding\/(_astro\/[\w.-]+\.css)"\s*\/?\s*>/g,
    (_, path) => '<style>' + readFileSync(join(dist, path), 'utf8') + '</style>')
  .replace(/<script type="module" src="\/thao-hoang-wedding\/(_astro\/[\w.-]+\.js)"><\/script>/g,
    (_, path) => '<script type="module">' + readFileSync(join(dist, path), 'utf8').replaceAll('</script', '<\\/script') + '</script>')
  .replace(/(src|srcset)="(\/thao-hoang-wedding\/images\/(?:[\w-]+\/)*[\w.-]+\.(jpg|jpeg|png|webp))"/gi,
    (_, attribute, path, extension) => attribute + '="data:' + mime[extension.toLowerCase()] + ';base64,' +
      readFileSync(join(dist, path.slice(base.length))).toString('base64') + '"')
  .replace(/href="(\/thao-hoang-wedding\/images\/(?:[\w-]+\/)*[\w.-]+\.(jpg|jpeg|png|webp))"/gi,
    (_, path, extension) => 'href="data:' + mime[extension.toLowerCase()] + ';base64,' +
      readFileSync(join(dist, path.slice(base.length))).toString('base64') + '"');
if (/(?:src|srcset|href)="\/thao-hoang-wedding\//.test(html)) {
  throw new Error('Standalone preview still references local server assets');
}
writeFileSync('thao-hoang-preview.html', html);

