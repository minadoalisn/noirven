import { HomePage } from "@/components/sections/home-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  fullTitle: "Noirven 诺梵高奢 | 顶级奢侈品级艺术珠宝",
  description: "Noirven（nvonly.com，诺梵高奢）是一家独一无二的高级珠宝拍卖站。每件作品都有独立编号，只存在一件，永不复制、永不复刻，并归属于一个故事系列。作品以美元固定拥有价挂牌，通过中英双语的七日拍卖页售出。",
  path: "/",
  aiIndexAlternate: true,
  markdownAlternate: true,
});

export default function Page() {
  return <HomePage locale="zh" />;
}
