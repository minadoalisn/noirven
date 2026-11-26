import Image from "next/image";
import Link from "next/link";
import { AuctionQa } from "@/components/sections/auction-qa";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ProductCard } from "@/components/sections/product-card";
import { AuctionViewSwitch, type AuctionView } from "@/components/ui/auction-view-switch";
import { CollectionStrip, type CollectionItem } from "@/components/ui/collection";
import { auctionListQaPairs } from "@/lib/auction-qa";
import { formatCurrency } from "@/lib/format";
import { liveProducts, storySeries } from "@/lib/noirven-data";
import { withLocale } from "@/lib/i18n";
import { localizedProductTitle, localizedTerms } from "@/lib/localized-content";
import type { Locale } from "@/lib/types";

type AuctionSearchParams = Record<string, string | string[] | undefined>;

function readParam(searchParams: AuctionSearchParams, key: string) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

function serialNumber(serial: string) {
  return Number(serial.replace(/\D/g, "")) || 0;
}

type AuctionFilters = {
  series: string;
  material: string;
  price: string;
  q: string;
  view: AuctionView;
};

function collectionHref(locale: Locale, filters: AuctionFilters, page = 1) {
  const query = new URLSearchParams();

  if (filters.series !== "all") query.set("series", filters.series);
  if (filters.material !== "all") query.set("material", filters.material);
  if (filters.price !== "all") query.set("price", filters.price);
  if (filters.q) query.set("q", filters.q);
  if (filters.view !== "grid") query.set("view", filters.view);
  if (page > 1) query.set("page", String(page));

  const qs = query.toString();
  return `${withLocale(locale, "/auctions")}${qs ? `?${qs}` : ""}`;
}

/** Price bands are UI grouping only; prices themselves are untouched. */
function priceBand(price: number, band: string) {
  if (band === "under100") return price < 100000;
  if (band === "100to130") return price >= 100000 && price <= 130000;
  if (band === "over130") return price > 130000;
  return true;
}

/** The macro detail shot when one exists, otherwise the main image. */
function galleryImage(product: (typeof liveProducts)[number]) {
  const macro = product.gallery?.find((src) => src.includes("-macro"));
  return macro ?? product.image;
}

export function AuctionPage({ locale = "zh", searchParams = {} }: { locale?: Locale; searchParams?: AuctionSearchParams }) {
  const requestedSeries = readParam(searchParams, "series") ?? "all";
  const selectedSeries = storySeries.some((series) => series.id === requestedSeries) ? requestedSeries : "all";
  const allMaterials = [...new Set(liveProducts.flatMap((product) => product.materials))];
  const requestedMaterial = readParam(searchParams, "material") ?? "all";
  const selectedMaterial = allMaterials.includes(requestedMaterial) ? requestedMaterial : "all";
  const requestedPrice = readParam(searchParams, "price") ?? "all";
  const selectedPrice = ["under100", "100to130", "over130"].includes(requestedPrice) ? requestedPrice : "all";
  const q = (readParam(searchParams, "q") ?? "").trim();
  const requestedView = readParam(searchParams, "view") ?? "grid";
  const currentView: AuctionView = requestedView === "list" || requestedView === "gallery" ? requestedView : "grid";
  const viewInUrl = searchParams.view !== undefined;

  const filters: AuctionFilters = {
    series: selectedSeries,
    material: selectedMaterial,
    price: selectedPrice,
    q,
    view: currentView,
  };
  const pageSize = currentView === "gallery" ? 6 : 9;

  const sortedProducts = [...liveProducts].sort((a, b) => serialNumber(b.serial) - serialNumber(a.serial));
  const filteredProducts = sortedProducts.filter((product) => {
    if (selectedSeries !== "all" && product.seriesId !== selectedSeries) return false;
    if (selectedMaterial !== "all" && !product.materials.includes(selectedMaterial)) return false;
    if (!priceBand(product.currentPrice, selectedPrice)) return false;
    if (q) {
      const haystack = `${product.serial} ${product.title} ${product.zhTitle} ${product.seriesId}`.toLowerCase();
      const series = storySeries.find((item) => item.id === product.seriesId);
      const seriesText = series ? `${series.name} ${series.zhName}`.toLowerCase() : "";
      if (!haystack.includes(q.toLowerCase()) && !seriesText.includes(q.toLowerCase())) return false;
    }
    return true;
  });

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const requestedPage = Number(readParam(searchParams, "page") ?? "1");
  const currentPage = Math.min(Math.max(Number.isFinite(requestedPage) ? requestedPage : 1, 1), pageCount);
  const pageProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const queryString = new URLSearchParams();
  if (selectedSeries !== "all") queryString.set("series", selectedSeries);
  if (selectedMaterial !== "all") queryString.set("material", selectedMaterial);
  if (selectedPrice !== "all") queryString.set("price", selectedPrice);
  if (q) queryString.set("q", q);

  const collectionItems: CollectionItem[] = liveProducts.map((product) => ({
    slug: product.slug,
    title: localizedProductTitle(product, locale),
    serial: product.serial,
    image: product.image,
    price: formatCurrency(product.currentPrice),
    href: withLocale(locale, `/auctions/${product.slug}`),
  }));

  const priceBands: { id: string; zh: string; en: string }[] = [
    { id: "under100", zh: "10万以下", en: "Under $100k" },
    { id: "100to130", zh: "10万–13万", en: "$100k–$130k" },
    { id: "over130", zh: "13万以上", en: "Over $130k" },
  ];
  const filtersActive = selectedSeries !== "all" || selectedMaterial !== "all" || selectedPrice !== "all" || q !== "";

  return (
    <div className="min-h-screen bg-[var(--porcelain)]">
      <SiteHeader locale={locale} />
      <main>
        <section className="section-shell py-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--ash)]">Ultra-Luxury Works</p>
          <h1 className="mt-5 max-w-3xl font-serif text-step-5 font-normal leading-tight">
            {locale === "zh" ? "顶级奢侈品级作品，仅此一件。" : "Ultra-luxury works, one physical piece only."}
          </h1>
          <p className="mt-6 max-w-2xl text-step-1 leading-8 text-[var(--graphite)]">
            {locale === "zh"
              ? "新品按编号优先展示，满页后进入下一页，也可以按故事线筛选。每个故事章节对应一个产品、一件饰品、一个编号；每件作品按顶级奢侈品级材质、工艺与唯一实体价值直接出售，USDT 到账确认后登记拥有者并安排发货。"
              : "New pieces appear first and paginate after a full page. Filter by storyline; each story chapter maps to one product, one jewel, and one serial. Each work is sold directly at an ultra-luxury fixed price shaped by materials, craft, and one-physical-piece value."}
          </p>
        </section>
        <section className="section-shell pb-24">
          <form method="get" action={withLocale(locale, "/auctions")} className="mb-8 flex flex-wrap items-center gap-3" role="search">
            <label htmlFor="auction-search" className="sr-only">
              {locale === "zh" ? "搜索作品" : "Search works"}
            </label>
            <input
              id="auction-search"
              name="q"
              type="search"
              defaultValue={q}
              placeholder={locale === "zh" ? "搜索编号、名称或故事线…" : "Search serial, name, or series…"}
              className="focus-ring h-11 min-w-56 flex-1 border border-black/20 bg-[var(--porcelain)] px-4 text-step--1"
            />
            {selectedSeries !== "all" ? <input type="hidden" name="series" value={selectedSeries} /> : null}
            {selectedMaterial !== "all" ? <input type="hidden" name="material" value={selectedMaterial} /> : null}
            {selectedPrice !== "all" ? <input type="hidden" name="price" value={selectedPrice} /> : null}
            {currentView !== "grid" ? <input type="hidden" name="view" value={currentView} /> : null}
            <button
              type="submit"
              className="focus-ring inline-flex h-11 items-center border border-black bg-black px-5 font-mono text-[11px] uppercase tracking-[0.16em] text-white transition hover:bg-transparent hover:text-black"
            >
              {locale === "zh" ? "搜索" : "Search"}
            </button>
            {filtersActive ? (
              <Link
                href={collectionHref(locale, { ...filters, series: "all", material: "all", price: "all", q: "" })}
                className="focus-ring inline-flex h-11 items-center border border-black/20 px-5 font-mono text-[11px] uppercase tracking-[0.16em] transition hover:border-black"
              >
                {locale === "zh" ? "清除筛选" : "Clear filters"}
              </Link>
            ) : null}
          </form>

          <div className="mb-4 flex flex-wrap gap-2">
            <Link
              href={collectionHref(locale, { ...filters, series: "all" })}
              className={`focus-ring border px-4 py-2 text-xs transition ${
                selectedSeries === "all" ? "border-black bg-black text-white" : "border-black/10 text-[var(--graphite)] hover:border-black/40"
              }`}
            >
              {locale === "zh" ? "全部故事线" : "All Series"}
            </Link>
            {storySeries.map((series) => (
              <Link
                key={series.id}
                href={collectionHref(locale, { ...filters, series: series.id })}
                className={`focus-ring border px-4 py-2 text-xs transition ${
                  selectedSeries === series.id ? "border-black bg-black text-white" : "border-black/10 text-[var(--graphite)] hover:border-black/40"
                }`}
              >
                {locale === "zh" ? series.zhName : series.name}
              </Link>
            ))}
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            <Link
              href={collectionHref(locale, { ...filters, material: "all" })}
              className={`focus-ring border px-4 py-2 text-xs transition ${
                selectedMaterial === "all" ? "border-black bg-black text-white" : "border-black/10 text-[var(--graphite)] hover:border-black/40"
              }`}
            >
              {locale === "zh" ? "全部材质" : "All Materials"}
            </Link>
            {allMaterials.map((material) => (
              <Link
                key={material}
                href={collectionHref(locale, { ...filters, material })}
                className={`focus-ring border px-4 py-2 text-xs transition ${
                  selectedMaterial === material ? "border-black bg-black text-white" : "border-black/10 text-[var(--graphite)] hover:border-black/40"
                }`}
              >
                {localizedTerms([material], locale)[0] ?? material}
              </Link>
            ))}
          </div>

          <div className="mb-8 flex flex-wrap gap-2">
            <Link
              href={collectionHref(locale, { ...filters, price: "all" })}
              className={`focus-ring border px-4 py-2 text-xs transition ${
                selectedPrice === "all" ? "border-black bg-black text-white" : "border-black/10 text-[var(--graphite)] hover:border-black/40"
              }`}
            >
              {locale === "zh" ? "全部价格" : "All Prices"}
            </Link>
            {priceBands.map((band) => (
              <Link
                key={band.id}
                href={collectionHref(locale, { ...filters, price: band.id })}
                className={`focus-ring border px-4 py-2 text-xs transition ${
                  selectedPrice === band.id ? "border-black bg-black text-white" : "border-black/10 text-[var(--graphite)] hover:border-black/40"
                }`}
              >
                {locale === "zh" ? band.zh : band.en}
              </Link>
            ))}
          </div>

          <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-y border-black/10 py-4 text-xs text-[var(--graphite)]">
            <p>
              {locale === "zh"
                ? `共 ${filteredProducts.length} 件 / 第 ${currentPage} 页`
                : `${filteredProducts.length} works / Page ${currentPage}`}
            </p>
            <AuctionViewSwitch
              basePath={withLocale(locale, "/auctions")}
              queryString={queryString.toString()}
              currentView={currentView}
              viewInUrl={viewInUrl}
              locale={locale}
            />
          </div>

          {pageProducts.length > 0 ? (
            currentView === "list" ? (
              <ul className="divide-y divide-black/10 border-y border-black/10">
                {pageProducts.map((product) => {
                  const title = localizedProductTitle(product, locale);
                  return (
                    <li key={product.id}>
                      <Link href={withLocale(locale, `/auctions/${product.slug}`)} className="focus-ring flex items-center gap-5 py-5 transition hover:bg-black/[0.03]">
                        <span className="relative h-20 w-20 shrink-0 overflow-hidden bg-[var(--ivory)]">
                          <Image src={product.image} alt="" fill sizes="80px" className="object-cover" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--ash)]">{product.serial}</span>
                          <span className="mt-1 block truncate font-serif text-step-1">{title}</span>
                          <span className="mt-1 block truncate text-xs text-[var(--graphite)]">
                            {localizedTerms(product.materials, locale).join(" · ")}
                          </span>
                        </span>
                        <span className="shrink-0 font-mono text-lg">{formatCurrency(product.currentPrice)}</span>
                        <span aria-hidden="true" className="hidden shrink-0 text-[var(--antique-gold)] sm:block">
                          →
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : currentView === "gallery" ? (
              <div className="grid gap-10 md:grid-cols-2">
                {pageProducts.map((product) => {
                  const title = localizedProductTitle(product, locale);
                  return (
                    <article key={product.id}>
                      <Link href={withLocale(locale, `/auctions/${product.slug}`)} className="focus-ring group block">
                        <span className="relative block aspect-[4/5] overflow-hidden bg-[var(--ivory)]">
                          <Image
                            src={galleryImage(product)}
                            alt={`${product.serial} ${title}`}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover transition duration-500 group-hover:scale-105"
                          />
                        </span>
                        <span className="mt-4 flex items-baseline justify-between gap-4">
                          <span className="font-serif text-step-1">{title}</span>
                          <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--ash)]">{product.serial}</span>
                        </span>
                        <span className="mt-1 block font-mono text-lg">{formatCurrency(product.currentPrice)}</span>
                      </Link>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                {pageProducts.map((product) => (
                  <ProductCard key={product.id} product={product} locale={locale} />
                ))}
              </div>
            )
          ) : (
            <div className="border border-black/10 p-10 text-step--1 text-[var(--graphite)]">
              {locale === "zh" ? "没有符合筛选的作品。" : "No works match these filters."}
            </div>
          )}

          {pageCount > 1 ? (
            <nav className="mt-14 flex flex-wrap items-center justify-center gap-2" aria-label="Collection pagination">
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
                <Link
                  key={page}
                  href={collectionHref(locale, filters, page)}
                  className={`focus-ring inline-flex h-10 min-w-10 items-center justify-center border px-3 text-step--1 ${
                    currentPage === page ? "border-black bg-black text-white" : "border-black/10 text-[var(--graphite)] hover:border-black/40"
                  }`}
                >
                  {page}
                </Link>
              ))}
            </nav>
          ) : null}

          <CollectionStrip items={collectionItems} locale={locale} />
        </section>
        <AuctionQa pairs={auctionListQaPairs(locale)} locale={locale} />
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
