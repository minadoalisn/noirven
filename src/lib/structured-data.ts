import type { Product } from "@/lib/types";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nvonly.com";

export const organizationId = `${siteUrl}/#organization`;
export const websiteId = `${siteUrl}/#website`;

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId,
    name: "Noirven",
    alternateName: "Noirven 诺梵高奢",
    url: siteUrl,
    logo: `${siteUrl}/favicon.svg`,
    description:
      "Noirven presents one-of-one numbered high-jewelry works, each tied to a story series and registered to one collector after confirmation.",
    brand: {
      "@type": "Brand",
      name: "Noirven",
    },
    knowsAbout: [
      "one-of-one high jewelry",
      "numbered jewelry works",
      "private jewelry collecting",
      "bespoke jewelry",
      "collector registration",
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    name: "Noirven",
    alternateName: "Noirven 诺梵高奢",
    url: siteUrl,
    inLanguage: ["zh-CN", "en"],
    publisher: { "@id": organizationId },
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/auctions?query={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function productPageJsonLd({
  product,
  pageUrl,
  imageUrl,
  name,
  description,
  category,
  materials,
  craft,
  sizing,
  engraving,
  pricingBasis,
  locale,
}: {
  product: Product;
  pageUrl: string;
  imageUrl: string;
  name: string;
  description: string;
  category: string;
  materials: string[];
  craft: string[];
  sizing: string;
  engraving: string;
  pricingBasis: string;
  locale: "zh" | "en";
}) {
  const productId = `${pageUrl}#product`;
  const breadcrumbName = locale === "en" ? "Ultra-Luxury Works" : "顶奢作品";

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name,
        description,
        inLanguage: locale === "en" ? "en" : "zh-CN",
        isPartOf: { "@id": websiteId },
        about: { "@id": productId },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: imageUrl,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Noirven",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: breadcrumbName,
            item: `${siteUrl}${locale === "en" ? "/en" : ""}/auctions`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "Product",
        "@id": productId,
        name,
        description,
        image: [imageUrl],
        sku: product.serial,
        mpn: product.serial,
        brand: { "@type": "Brand", name: "Noirven" },
        manufacturer: { "@id": organizationId },
        category,
        material: materials.join(" / "),
        url: pageUrl,
        additionalProperty: [
          { "@type": "PropertyValue", name: "Serial", value: product.serial },
          { "@type": "PropertyValue", name: "Materials", value: materials.join(" / ") },
          { "@type": "PropertyValue", name: "Craft", value: craft.join(" / ") },
          { "@type": "PropertyValue", name: "Sizing", value: sizing },
          { "@type": "PropertyValue", name: "Unique engraving", value: engraving },
          { "@type": "PropertyValue", name: "Pricing basis", value: pricingBasis },
        ],
        offers: {
          "@type": "Offer",
          url: pageUrl,
          priceCurrency: "USD",
          price: String(product.currentPrice),
          availability: product.status === "sold" ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
          seller: { "@id": organizationId },
          priceValidUntil: product.endsAt.slice(0, 10),
        },
      },
    ],
  };
}
