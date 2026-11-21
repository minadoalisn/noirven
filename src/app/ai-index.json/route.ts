import { products } from "@/lib/noirven-data";

// Machine-readable product index for AI search and citation.
// Every field comes from the site's own product data (src/lib/noirven-data.ts);
// no new numbers, prices, or claims are introduced here. Prices are the fixed
// ownership prices in USD already published on each product page and in
// llms.txt. Sold works stay in the index with status "sold" so crawlers can
// tell live from archived without guessing.
// The brand block below reuses the brand definition already published in the
// homepage Organization JSON-LD; it adds no new facts. The about links point
// at the /about entity page added 2026-11-21.
export function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nvonly.com";
  const index = {
    site: "Noirven",
    url: baseUrl,
    generated: "2026-11-21",
    description:
      "One-of-one numbered high-jewelry works. Each piece exists once, is never copied or reissued, and is registered to one collector after payment confirmation.",
    brand: {
      name: "Noirven",
      alternateName: "Noirven 诺梵高奢",
      url: baseUrl,
      about: `${baseUrl}/about`,
      aboutEn: `${baseUrl}/en/about`,
      definitionEn:
        "Noirven (nvonly.com) is a one-of-one high-jewelry auction house. Every work is numbered, exists once, is never copied or reissued, and belongs to a story series. Works are listed with a fixed ownership price in US dollars and sold through a seven-day auction page in Chinese and English. After payment confirmation, each piece is registered to a single collector. Sold works stay visible in the archive with their sold status.",
      definitionZh:
        "Noirven（nvonly.com，诺梵高奢）是一家独一无二的高级珠宝拍卖站。每件作品都有独立编号，只存在一件，永不复制、永不复刻，并归属于一个故事系列。作品以美元固定拥有价挂牌，通过中英双语的七日拍卖页售出；付款确认后，登记在唯一一位藏家名下。已售作品仍保留在档案中，并标注已售状态。",
    },
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
