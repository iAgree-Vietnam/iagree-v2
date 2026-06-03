import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";

import PartnerSearchScreen from "@/src/screens/PartnersSearchScreen/PartnersSearchScreenV2";

import Seo from "@/src/components/Seo";
import { ConstantConfig } from "@/src/constants/Config";

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  return {
    props: {
      // partnerFilters: PartnerParserUtils.partnerQueries(context.query),
    },
  };
};

const PARTNER_SEARCH_JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${ConstantConfig.BASE_URL}/#website`,
      url: ConstantConfig.BASE_URL,
      name: ConstantConfig.DEFAULT_AUTHOR,
      description: ConstantConfig.DEFAULT_DESCRIPTION,
      inLanguage: "vi",
      publisher: {
        "@id": `${ConstantConfig.BASE_URL}/#organization`,
      },
    },

    {
      "@type": "CollectionPage",
      "@id": `${ConstantConfig.BASE_URL}/doi-tac/tim-kiem#webpage`,
      url: `${ConstantConfig.BASE_URL}/doi-tac/tim-kiem`,
      name: `Tìm kiếm đối tác - ${ConstantConfig.DEFAULT_AUTHOR}`,
      description:
        "Tìm kiếm đối tác theo lĩnh vực, kỹ năng và nhu cầu hợp tác trên iAgree. Lọc nhanh và kết nối đúng đối tác phù hợp.",
      isPartOf: { "@id": `${ConstantConfig.BASE_URL}/#website` },
      about: { "@id": `${ConstantConfig.BASE_URL}/#organization` },
      inLanguage: "vi",
    },

    {
      "@type": "BreadcrumbList",
      "@id": `${ConstantConfig.BASE_URL}/doi-tac/tim-kiem#breadcrumb`,
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
          name: "Đối tác",
          item: `${ConstantConfig.BASE_URL}/doi-tac`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Tìm kiếm",
          item: `${ConstantConfig.BASE_URL}/doi-tac/tim-kiem`,
        },
      ],
    },
  ],
};

export default function Component(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const title = "Tìm kiếm đối tác";
  const description =
    "Tìm kiếm đối tác theo lĩnh vực, kỹ năng và nhu cầu hợp tác trên iAgree. Lọc nhanh và kết nối đúng đối tác phù hợp.";

  return (
    <>
      <Seo
        title={title}
        description={description}
        canonicalPath="/doi-tac/tim-kiem"
        ogImage={ConstantConfig.DEFAULT_OG_IMAGE?.[0]?.url}
        jsonLd={PARTNER_SEARCH_JSONLD}
        jsonLdId="jsonld-partner-search"
      />

      <PartnerSearchScreen {...(props as any)} />
    </>
  );
}
