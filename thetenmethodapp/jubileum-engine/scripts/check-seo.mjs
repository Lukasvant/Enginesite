// Read-only regression check against a running production build; never posts or queries the DB.
import assert from 'node:assert/strict';
const origin = process.argv[2] || 'http://localhost:3004';
const canonicalOrigin = 'https://www.jubileumengine.nl';
async function get(path) {
  const response = await fetch(new URL(path, origin), { redirect: 'manual' });
  return { response, html: await response.text() };
}
const sitemap = await get('/sitemap.xml');
assert.equal(sitemap.response.status, 200);
const urls = [...sitemap.html.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
assert.equal(urls.length, 32);
assert.equal(new Set(urls).size, urls.length);
const titles = new Set();
for (const url of urls) {
  assert.ok(url.startsWith(canonicalOrigin + '/'));
  const path = new URL(url).pathname;
  assert.ok(!/\/(preview|demo|login|dashboard)(\/|$)/.test(path));
  const { response, html } = await get(path);
  assert.equal(response.status, 200, path);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `${path}: H1`);
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  assert.ok(title && !titles.has(title), `${path}: unique title`);
  assert.ok(!title.includes('Jubileum Engine | Jubileum Engine'), `${path}: repeated brand`);
  titles.add(title);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  assert.equal(new URL(canonical).href, new URL(url).href, `${path}: canonical`);
  assert.match(html, /<meta name="description" content="[^"]+"/);
  assert.ok(!/noindex/.test(response.headers.get('x-robots-tag') || ''));
  for (const match of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) {
    const data = JSON.parse(match[1]);
    assert.equal(data['@context'], 'https://schema.org');
    assert.ok(!('aggregateRating' in data || 'review' in data || 'offers' in data));
  }
}
for (const path of ['/soorten/not-a-category', '/programmas/not-a-program', '/mogelijkheden/not-a-product', '/soorten']) {
  assert.equal((await get(path)).response.status, 404, path);
}
for (const path of ['/demo', '/design-review', '/login']) {
  const { response, html } = await get(path);
  assert.equal(response.status, 200, path);
  assert.match(response.headers.get('x-robots-tag') || '', /noindex/);
  if (path !== '/login') assert.match(html, /name="robots" content="noindex, nofollow"/);
}
const robots = await get('/robots.txt');
assert.equal(robots.response.status, 200);
assert.ok(robots.html.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`));
for (const path of ['/preview/', '/demo', '/login', '/dashboard']) assert.ok(robots.html.includes(`Disallow: ${path}`));
console.log('SEO regression passed: 32 public pages, canonicals, H1, metadata, JSON-LD, sitemap, robots, private noindex and unknown-route 404s.');
