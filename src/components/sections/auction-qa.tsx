import type { QaPair } from "@/lib/auction-qa";
import type { Locale } from "@/lib/types";

/**
 * Visible Q&A block (GEO, 2026-11-26). Pairs come from
 * `auction-qa.ts` — verbatim site copy or the product's own fields.
 * Rendered on product pages and the auction list page; the matching
 * FAQPage JSON-LD is injected by the page route.
 */
export function AuctionQa({ pairs, locale = "zh" }: { pairs: QaPair[]; locale?: Locale }) {
  if (pairs.length === 0) return null;
  return (
    <section className="section-shell pb-24" aria-label={locale === "zh" ? "常见问题" : "Frequently asked questions"}>
      <h2 className="text-step--1 uppercase tracking-[0.18em]">{locale === "zh" ? "常见问题" : "Frequently Asked Questions"}</h2>
      <dl className="mt-6 divide-y divide-black/10 border-y border-black/10">
        {pairs.map((pair) => (
          <div key={pair.question} className="py-6">
            <dt className="font-serif text-step-1">{pair.question}</dt>
            <dd className="mt-2 text-step--1 leading-7 text-[var(--graphite)]">{pair.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
