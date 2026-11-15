import { liveProducts } from "@/lib/noirven-data";
import { listedAtBySlug } from "@/lib/listing-dates";
import { formatCurrency } from "@/lib/format";
import type { Product } from "@/lib/types";

// RSS 2.0 feed of the works shown on the homepage: the six newest live
// products, newest first — the same list and order as home-page.tsx
// (newestLiveProducts().slice(0, 6)). All facts come from the product seeds;
// pubDate uses the verified first-listing date, never the auction end date.
const FEED_UPDATED = new Date("2026-11-16T00:00:00+08:00");

function serialNumber(serial: string) {
  return Number(serial.replace(/\D/g, "")) || 0;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function productPubDate(product: Product): Date {
  return listedAtBySlug[product.slug] ?? new Date(product.endsAt);
}

export function buildFeedXml(products: Product[], baseUrl: string): string {
  const items = [...products]
    .sort((a, b) => serialNumber(b.serial) - serialNumber(a.serial))
    .slice(0, 6);
  const itemXml = items
    .map((product) => {
      const url = `${baseUrl}/auctions/${product.slug}`;
      const description =
        `${product.concept} 材质：${product.materials.join(" / ")}。` +
        `工艺：${product.craft.join(" / ")}。当前价格 ${formatCurrency(product.currentPrice)}（USDT）。`;
      return [
        "    <item>",
        `      <title>${escapeXml(`${product.serial} ${product.zhTitle}`)}</title>`,
        `      <link>${escapeXml(url)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
        `      <pubDate>${productPubDate(product).toUTCString()}</pubDate>`,
        `      <description>${escapeXml(description)}</description>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    "  <channel>",
    "    <title>Noirven 诺梵高奢</title>",
    `    <link>${escapeXml(baseUrl)}</link>`,
    "    <description>每一次归属，都是一次拯救。Noirven 诺梵高奢只发布举世无双的编号顶级奢侈品级作品：每件仅此一件，不复制、不复刻、不再生产，付款确认后只归一位主人。</description>",
    "    <language>zh-CN</language>",
    `    <lastBuildDate>${FEED_UPDATED.toUTCString()}</lastBuildDate>`,
    itemXml,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");
}

export function buildSiteFeedXml(baseUrl: string): string {
  return buildFeedXml(liveProducts, baseUrl);
}
