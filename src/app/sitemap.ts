import type { MetadataRoute } from "next";
import { products } from "@/lib/noirven-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nvonly.com";
  const staticLastModified = new Date("2026-07-09T00:00:00+08:00");
  const staticRoutes = ["", "/auctions", "/custom", "/series", "/story", "/sold", "/guides/private-high-jewelry-buying"];
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
      { url: canonical, alternates, lastModified: staticLastModified, priority, changeFrequency },
      { url: english, alternates, lastModified: staticLastModified, priority, changeFrequency },
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

  return [...localized, ...productRoutes];
}
