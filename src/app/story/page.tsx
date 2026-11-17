import { StoryPage } from "@/components/sections/story-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "品牌故事",
  description: "Noirven 诺梵最终品牌故事：每一次归属，都是一次拯救；每件作品都有独立编号，记录系列、故事线、材质、工艺与归属状态。",
  path: "/story",
});

export default function Page() {
  return <StoryPage locale="zh" />;
}
