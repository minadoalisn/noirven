import Image from "next/image";
import Link from "next/link";
import { type CSSProperties, type ReactNode } from "react";
import { ArrowRight, Archive, Gem, Menu, ShieldCheck } from "lucide-react";
import { SiteFooter } from "@/components/layout/site-footer";
import { LinkButton } from "@/components/ui/link-button";
import { Reveal } from "@/components/ui/reveal";
import { ProductCard } from "@/components/sections/product-card";
import { SeriesGrid } from "@/components/sections/series-grid";
import { homeCopy, navCopy, withLocale } from "@/lib/i18n";
import { liveProducts, materialNarratives, soldProducts, storySeries } from "@/lib/noirven-data";
import {
  localizedMaterialNarrativeStory,
  localizedProductTitle,
  localizedSeries,
  localizedTerms,
} from "@/lib/localized-content";
import { formatCurrency } from "@/lib/format";
import type { Locale } from "@/lib/types";

function serialNumber(serial: string) {
  return Number(serial.replace(/\D/g, "")) || 0;
}

function newestLiveProducts() {
  return [...liveProducts].sort((a, b) => serialNumber(b.serial) - serialNumber(a.serial));
}

function NavRollLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href}>
      <span className="nav-roll">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
    </Link>
  );
}

function HeroNav({ locale }: { locale: Locale }) {
  const copy = navCopy[locale];

  return (
    <header className="section-shell flex min-h-16 items-center justify-between gap-4 py-4">
      <nav className="hidden items-center gap-7 text-[11px] uppercase tracking-[0.22em] text-[var(--graphite)] md:flex">
        <NavRollLink href={withLocale(locale, "/")}>{locale === "zh" ? "首页" : "Home"}</NavRollLink>
        <NavRollLink href={withLocale(locale, "/custom")}>{copy.custom}</NavRollLink>
        <NavRollLink href={withLocale(locale, "/series")}>{copy.series}</NavRollLink>
        <NavRollLink href={withLocale(locale, "/story")}>{copy.story}</NavRollLink>
        <NavRollLink href={withLocale(locale, "/auctions")}>{copy.auctions}</NavRollLink>
      </nav>
      <Link href={withLocale(locale, "/")} className="absolute left-1/2 top-4 -translate-x-1/2 text-center">
        <span className="brand-wordmark block text-[18px] leading-none">NOIRVEN</span>
        <span className="brand-cn mt-2 block text-[12px]">诺梵</span>
      </Link>
      <div className="ml-auto flex items-center gap-5 text-[11px] uppercase tracking-[0.22em] text-[var(--graphite)]">
        <Link href={withLocale(locale, "/account")}>{locale === "zh" ? "登录" : "Login"}</Link>
        <Link href={locale === "zh" ? "/en" : "/"}>{locale === "zh" ? "中英" : "ZH"}</Link>
        <Menu size={18} />
      </div>
    </header>
  );
}

function HeroSaleStrip({ locale }: { locale: Locale }) {
  const featured = newestLiveProducts()[0];
  const title = localizedProductTitle(featured, locale);

  return (
    <section className="section-shell pb-8">
      <div className="grid items-center border border-black/12 bg-[rgba(251,250,246,0.72)] md:grid-cols-[0.95fr_1.2fr_0.75fr_0.5fr]">
        <div className="border-b border-black/10 p-5 md:border-b-0 md:border-r">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--ash)]">
            {locale === "zh" ? "最新上线顶奢作品" : "Latest Ultra-Luxury Work"} · {featured.serial}
          </p>
          <p className="mt-2 text-step--1 text-black">{title}</p>
        </div>
        <div className="border-b border-black/10 p-5 md:border-b-0 md:border-r">
          <p className="font-mono text-2xl text-black">{formatCurrency(featured.currentPrice)}</p>
          <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-[var(--ash)]">Fixed Ownership Price / USDT</p>
        </div>
        <div className="relative hidden h-28 md:block">
          <Image
            src={featured.image}
            alt={`${featured.serial} ${title}`}
            fill
            sizes="220px"
            className="object-contain"
            priority
          />
        </div>
        <Link
          href={withLocale(locale, `/auctions/${featured.slug}`)}
          className="focus-ring flex h-full min-h-20 items-center justify-center gap-2 p-5 text-step--1 transition hover:bg-black hover:text-white"
        >
          {locale === "zh" ? "查看并购买" : "View Work"} <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  );
}

function MobileHeroSale({ locale }: { locale: Locale }) {
  const featured = newestLiveProducts()[0];
  const title = localizedProductTitle(featured, locale);

  return (
    <div className="mx-auto mt-8 max-w-sm border border-black/12 p-4 md:hidden">
      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--ash)]">
        {locale === "zh" ? "最新上线顶奢作品" : "Latest Ultra-Luxury Work"} · {featured.serial}
      </p>
      <p className="mt-2 font-mono text-2xl">{formatCurrency(featured.currentPrice)}</p>
      <p className="mb-4 mt-2 text-step--1 leading-6 text-[var(--graphite)]">{title}</p>
      <LinkButton href={withLocale(locale, "/auctions")}>{locale === "zh" ? "查看顶奢作品" : "Shop Ultra-Luxury"}</LinkButton>
      <div className="mt-3">
        <LinkButton href={withLocale(locale, "/story")} variant="outline">
          {locale === "zh" ? "品牌故事" : "Story"}
        </LinkButton>
      </div>
    </div>
  );
}

export function HomePage({ locale = "zh" }: { locale?: Locale }) {
  const copy = homeCopy[locale];
  const live = newestLiveProducts().slice(0, 6);
  const featured = live[0];
  const featuredTitle = localizedProductTitle(featured, locale);
  const sold = soldProducts.slice(0, 2);
  // Machine-readable list of the same 6 live works already rendered below
  // with ProductCard: same data source, same prices, no new claims. Lets
  // crawlers and AI search read the live lots from the homepage itself,
  // where geo-optimizer actually scores, instead of only from /ai-index.json.
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nvonly.com";
  const homeItemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: locale === "zh" ? "在售顶奢作品" : "Available ultra-luxury works",
    itemListElement: live.map((product, index) => {
      const productPath = withLocale(locale, `/auctions/${product.slug}`);
      const productTitle = localizedProductTitle(product, locale);
      return {
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: `${productTitle} ${product.serial}`,
          url: `${baseUrl}${productPath}`,
          image: product.image.startsWith("/") ? `${baseUrl}${product.image}` : product.image,
          offers: {
            "@type": "Offer",
            url: `${baseUrl}${productPath}`,
            priceCurrency: "USD",
            price: String(product.currentPrice),
            availability: "https://schema.org/InStock",
            itemCondition: "https://schema.org/NewCondition",
          },
        },
      };
    }),
  };

  // Brand definition, verbatim from the brand block already published in
  // /ai-index.json (src/app/ai-index.json/route.ts): the same wording on the
  // homepage and in the machine index, so neither dilutes the other.
  const brandDefinition =
    locale === "zh"
      ? "Noirven（nvonly.com，诺梵高奢）是一家独一无二的高级珠宝拍卖站。每件作品都有独立编号，只存在一件，永不复制、永不复刻，并归属于一个故事系列。作品以美元固定拥有价挂牌，通过中英双语的七日拍卖页售出；付款确认后，登记在唯一一位藏家名下。已售作品仍保留在档案中，并标注已售状态。"
      : "Noirven (nvonly.com) is a one-of-one high-jewelry auction house. Every work is numbered, exists once, is never copied or reissued, and belongs to a story series. Works are listed with a fixed ownership price in US dollars and sold through a seven-day auction page in Chinese and English. After payment confirmation, each piece is registered to a single collector. Sold works stay visible in the archive with their sold status.";
  // Quotable answers: every answer is a sentence already published on this
  // site (the brand definition or the homepage pricing band); no new facts.
  const homeFaq =
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
  const homeFaqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: homeFaq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  // Hero slogan, verbatim wording, word-by-word fade-in (<= 0.8s total).
  const heroWords: { text: string; line: 0 | 1; gold: boolean }[] =
    locale === "zh"
      ? [
          { text: "每一次归属，", line: 0, gold: false },
          { text: "都是一次", line: 1, gold: false },
          { text: "拯救", line: 1, gold: true },
        ]
      : [
          { text: "Every", line: 0, gold: false },
          { text: "belonging", line: 0, gold: false },
          { text: "is", line: 1, gold: false },
          { text: "a", line: 1, gold: false },
          { text: "quiet", line: 1, gold: false },
          { text: "rescue", line: 1, gold: true },
        ];
  let heroWordIndex = 0;

  return (
    <div className="min-h-screen bg-[var(--porcelain)] text-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeItemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqJsonLd) }} />
      <HeroNav locale={locale} />
      <main>
        <section className="hero-grid-bg section-shell grid min-h-[calc(100vh-176px)] items-center gap-6 py-8 lg:grid-cols-[0.86fr_1.14fr]">
          <div className="max-w-xl lg:pl-16">
            <h1 className="font-serif text-step-6 font-normal leading-[1.12] text-black">
              {[0, 1].map((line) => (
                <span key={line} className="block">
                  {heroWords
                    .filter((word) => word.line === line)
                    .map((word, wordPosition, lineWords) => {
                      const index = heroWordIndex++;
                      return (
                        <span key={word.text}>
                          <span className="hero-word" style={{ "--i": index } as CSSProperties}>
                            {word.gold ? <em className="text-[var(--champagne)]">{word.text}</em> : word.text}
                          </span>
                          {locale === "en" && wordPosition < lineWords.length - 1 ? " " : ""}
                        </span>
                      );
                    })}
                </span>
              ))}
            </h1>
            <p className="mt-6 max-w-md text-step--1 leading-7 text-[var(--graphite)]">
              {locale === "zh"
                ? "每件作品都是顶级奢侈品级的唯一实体：一个编号、一句心事、一件饰品，不复制、不复刻。付款确认后，它从此只属于一位主人。"
                : "Every work is an ultra-luxury one-physical-piece creation: one serial, one feeling, one jewel. Never copied, never reissued; after confirmation, it belongs to one collector only."}
            </p>
            <div className="mt-8 hidden gap-4 md:flex">
              <LinkButton href={withLocale(locale, "/auctions")}>{copy.primaryCta}</LinkButton>
              <LinkButton href={withLocale(locale, "/story")} variant="outline">
                {copy.secondaryCta}
              </LinkButton>
            </div>
          </div>
          <div className="relative mx-auto aspect-[1.18/1] w-full max-w-[720px]">
            <Image
              src={featured.image}
              alt={`${featured.serial} ${featuredTitle}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 56vw"
              className="object-contain"
            />
          </div>
          <MobileHeroSale locale={locale} />
        </section>
        <Reveal>
          <section className="section-shell border-t border-black/10 py-16">
            <div className="max-w-2xl">
              <h2 className="text-xs uppercase tracking-[0.2em]">{locale === "zh" ? "Noirven 是什么" : "What is Noirven"}</h2>
              <p className="mt-5 text-step-1 leading-8 text-[var(--graphite)]">{brandDefinition}</p>
              <div className="mt-10 space-y-8">
                {homeFaq.map((item) => (
                  <div key={item.question}>
                    <h3 className="font-serif text-step-1">{item.question}</h3>
                    <p className="mt-2 text-step--1 leading-6 text-[var(--graphite)]">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        <div className="hidden md:block">
          <HeroSaleStrip locale={locale} />
        </div>

        <section className="border-y border-black/10 bg-[var(--ivory)]">
          <div className="section-shell grid gap-8 py-12 md:grid-cols-3">
            {[
              { icon: Gem, label: locale === "zh" ? "顶奢定价" : "Ultra-Luxury Price", text: locale === "zh" ? "以宝石级稀缺、匠作时长与唯一编号定价；稀世之作只入一位藏家的档案，重在传承与长期保值。" : "Pricing follows gem-grade rarity, atelier hours, and one-of-one provenance; each rare work enters one collector archive with long-horizon value in mind." },
              { icon: Archive, label: locale === "zh" ? "唯一编号" : "One Serial", text: locale === "zh" ? "每件作品内侧或背面刻入 N+编号。" : "Every work carries an N+serial engraving." },
              { icon: ShieldCheck, label: locale === "zh" ? "到账确认" : "Receipt Review", text: locale === "zh" ? "USDT 到账后后台登记拥有者并安排发货。" : "After USDT receipt is confirmed, ownership and delivery are registered." },
            ].map((item) => (
              <div key={item.label} className="flex gap-4">
                <item.icon size={20} className="mt-1 text-[var(--antique-gold)]" />
                <div>
                  <h2 className="text-xs uppercase tracking-[0.2em]">{item.label}</h2>
                  <p className="mt-2 text-step--1 leading-6 text-[var(--graphite)]">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Reveal>
          <section className="section-shell py-24" id="series">
            <div className="mb-12 max-w-2xl">
              <h2 className="mt-4 font-serif text-step-5 font-normal leading-[1.05]">{copy.seriesTitle}</h2>
              <p className="mt-5 text-step-1 leading-8 text-[var(--graphite)]">{copy.seriesIntro}</p>
            </div>
            <SeriesGrid locale={locale} />
          </section>
        </Reveal>

        <Reveal>
          <section className="noir-surface py-24">
          <div className="section-shell">
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div>
                <h2 className="mt-4 font-serif text-step-5 font-normal leading-[1.05] text-white">{copy.auctionTitle}</h2>
              </div>
              <LinkButton href={withLocale(locale, "/auctions")} variant="light">
                {copy.primaryCta}
              </LinkButton>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {live.map((product) => (
                <div key={product.id} className="bg-[var(--porcelain)] p-4 text-black">
                  <ProductCard product={product} locale={locale} />
                </div>
              ))}
            </div>
          </div>
        </section>
        </Reveal>

        <Reveal>
          <section className="section-shell grid gap-12 py-24 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <h2 className="mt-4 font-serif text-step-5 font-normal leading-[1.05]">
              {locale === "zh" ? "材质服务故事，而不是炫耀堆砌。" : "Materials serve the story, not excess."}
            </h2>
            <p className="mt-6 text-step-1 leading-8 text-[var(--graphite)]">
              {locale === "zh"
                ? "从玫瑰金、雕金、黄金、铂金，到黑铑铂金、钯金、钛金属、陨铁与黑陶瓷；从天然白钻、帕拉伊巴碧玺、沙弗莱石、欧泊、月光石、黑贝母，到珐琅彩、玑镂雕纹、隐秘式镶嵌、雪花镶、错金银与景泰蓝，都会按故事线选择。"
                : "From rose gold, carved gold, platinum, black rhodium platinum, palladium, titanium, meteorite, and black ceramic to diamonds, paraiba tourmaline, tsavorite, opal, moonstone, black nacre, enamel, guilloche, invisible setting, snow setting, damascening, and cloisonne-inspired craft, every choice follows the story."}
            </p>
            <div className="mt-8 grid gap-4">
              {materialNarratives.slice(0, 3).map((item) => (
                <div key={item.title} className="border-t border-black/12 pt-4">
                  <h3 className="mt-2 text-step-1">{locale === "zh" ? item.zhTitle : item.title}</h3>
                  <p className="mt-2 text-step--1 leading-7 text-[var(--graphite)]">
                    {localizedMaterialNarrativeStory(item.title, item.story, locale)}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {storySeries.map((rawSeries) => {
              const series = localizedSeries(rawSeries, locale);

              return (
              <div key={rawSeries.id} className="border-t border-black/12 pt-5">
                <h3 className="font-serif text-step-1">{series.name}</h3>
                <p className="mt-2 text-step--1 leading-6 text-[var(--graphite)]">{series.emotionalLine}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {localizedTerms([...rawSeries.materials, ...rawSeries.craft], locale).slice(0, 5).map((item) => (
                    <span key={item} className="border border-black/10 px-3 py-2 text-xs text-[var(--graphite)]">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              );
            })}
          </div>
        </section>
        </Reveal>

        <Reveal>
          <section className="border-y border-black/10 bg-[var(--ivory)] py-24">
          <div className="section-shell">
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div>
                <h2 className="mt-4 font-serif text-step-5 font-normal leading-[1.05]">{copy.archiveTitle}</h2>
              </div>
              <LinkButton href={withLocale(locale, "/sold")} variant="outline">
                {locale === "zh" ? "查看已售档案" : "View Archive"}
              </LinkButton>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-2">
              {sold.map((product) => (
                <ProductCard key={product.id} product={product} locale={locale} />
              ))}
            </div>
          </div>
        </section>
        </Reveal>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
