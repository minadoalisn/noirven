import { AuctionPage } from "@/components/sections/auction-page";
import { auctionListQaPairs } from "@/lib/auction-qa";
import { faqPageJsonLd } from "@/lib/structured-data";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Ultra-Luxury Works",
  description: "Noirven presents numbered ultra-luxury high-jewelry works: one physical piece, never copied, never reissued, and sold at fixed ownership prices.",
  path: "/en/auctions",
});

type PageSearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function Page({ searchParams }: { searchParams?: PageSearchParams }) {
  const faqLd = faqPageJsonLd({
    pageUrl: "https://nvonly.com/en/auctions",
    pairs: auctionListQaPairs("en"),
  });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <AuctionPage locale="en" searchParams={searchParams ? await searchParams : {}} />
    </>
  );
}
