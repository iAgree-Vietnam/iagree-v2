import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { GetServerSidePropsContext } from "next/types";

import NewsListScreen from "../../src/screens/NewsScreen/NewsListScreen";
import BackendPostServices from "../../src/data/post/services/BackendPostServices";

import Seo from "@/src/components/Seo";
import { ConstantConfig } from "@/src/constants/Config";

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const apiRes = await new BackendPostServices(context).get({});

  return {
    props: {
      data: apiRes,
    },
  };
};

const NEWS_LIST_JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    // Organization (reuse)
    {
      "@type": "Organization",
      "@id": `${ConstantConfig.BASE_URL}/#organization`,
      name: ConstantConfig.COMPANY_NAME,
      brand: { "@type": "Brand", name: ConstantConfig.DEFAULT_AUTHOR },
      url: ConstantConfig.BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${ConstantConfig.BASE_URL}${ConstantConfig.DEFAULT_LOGO}`,
      },
      sameAs: [
        ConstantConfig.SOCIAL_LINKS.facebook,
        ConstantConfig.SOCIAL_LINKS.instagram,
        ConstantConfig.SOCIAL_LINKS.tiktok,
        ConstantConfig.SOCIAL_LINKS.linkedin,
        ConstantConfig.BASE_URL, // nếu có
      ].filter(Boolean),
    },

    // Website (reuse)
    {
      "@type": "WebSite",
      "@id": `${ConstantConfig.BASE_URL}/#website`,
      url: ConstantConfig.BASE_URL,
      name: ConstantConfig.DEFAULT_AUTHOR,
      description: ConstantConfig.DEFAULT_DESCRIPTION,
      publisher: { "@id": `${ConstantConfig.BASE_URL}/#organization` },
      inLanguage: "vi",
    },

    // News list page
    {
      "@type": "CollectionPage",
      "@id": `${ConstantConfig.BASE_URL}/bai-viet#webpage`,
      url: `${ConstantConfig.BASE_URL}/bai-viet`,
      name: `Tin tức - ${ConstantConfig.DEFAULT_AUTHOR}`,
      description:
        "Cập nhật tin tức, kiến thức nghề nghiệp, xu hướng freelance và thông báo mới nhất từ iAgree.",
      isPartOf: { "@id": `${ConstantConfig.BASE_URL}/#website` },
      about: { "@id": `${ConstantConfig.BASE_URL}/#organization` },
      inLanguage: "vi",
    },

    // Breadcrumb
    {
      "@type": "BreadcrumbList",
      "@id": `${ConstantConfig.BASE_URL}/bai-viet#breadcrumb`,
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
          name: "Tin tức",
          item: `${ConstantConfig.BASE_URL}/bai-viet`,
        },
      ],
    },
  ],
};

export default function Component(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const title = "Tin tức";
  const description =
    "Cập nhật tin tức, kiến thức nghề nghiệp, xu hướng freelance và thông báo mới nhất từ iAgree.";

  return (
    <>
      <Seo
        title={title}
        description={description}
        canonicalPath="/bai-viet"
        ogImage={ConstantConfig.DEFAULT_OG_IMAGE?.[0]?.url}
        jsonLd={NEWS_LIST_JSONLD}
        jsonLdId="jsonld-news-list"
      />

      <NewsListScreen {...(props as any)} />
    </>
  );
}
