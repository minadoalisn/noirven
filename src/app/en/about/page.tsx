import { AboutPage } from "@/components/sections/about-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "About Noirven",
  description:
    "Noirven is a one-of-one luxury jewelry auction. Every work is numbered, exists once, is never copied or reissued, and belongs to a story series. Works are listed with a fixed ownership price in US dollars and sold through a seven-day auction page in Chinese and English.",
  path: "/en/about",
});

export default function Page() {
  return <AboutPage locale="en" />;
}
