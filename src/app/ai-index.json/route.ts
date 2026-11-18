import { products } from "@/lib/noirven-data";

// Machine-readable product index for AI search and citation.
// Every field comes from the site's own product data (src/lib/noirven-data.ts);
// no new numbers, prices, or claims are introduced here. Prices are the fixed
// ownership prices in USD already published on each product page and in
// llms.txt. Sold works stay in the index with status "sold" so crawlers can
// tell live from archived without guessing.
export function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nvonly.com";
  const index = {
    site: "Noirven",
    url: baseUrl,
    generated: "2026-11-18",
    description:
      "One-of-one numbered high-jewelry works. Each piece exists once, is never copied or reissued, and is registered to one collector after payment confirmation.",
    products: products.map((product) => ({
      serial: product.serial,
      title: product.title,
      zhTitle: product.zhTitle,
      category: product.category,
      seriesId: product.seriesId,
      materials: product.materials,
      craft: product.craft,
      url: `${baseUrl}/auctions/${product.slug}`,
      urlEn: `${baseUrl}/en/auctions/${product.slug}`,
      status: product.status,
      priceUsd: product.currentPrice,
      startPriceUsd: product.startPrice,
      endsAt: product.endsAt,
      ...(product.soldAt ? { soldAt: product.soldAt } : {}),
      image: `${baseUrl}${product.image}`,
    })),
  };
  return new Response(JSON.stringify(index, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}
