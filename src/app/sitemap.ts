import type { MetadataRoute } from "next";
import { products } from "@/lib/noirven-data";
import { listedAtBySlug } from "@/lib/listing-dates";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nvonly.com";
  const staticLastModified = new Date("2026-07-30T00:00:00+08:00");
  // Rendered pages last changed 2026-11-18 (product card title h3 -> h2,
  // fixing skipped heading level on listing pages; WebSite JSON-LD
  // dateModified + footer visible date updated). Before that 2026-11-17
  // (WebSite JSON-LD gained author attribution; footer visible date updated).
  // Before that 2026-11-16 (site footer gained a visible update date; feed.xml
  // route added). Before that 2026-11-14 (root layout: footer Our Story link
  // 1cae1e33; global typography + product cards 18dea74b; home lists N-0534/N-0535
  // since 1b80eaa; product pages gained the gallery 953cccf0).
  // AI briefs llms.txt / llms-full.txt were refreshed 2026-11-14 (commits 1b80eaa, 1cae1e33);
  // pricing.md unchanged since 2026-11-09, so it keeps its own date.
  // ai-monitoring-prompts.md and okf/noirven.md are unchanged since 2026-07-30, so they keep staticLastModified.
  // ai-index.json added 2026-11-18 (machine-readable product index, built from
  // src/lib/noirven-data.ts at request time), so it keeps its own date.
  const pageLastModified = new Date("2026-11-18T00:00:00+08:00");
  const feedLastModified = new Date("2026-11-16T00:00:00+08:00");
  const llmsLastModified = new Date("2026-11-14T00:00:00+08:00");
  const pricingLastModified = new Date("2026-11-09T00:00:00+08:00");
  const aiIndexLastModified = new Date("2026-11-18T00:00:00+08:00");
  const aiBriefRoutes = ["/llms.txt", "/llms-full.txt", "/pricing.md"];
  const llmsRoutes = ["/llms.txt", "/llms-full.txt"];
  const staticRoutes = ["", "/auctions", "/custom", "/series", "/story", "/sold", "/guides/private-high-jewelry-buying"];
  const machineLastModified = (path: string): Date =>
    llmsRoutes.includes(path)
      ? llmsLastModified
      : path === "/pricing.md"
        ? pricingLastModified
        : path === "/ai-index.json"
          ? aiIndexLastModified
          : staticLastModified;
  const machineReadableRoutes: MetadataRoute.Sitemap = [
    ...aiBriefRoutes,
    "/ai-index.json",
    "/ai-monitoring-prompts.md",
    "/okf/noirven.md",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: machineLastModified(path),
    changeFrequency: "weekly" as const,
    priority: 0.55,
  }));

  const localized: MetadataRoute.Sitemap = staticRoutes.flatMap((path) => {
    const canonical = `${baseUrl}${path || "/"}`;
    const english = `${baseUrl}/en${path}`;
    const alternates = {
      languages: {
        "zh-CN": canonical,
        en: english,
        "x-default": canonical,
      },
    } as const;

    const priority = path === "" ? 1 : 0.7;
    const changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = path === "" ? "daily" : "weekly";

    return [
      { url: canonical, alternates, lastModified: pageLastModified, priority, changeFrequency },
      { url: english, alternates, lastModified: pageLastModified, priority, changeFrequency },
    ];
  });

  // Products whose endsAt falls back to seedAuctionEndsAt[0] (2026-08-07) have no real
  // auction end date in the seed array; use their verified listing date instead.
  // The map lives in src/lib/listing-dates.ts, shared with feed.ts (pubDate),
  // so sitemap lastmod and feed pubDate stay consistent.

  const productRoutes: MetadataRoute.Sitemap = products.flatMap((product) => {
    const canonical = `${baseUrl}/auctions/${product.slug}`;
    const english = `${baseUrl}/en/auctions/${product.slug}`;
    const alternates = {
      languages: {
        "zh-CN": canonical,
        en: english,
        "x-default": canonical,
      },
    } as const;

    const lastModified = new Date(product.soldAt ?? listedAtBySlug[product.slug] ?? product.endsAt);

    return [
      { url: canonical, alternates, lastModified, changeFrequency: "daily" as const, priority: 0.8 },
      { url: english, alternates, lastModified, changeFrequency: "daily" as const, priority: 0.8 },
    ];
  });

  return [
    ...localized,
    ...productRoutes,
    ...machineReadableRoutes,
    {
      url: `${baseUrl}/feed.xml`,
      lastModified: feedLastModified,
      changeFrequency: "daily" as const,
      priority: 0.6,
    },
  ];
}
