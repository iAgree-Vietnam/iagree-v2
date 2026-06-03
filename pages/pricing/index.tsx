import { GetServerSidePropsContext } from "next/types";

import PricingScreen from "@/src/screens/PricingScreen/PricingScreen";
import BackendPricingServices from "@/src/data/pricing/services/BackendPricingServices";

import Seo from "@/src/components/Seo";
import { ConstantConfig } from "@/src/constants/Config";

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const res = await new BackendPricingServices(context).get();

  return {
    props: {
      data: res,
    },
  };
};

const PRICING_JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    // WebPage
    {
      "@type": "WebPage",
      "@id": `${ConstantConfig.BASE_URL}/bang-gia#webpage`,
      url: `${ConstantConfig.BASE_URL}/bang-gia`,
      name: `Bảng giá - ${ConstantConfig.DEFAULT_AUTHOR}`,
      description:
        "Bảng giá các gói dịch vụ trên iAgree dành cho freelancer và doanh nghiệp. Xem quyền lợi theo từng gói và lựa chọn phù hợp nhu cầu.",
      isPartOf: { "@id": `${ConstantConfig.BASE_URL}/#website` },
      about: { "@id": `${ConstantConfig.BASE_URL}/#organization` },
      inLanguage: "vi",
    },

    // Breadcrumb
    {
      "@type": "BreadcrumbList",
      "@id": `${ConstantConfig.BASE_URL}/bang-gia#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Trang chủ",
          item: ConstantConfig.BASE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Bảng giá",
          item: `${ConstantConfig.BASE_URL}/bang-gia`,
        },
      ],
    },
  ],
};

export default function Component(props: any) {
  const title = "Bảng giá";
  const description =
    "Bảng giá các gói dịch vụ trên iAgree dành cho freelancer và doanh nghiệp. Xem quyền lợi theo từng gói và lựa chọn phù hợp nhu cầu.";

  return (
    <>
      <Seo
        title={title}
        description={description}
        canonicalPath="/bang-gia"
        ogImage={ConstantConfig.DEFAULT_OG_IMAGE?.[0]?.url}
        jsonLd={PRICING_JSONLD}
        jsonLdId="jsonld-pricing"
      />

      <PricingScreen {...props} />
    </>
  );
}