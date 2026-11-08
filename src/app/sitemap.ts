import type { MetadataRoute } from "next";
import { products } from "@/lib/noirven-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nvonly.com";
  const staticLastModified = new Date("2026-07-30T00:00:00+08:00");
  // Rendered pages last changed 2026-11-04 (root layout: GEOInflow tracker 11-03 + Speed Insights 11-04);
  // machine-readable files below are unchanged since 2026-07-30, so they keep staticLastModified.
  const pageLastModified = new Date("2026-11-04T00:00:00+08:00");
  const staticRoutes = ["", "/auctions", "/custom", "/series", "/story", "/sold", "/guides/private-high-jewelry-buying"];
  const machineReadableRoutes: MetadataRoute.Sitemap = [
    "/llms.txt",
    "/llms-full.txt",
    "/pricing.md",
    "/ai-monitoring-prompts.md",
    "/okf/noirven.md",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: staticLastModified,
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

    const lastModified = new Date(product.soldAt ?? product.endsAt);

    return [
      { url: canonical, alternates, lastModified, changeFrequency: "daily" as const, priority: 0.8 },
      { url: english, alternates, lastModified, changeFrequency: "daily" as const, priority: 0.8 },
    ];
  });

  return [...localized, ...productRoutes, ...machineReadableRoutes];
}
