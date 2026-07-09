import { ProductDetail } from "@/components/sections/product-detail";
import { AUTH_COOKIE, verifySessionToken } from "@/lib/auth";
import { categoryLabel } from "@/lib/format";
import { localizedPricingBasis, localizedProductConcept, localizedProductEngraving, localizedProductSizing, localizedTerms } from "@/lib/localized-content";
import { getProduct } from "@/lib/noirven-data";
import { createMetadata } from "@/lib/seo";
import { productPageJsonLd } from "@/lib/structured-data";
import { cookies } from "next/headers";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  return createMetadata({
    title: product ? `${product.zhTitle} ${product.serial}` : "顶奢作品",
    description: product?.concept,
    path: `/auctions/${slug}`,
    image: product?.image,
  });
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ payment?: string; expected?: string }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const cookieStore = await cookies();
  const session = await verifySessionToken(cookieStore.get(AUTH_COOKIE)?.value);
  const product = getProduct(slug);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nvonly.com";

  const jsonLd = product
    ? productPageJsonLd({
        product,
        pageUrl: `${baseUrl}/auctions/${product.slug}`,
        imageUrl: product.image.startsWith("/") ? `${baseUrl}${product.image}` : product.image,
        name: `${product.zhTitle} ${product.serial}`,
        description: localizedProductConcept(product, "zh"),
        category: categoryLabel(product.category, "zh"),
        materials: localizedTerms(product.materials, "zh"),
        craft: localizedTerms(product.craft, "zh"),
        sizing: localizedProductSizing(product, "zh"),
        engraving: localizedProductEngraving(product, "zh"),
        pricingBasis: localizedPricingBasis(product.pricingBasis, "zh"),
        locale: "zh",
      })
    : null;

  return (
    <>
      {jsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /> : null}
      <ProductDetail slug={slug} locale="zh" paymentStatus={query?.payment} expectedAmount={query?.expected} session={session} />
    </>
  );
}
