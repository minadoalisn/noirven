import { SoldPage } from "@/components/sections/sold-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "已售档案",
  description: "Noirven 诺梵已售作品档案：此件已归于唯一的主人；已售档案是作品与主人完成归属后的公开痕迹，公开可查。",
  path: "/sold",
});

export default function Page() {
  return <SoldPage locale="zh" />;
}
