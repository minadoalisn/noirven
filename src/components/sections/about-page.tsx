import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { LinkButton } from "@/components/ui/link-button";
import { withLocale } from "@/lib/i18n";
import { organizationId, websiteId } from "@/lib/structured-data";
import type { Locale } from "@/lib/types";

export function AboutPage({ locale = "zh" }: { locale?: Locale }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nvonly.com";
  const pagePath = withLocale(locale, "/about");
  const pageUrl = `${baseUrl}${pagePath}`;

  // Brand definition, verbatim from the brand block already published in
  // /ai-index.json (src/app/ai-index.json/route.ts) and on the homepage:
  // the same wording on the homepage, in the machine index, and here,
  // so no page dilutes the other.
  const brandDefinition =
    locale === "zh"
      ? "Noirven（nvonly.com，诺梵高奢）是一家独一无二的高级珠宝拍卖站。每件作品都有独立编号，只存在一件，永不复制、永不复刻，并归属于一个故事系列。作品以美元固定拥有价挂牌，通过中英双语的七日拍卖页售出；付款确认后，登记在唯一一位藏家名下。已售作品仍保留在档案中，并标注已售状态。"
      : "Noirven (nvonly.com) is a one-of-one high-jewelry auction house. Every work is numbered, exists once, is never copied or reissued, and belongs to a story series. Works are listed with a fixed ownership price in US dollars and sold through a seven-day auction page in Chinese and English. After payment confirmation, each piece is registered to a single collector. Sold works stay visible in the archive with their sold status.";

  // How one-of-one works: each paragraph is a sentence already published
  // in the brand definition above; no new facts.
  const howItWorks =
    locale === "zh"
      ? [
          "每件作品都有独立编号，只存在一件，永不复制、永不复刻，并归属于一个故事系列。",
          "作品以美元固定拥有价挂牌，通过中英双语的七日拍卖页售出。",
          "付款确认后，登记在唯一一位藏家名下。已售作品仍保留在档案中，并标注已售状态。",
        ]
      : [
          "Every work is numbered, exists once, is never copied or reissued, and belongs to a story series.",
          "Works are listed with a fixed ownership price in US dollars and sold through a seven-day auction page in Chinese and English.",
          "After payment confirmation, each piece is registered to a single collector. Sold works stay visible in the archive with their sold status.",
        ];

  // Quotable answers: the same three questions and answers already
  // published on the homepage; no new facts.
  const aboutFaq =
    locale === "zh"
      ? [
          { question: "每件作品如何拍卖？", answer: "每件作品通过中英双语的七日拍卖页售出。" },
          { question: "价格如何确定？", answer: "以宝石级稀缺、匠作时长与唯一编号定价；作品以美元固定拥有价挂牌。" },
          { question: "售出后作品还留档吗？", answer: "已售作品仍保留在档案中，并标注已售状态。" },
        ]
      : [
          { question: "How is each work auctioned?", answer: "Each work is sold through a seven-day auction page in Chinese and English." },
          { question: "How is the price set?", answer: "Pricing follows gem-grade rarity, atelier hours, and one-of-one provenance; works are listed with a fixed ownership price in US dollars." },
          { question: "Do sold works stay in the archive?", answer: "Sold works stay visible in the archive with their sold status." },
        ];

  const aboutJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: locale === "zh" ? "关于 Noirven" : "About Noirven",
    description:
      locale === "zh"
        ? "Noirven（nvonly.com，诺梵高奢）是一家独一无二的高级珠宝拍卖站。每件作品都有独立编号，只存在一件，永不复制、永不复刻，并归属于一个故事系列。作品以美元固定拥有价挂牌，通过中英双语的七日拍卖页售出。"
        : "Noirven is a one-of-one luxury jewelry auction. Every work is numbered, exists once, is never copied or reissued, and belongs to a story series. Works are listed with a fixed ownership price in US dollars and sold through a seven-day auction page in Chinese and English.",
    inLanguage: locale === "zh" ? "zh-CN" : "en",
    isPartOf: { "@id": websiteId },
    mainEntity: { "@id": organizationId },
    about: { "@id": organizationId },
  };

  const aboutFaqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: aboutFaq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <div className="min-h-screen bg-[var(--porcelain)] text-black">
      <SiteHeader locale={locale} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutFaqJsonLd) }} />
      <main>
        <section className="section-shell py-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--ash)]">
            {locale === "zh" ? "Noirven 诺梵高奢" : "Noirven"}
          </p>
          <h1 className="mt-5 max-w-4xl font-serif text-step-5 font-normal leading-tight">
            {locale === "zh" ? "Noirven 是什么" : "What is Noirven"}
          </h1>
          <p className="mt-8 max-w-3xl text-step-1 leading-10 text-[var(--graphite)]">{brandDefinition}</p>
        </section>
        <section className="section-shell border-t border-black/10 py-16">
          <div className="max-w-2xl">
            <h2 className="text-xs uppercase tracking-[0.2em]">{locale === "zh" ? "一件一拍如何运作" : "How one-of-one works"}</h2>
            <div className="mt-5 space-y-6">
              {howItWorks.map((text) => (
                <p key={text} className="text-step-1 leading-8 text-[var(--graphite)]">
                  {text}
                </p>
              ))}
            </div>
          </div>
        </section>
        <section className="section-shell border-t border-black/10 py-16">
          <div className="max-w-2xl">
            <h2 className="text-xs uppercase tracking-[0.2em]">{locale === "zh" ? "常见问题" : "Questions"}</h2>
            <div className="mt-10 space-y-8">
              {aboutFaq.map((item) => (
                <div key={item.question}>
                  <h3 className="font-serif text-step-1">{item.question}</h3>
                  <p className="mt-2 text-step--1 leading-6 text-[var(--graphite)]">{item.answer}</p>
                </div>
              ))}
            </div>
            <div className="mt-12 flex flex-wrap gap-4">
              <LinkButton href={withLocale(locale, "/auctions")}>{locale === "zh" ? "查看顶奢作品" : "Shop Ultra-Luxury"}</LinkButton>
              <LinkButton href={withLocale(locale, "/story")} variant="outline">
                {locale === "zh" ? "品牌故事" : "Story"}
              </LinkButton>
              <LinkButton href={withLocale(locale, "/sold")} variant="outline">
                {locale === "zh" ? "查看已售档案" : "View Archive"}
              </LinkButton>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
