import { AuctionPage } from "@/components/sections/auction-page";
import { auctionListQaPairs } from "@/lib/auction-qa";
import { faqPageJsonLd } from "@/lib/structured-data";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "顶奢作品",
  description: "Noirven 诺梵顶奢作品：举世无双、仅此一件、不复制不复刻的编号顶级奢侈品级高珠宝作品，按编号优先展示，USDT 到账确认后登记拥有者。",
  path: "/auctions",
});

type PageSearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function Page({ searchParams }: { searchParams?: PageSearchParams }) {
  const faqLd = faqPageJsonLd({
    pageUrl: "https://nvonly.com/auctions",
    pairs: auctionListQaPairs("zh"),
  });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <AuctionPage locale="zh" searchParams={searchParams ? await searchParams : {}} />
    </>
  );
}
