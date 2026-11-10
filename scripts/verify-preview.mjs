import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, cpSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';
import { execFileSync, spawn } from 'node:child_process';
import { chromium } from 'playwright';

const production = readFileSync('dist/index.html', 'utf8');
assert(!production.includes('id="thuc-don"'));
assert(!production.includes('Lời chia sẻ của khách hàng'));
assert(production.includes('noindex, nofollow'));

const root = mkdtempSync(join(tmpdir(), 'thao-preview-'));
let browser;
let server;
try {
  for (const file of ['src', 'public', 'astro.config.mjs', 'package.json', 'tsconfig.json']) cpSync(file, join(root, file), { recursive: true });
  const fs = await import('node:fs');
  fs.symlinkSync(join(process.cwd(), 'node_modules'), join(root, 'node_modules'), 'junction');
  const image = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/lXcAAAAASUVORK5CYII=', 'base64');
  const fixtures = [
    {title:'Ảnh sau',category:'Tiệc cưới',order:30,visible:true,image:'/images/qa-b.png'},
    {title:'Ảnh trước',category:'Đám hỏi',order:10,visible:true,image:'/images/qa-a.png'},
    {title:'Ảnh ẩn',category:'Đám hỏi',order:0,visible:false,image:'/images/qa-a.png'},
    {title:'Ảnh thiếu',category:'Đám hỏi',order:20,visible:true,image:'/images/qa-missing.png'},
  ];
  mkdirSync(join(root,'src/data/gallery'),{recursive:true});
  for (const [i, item] of fixtures.entries()) writeFileSync(join(root,'src/data/gallery',i+'.json'),JSON.stringify({...item,alt:item.title}));
  for (const path of ['qa-a.png','qa-b.png']) writeFileSync(join(root,'public/images',path),image);
  const heroPath = join(root,'src/data/hero.json');
  const hero = JSON.parse(readFileSync(heroPath,'utf8'));
  writeFileSync(heroPath, JSON.stringify({...hero,desktopImage:'/images/qa-b.png',mobileImage:'/images/qa-a.png',imageAlt:'Ảnh thử Hero'}));
  const astro = join(process.cwd(), 'node_modules/.bin/astro');
  execFileSync(astro,['build'],{cwd:root,stdio:'inherit'});
  server = spawn(astro,['preview','--host','127.0.0.1','--port','4329'],{cwd:root,stdio:'inherit'});
  const url = 'http://127.0.0.1:4329/thao-hoang-wedding/';
  for (let attempt=0; ; attempt++) {
    try { if ((await fetch(url)).ok) break; } catch {}
    if(attempt===39) throw new Error('Preview server did not start');
    await new Promise(resolve=>setTimeout(resolve,250));
  }
  browser = await chromium.launch();
  const page = await browser.newPage({ reducedMotion:'reduce' });
  await page.goto(pathToFileURL(resolve('thao-hoang-preview.html')).href);
  const configured = JSON.parse(readFileSync('src/data/settings.json','utf8'));
  if (configured.logo) {
    assert(await page.locator('.brand img').evaluate(img => img.complete && img.naturalWidth > 0 && img.src.startsWith('data:image/')));
  }
  assert.equal(await page.locator('body').evaluate(node => getComputedStyle(node).marginTop),'0px');
  await page.setViewportSize({width:390,height:900});
  await page.getByText('Danh mục',{exact:true}).click();
  await page.getByRole('navigation',{name:'Điều hướng điện thoại'}).getByRole('link',{name:'Dịch vụ'}).click();
  await page.waitForFunction(() => !document.querySelector('.mobile-nav')?.open);
  console.log('Standalone file preview PASS');
  await page.route('https://fonts.googleapis.com/**', route=>route.abort());
  for (const width of [360,390,768,1024,1440]) {
    await page.setViewportSize({ width,height:900 });
    await page.goto(url);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth), 'Overflow at '+width);
    assert.equal(await page.locator('.mobile-nav').isVisible(), width<960);
    assert.equal(await page.locator('.desktop-nav').isVisible(), width>=960);
    const selected = await page.locator('.hero-art img').evaluate(img=>img.currentSrc);
    assert(selected.endsWith(width<=700?'qa-a.png':'qa-b.png'));
    console.log('Responsive PASS '+width+'px');
  }
  await page.keyboard.press('Tab');
  assert(await page.locator('.skip').evaluate(link=>document.activeElement===link));
  assert.equal(await page.locator('html').evaluate(node=>getComputedStyle(node).scrollBehavior),'auto');
  assert.equal(await page.locator('#dich-vu article').count(),8);
  assert.equal(await page.locator('.floating a').first().getAttribute('href'),'tel:0975380083');
  assert.equal(await page.locator('.floating a').last().getAttribute('href'),'https://zalo.me/0975380083');
  assert.equal(await page.getByRole('link',{name:/Google Maps/}).getAttribute('href'),'https://maps.app.goo.gl/HCTpW4cV6E8zNieh7');
  assert.deepEqual(await page.locator('.gallery figure a').evaluateAll(links=>links.map(link=>link.getAttribute('data-caption'))), ['Ảnh trước','Ảnh sau']);
  const first=page.getByRole('link',{name:'Xem ảnh: Ảnh trước'});
  await first.focus();
  await page.keyboard.press('Enter');
  const caption=page.locator('[data-caption-live]');
  await page.waitForFunction(()=>document.querySelector('[data-caption-live]')?.textContent==='Ảnh trước');
  await page.keyboard.press('ArrowRight');
  assert.equal(await caption.textContent(),'Ảnh sau');
  await page.keyboard.press('Escape');
  assert(!(await page.locator('dialog').isVisible()));
  assert(await first.evaluate(link=>document.activeElement===link));
  await page.getByRole('button',{name:'Tiệc cưới',exact:true}).click();
  assert.equal(await page.locator('.gallery figure:visible').count(),1);
  await page.setViewportSize({width:390,height:900});
  await page.getByText('Danh mục',{exact:true}).click();
  await page.getByRole('navigation',{name:'Điều hướng điện thoại'}).getByRole('link',{name:'Dịch vụ'}).click();
  assert(!(await page.locator('.mobile-nav').evaluate(menu=>menu.open)));
  await page.route('**/qa-b.png',route=>route.abort());
  await page.setViewportSize({width:1024,height:900});
  await page.reload();
  await page.waitForFunction(()=>document.querySelector('.hero-art img')?.hidden);
  assert(await page.locator('.placeholder').isVisible());
  console.log('Keyboard, lightbox, filters, ordering, visibility, links, image fallback and reduced motion PASS');
} finally {
  await browser?.close();
  if (server) { server.kill(); await new Promise(resolve=>server.once('exit',resolve)); }
  rmSync(root,{recursive:true,force:true});
}

