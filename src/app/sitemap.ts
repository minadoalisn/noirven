import type { MetadataRoute } from "next";
import { products } from "@/lib/noirven-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nvonly.com";
  const staticLastModified = new Date("2026-07-30T00:00:00+08:00");
  // Rendered pages last changed 2026-11-14 (root layout: footer Our Story link 1cae1e33;
  // global typography + product cards 18dea74b; home lists N-0534/N-0535 since 1b80eaa;
  // product pages gained the gallery 953cccf0).
  // AI briefs llms.txt / llms-full.txt were refreshed 2026-11-14 (commits 1b80eaa, 1cae1e33);
  // pricing.md unchanged since 2026-11-09, so it keeps its own date.
  // ai-monitoring-prompts.md and okf/noirven.md are unchanged since 2026-07-30, so they keep staticLastModified.
  const pageLastModified = new Date("2026-11-14T00:00:00+08:00");
  const llmsLastModified = new Date("2026-11-14T00:00:00+08:00");
  const pricingLastModified = new Date("2026-11-09T00:00:00+08:00");
  const aiBriefRoutes = ["/llms.txt", "/llms-full.txt", "/pricing.md"];
  const llmsRoutes = ["/llms.txt", "/llms-full.txt"];
  const staticRoutes = ["", "/auctions", "/custom", "/series", "/story", "/sold", "/guides/private-high-jewelry-buying"];
  const machineLastModified = (path: string): Date =>
    llmsRoutes.includes(path)
      ? llmsLastModified
      : path === "/pricing.md"
        ? pricingLastModified
        : staticLastModified;
  const machineReadableRoutes: MetadataRoute.Sitemap = [
    ...aiBriefRoutes,
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
  // Seeds added 2026-05-20 (commit e77757e4): N-0508–N-0512.
  // N-0519 added 2026-05-21 (commit f7dc8b52); N-0533 added 2026-07-30 (commit 5c3299e4);
  // N-0534/N-0535 listed 2026-11-14 (commit 1b80eaa).
  const listedAtBySlug: Record<string, Date> = {
    "seventh-light-n-0508": new Date("2026-05-20T22:36:13+08:00"),
    "tide-return-n-0509": new Date("2026-05-20T22:36:13+08:00"),
    "tender-armor-n-0510": new Date("2026-05-20T22:36:13+08:00"),
    "moon-archive-n-0511": new Date("2026-05-20T22:36:13+08:00"),
    "ash-garden-n-0512": new Date("2026-05-20T22:36:13+08:00"),
    "ash-garden-n-0519": new Date("2026-05-21T22:16:49+08:00"),
    "still-here-n-0533": new Date("2026-07-30T21:35:16+08:00"),
    "swan-light-n-0534": new Date("2026-11-14T22:09:10+08:00"),
    "tide-return-n-0535": new Date("2026-11-14T22:09:10+08:00"),
  };

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

  return [...localized, ...productRoutes, ...machineReadableRoutes];
}
