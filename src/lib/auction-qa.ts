import { formatCurrency } from "@/lib/format";
import {
  localizedProductEngraving,
  localizedProductSizing,
  localizedProductTitle,
  localizedTerms,
} from "@/lib/localized-content";
import type { Locale, Product } from "@/lib/types";

export type QaPair = { question: string; answer: string };

/**
 * Quotable Q&A pairs for product and auction pages (GEO, 2026-11-26).
 * Every sentence is verbatim copy already on the live site
 * (product-detail.tsx process steps / belonging rule, auction-page.tsx
 * intro, localized-content.ts field translations) or is assembled only
 * from the product's own fields (serial, materials, craft, sizing,
 * engraving, pricing basis, current price). No new facts, no dates,
 * no invented material / certificate / price claims. Sold products get
 * the sold-state answer instead of the buy flow.
 */
export function productQaPairs(product: Product, locale: Locale = "zh"): QaPair[] {
  const title = localizedProductTitle(product, locale);
  const materials = localizedTerms(product.materials, locale).join(" / ");
  const craft = localizedTerms(product.craft, locale).join(" / ");
  const sizing = localizedProductSizing(product, locale);
  const engraving = localizedProductEngraving(product, locale);
  const price = formatCurrency(product.currentPrice);

  if (locale === "en") {
    const buy: QaPair = product.status === "sold"
      ? {
          question: `Has ${product.serial} already found its owner?`,
          answer: product.ownerNickname
            ? `This work has completed ownership registration for ${product.ownerNickname}. Materials, story, and engraving remain visible.`
            : `This work has completed ownership registration. Materials, story, and engraving remain visible.`,
        }
      : {
          question: `How do I buy ${product.serial}?`,
          answer: `Works are listed with a fixed ownership price in US dollars; the ultra-luxury fixed price of ${title} ${product.serial} is ${price}. Sign in or create an account to submit a USDT payment proof on BNB Smart Chain / BEP-20 USDT. After USDT receipt is manually confirmed, ownership and delivery are registered, and the work is registered to one owner only and is never reproduced.`,
        };
    return [
      {
        question: `Is ${product.serial} one of a kind?`,
        answer: `Yes. Every work is numbered, exists once, is never copied or reissued. ${engraving}`,
      },
      {
        question: `What materials and craft does ${title} use?`,
        answer: `Materials: ${materials}. Craft: ${craft}. ${sizing}`,
      },
      buy,
    ];
  }

  const buy: QaPair = product.status === "sold"
    ? {
        question: `${product.serial} 已经归属了吗？`,
        answer: product.ownerNickname
          ? `此件已完成归属登记，拥有者：${product.ownerNickname}。仍可浏览材质、故事与唯一刻印档案。`
          : `此件已完成归属登记。仍可浏览材质、故事与唯一刻印档案。`,
      }
    : {
        question: `怎么购买 ${product.serial}？`,
        answer: `作品以美元固定拥有价挂牌，${title} ${product.serial} 的顶奢定价为 ${price}。登录或注册后提交 USDT 付款凭证，收款网络为 BNB Smart Chain / BEP-20 USDT；后台人工确认到账后登记拥有者并安排发货，作品只登记给一位主人，不复制、不复刻。`,
      };
  return [
    {
      question: `${product.serial} 是独一无二的吗？`,
      answer: `是。每件作品都有独立编号，只存在一件，永不复制、永不复刻。${engraving}`,
    },
    {
      question: `${title} 用什么材质、什么工艺？`,
      answer: `材质为 ${materials}；工艺为 ${craft}。${sizing}`,
    },
    buy,
  ];
}

/**
 * Site-level Q&A for the seven-day auction list page. Sentences are
 * verbatim from the auctions intro and the product page process steps.
 */
export function auctionListQaPairs(locale: Locale = "zh"): QaPair[] {
  if (locale === "en") {
    return [
      {
        question: "How does the seven-day auction page work?",
        answer:
          "Each work is sold through a seven-day auction page in Chinese and English. New pieces appear first and paginate after a full page. Filter by storyline; each story chapter maps to one product, one jewel, and one serial.",
      },
      {
        question: "How are works priced?",
        answer:
          "Pricing follows gem-grade rarity, atelier hours, and one-of-one provenance; works are listed with a fixed ownership price in US dollars.",
      },
      {
        question: "What happens after payment?",
        answer:
          "After USDT receipt is confirmed, ownership and delivery are registered. The work is registered to one owner only and is never reproduced.",
      },
    ];
  }
  return [
    {
      question: "七日拍卖页怎么运作？",
      answer:
        "每件作品通过中英双语的七日拍卖页售出。新品按编号优先展示，满页后进入下一页，也可以按故事线筛选；每个故事章节对应一个产品、一件饰品、一个编号。",
    },
    {
      question: "作品如何定价？",
      answer:
        "以宝石级稀缺、匠作时长与唯一编号定价；作品以美元固定拥有价挂牌。",
    },
    {
      question: "付款后会发生什么？",
      answer:
        "USDT 到账确认后登记拥有者并安排发货。作品只登记给一位主人，不复制、不复刻。",
    },
  ];
}
