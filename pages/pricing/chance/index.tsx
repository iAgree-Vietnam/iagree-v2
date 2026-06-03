import PricingChanceScreen from "@/src/screens/PricingScreen/PricingChangeScreen";

import Seo from "@/src/components/Seo";
import { ConstantConfig } from "@/src/constants/Config";

export const getServerSideProps = async () => {
  return {
    props: {},
  };
};

const PRICING_CHANCE_JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${ConstantConfig.BASE_URL}/co-hoi#webpage`,
      url: `${ConstantConfig.BASE_URL}/co-hoi`,
      name: `Gói cơ hội - ${ConstantConfig.DEFAULT_AUTHOR}`,
      description:
        "Gói cơ hội trên iAgree giúp freelancer và doanh nghiệp tăng khả năng tiếp cận công việc, kết nối đối tác và mở rộng cơ hội hợp tác hiệu quả.",
      isPartOf: { "@id": `${ConstantConfig.BASE_URL}/#website` },
      about: { "@id": `${ConstantConfig.BASE_URL}/#organization` },
      inLanguage: "vi",
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${ConstantConfig.BASE_URL}/co-hoi#breadcrumb`,
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
          name: "Gói cơ hội",
          item: `${ConstantConfig.BASE_URL}/co-hoi`,
        },
      ],
    },
  ],
};

function Component() {
  const title = "Gói cơ hội";
  const description =
    "Gói cơ hội trên iAgree giúp freelancer và doanh nghiệp tăng khả năng tiếp cận công việc, kết nối đối tác và mở rộng cơ hội hợp tác hiệu quả.";

  return (
    <>
      <Seo
        title={title}
        description={description}
        canonicalPath="/co-hoi"
        ogImage={ConstantConfig.DEFAULT_OG_IMAGE?.[0]?.url}
        jsonLd={PRICING_CHANCE_JSONLD}
        jsonLdId="jsonld-pricing-chance"
      />

      <PricingChanceScreen />
    </>
  );
}

export default Component;