import type { MetadataRoute } from "next";
import { jubileeProducts, jubileePrograms, productCategories } from "./lib/jubilee-products";
import { siteUrl } from "./lib/seo";
export default function sitemap(): MetadataRoute.Sitemap {
  if (process.env.VERCEL_ENV === "preview") return [];
  const paths = ["/", "/mogelijkheden", "/programmas", "/samenstellen",
    ...jubileeProducts.map(product => `/mogelijkheden/${product.id}`),
    ...productCategories.map(category => `/soorten/${category.id}`),
    ...jubileePrograms.map(program => `/programmas/${program.id}`)];
  // No fabricated last-modified date; the old live sitemap used build time.
  return paths.map(path => ({ url: `${siteUrl}${path}` }));
}
