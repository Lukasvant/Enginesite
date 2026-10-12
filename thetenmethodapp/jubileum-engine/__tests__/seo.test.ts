import sitemap from '@/app/sitemap';
import robots from '@/app/robots';
import { jsonLd, pageMetadata, siteUrl } from '@/app/lib/seo';
const previousEnv = process.env.VERCEL_ENV;
afterEach(() => { if (previousEnv === undefined) delete process.env.VERCEL_ENV; else process.env.VERCEL_ENV = previousEnv; });
test('public sitemap is unique and excludes private previews and demo content', () => {
  process.env.VERCEL_ENV = 'production';
  const urls = sitemap().map(item => item.url);
  expect(new Set(urls).size).toBe(urls.length);
  expect(urls).toHaveLength(32);
  expect(urls).toContain(`${siteUrl}/programmas/employees`);
  expect(urls).toContain(`${siteUrl}/soorten/books`);
  expect(urls.some(url => /\/(preview|demo|login|dashboard)(\/|$)/.test(url))).toBe(false);
});
test('preview deployments cannot publish an indexable sitemap or metadata', () => {
  process.env.VERCEL_ENV = 'preview';
  expect(sitemap()).toEqual([]);
  expect(robots().rules).toEqual({ userAgent: '*', disallow: '/' });
  expect(pageMetadata('/mogelijkheden', 'Mogelijkheden', 'Verkenning').robots).toEqual({ index: false, follow: false });
});
test('JSON-LD escapes closing script tags without altering the data', () => {
  const input = { name: '</script><script>alert(1)</script>' };
  const encoded = jsonLd(input);
  expect(encoded).not.toContain('<');
  expect(JSON.parse(encoded)).toEqual(input);
});
