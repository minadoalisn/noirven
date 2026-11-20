import { HomePage } from "@/components/sections/home-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "One-of-One Luxury Jewelry Auction",
  description:
    "Noirven is a one-of-one luxury jewelry auction. Every work is numbered, exists once, is never copied or reissued, and belongs to a story series. Works are listed with a fixed ownership price in US dollars and sold through a seven-day auction page in Chinese and English.",
  path: "/en",
  aiIndexAlternate: true,
});

export default function Page() {
  return <HomePage locale="en" />;
}
