import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";

import SearchScreen from "@/src/screens/SearchScreen/SearchScreen";
import Seo from "@/src/components/Seo";
import { ConstantConfig } from "@/src/constants/Config";

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  return {
    props: {},
  };
};

/* =========================
 * JSON-LD – SEARCH PAGE
 * ========================= */
const SEARCH_JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${ConstantConfig.BASE_URL}/tim-kiem#webpage`,
      url: `${ConstantConfig.BASE_URL}/tim-kiem`,
      name: `Tìm kiếm - ${ConstantConfig.DEFAULT_AUTHOR}`,
      description:
        "Tìm kiếm công việc, freelancer, đối tác và biểu mẫu nhanh chóng trên nền tảng iAgree.",
      isPartOf: { "@id": `${ConstantConfig.BASE_URL}/#website` },
      about: { "@id": `${ConstantConfig.BASE_URL}/#organization` },
      inLanguage: "vi",
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${ConstantConfig.BASE_URL}/tim-kiem#breadcrumb`,
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
          name: "Tìm kiếm",
          item: `${ConstantConfig.BASE_URL}/tim-kiem`,
        },
      ],
    },
  ],
};

export default function Component(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const title = "Tìm kiếm công việc, freelancer & đối tác";
  const description =
    "Tìm kiếm công việc freelance, freelancer, đối tác và biểu mẫu hợp đồng trên iAgree. Nhanh chóng, minh bạch và dễ sử dụng.";

  return (
    <>
      <Seo
        title={title}
        description={description}
        canonicalPath="/tim-kiem"
        ogImage={ConstantConfig.DEFAULT_OG_IMAGE?.[0]?.url}
        jsonLd={SEARCH_JSONLD}
        jsonLdId="jsonld-search"
      />

      <SearchScreen {...(props as any)} />
    </>
  );
}
