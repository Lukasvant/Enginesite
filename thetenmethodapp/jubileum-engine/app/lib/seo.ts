import type { Metadata } from "next";

// Verified live canonical host on 11 October 2026; no hosting/DNS change.
export const siteUrl = "https://www.jubileumengine.nl";
export const privatePaths = ["/login", "/dashboard", "/companies", "/leads", "/previews", "/products", "/setup", "/preview/", "/demo", "/design-preview", "/design-review", "/api/"];
export function pageMetadata(path: string, title: string, description: string): Metadata {
  const url = `${siteUrl}${path}`;
  const index = process.env.VERCEL_ENV !== "preview";
  return {
    title: { absolute: title.includes("Jubileum Engine") ? title : `${title} | Jubileum Engine` },
    description,
    alternates: { canonical: url },
    robots: { index, follow: index },
    openGraph: { title, description, url, siteName: "Jubileum Engine", locale: "nl_NL", type: "website" },
    twitter: { card: "summary", title, description },
  };
}
export function breadcrumbs(items: { name: string; path: string }[]) {
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: `${siteUrl}${item.path}` })) };
}
export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
