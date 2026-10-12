import type { MetadataRoute } from "next";
import { privatePaths, siteUrl } from "./lib/seo";
export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV === "preview") return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/", disallow: privatePaths }, sitemap: `${siteUrl}/sitemap.xml` };
}
