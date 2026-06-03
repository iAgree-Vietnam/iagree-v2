import {
    GetServerSideProps,
    InferGetServerSidePropsType,
  } from "next";
  import { GetServerSidePropsContext } from "next/types";
  
  import PartnersScreen from "@/src/screens/PartnerScreen/PartnersScreen";
  import BackendPartnerServices from "@/src/data/partner/services/BackendPartnerServices";
  
  import Seo from "@/src/components/Seo";
  import { ConstantConfig } from "@/src/constants/Config";
  
  export const getServerSideProps: GetServerSideProps = async (
    context: GetServerSidePropsContext
  ) => {
    const apiRes = await new BackendPartnerServices(context).get({});
  
    return {
      props: {
        data: apiRes,
      },
    };
  };
  
  const PARTNERS_LIST_JSONLD = {
    "@context": "https://schema.org",
    "@graph": [
      // Organization (reuse)
      {
        "@type": "Organization",
        "@id": `${ConstantConfig.BASE_URL}/#organization`,
        name: ConstantConfig.COMPANY_NAME,
        brand: {
          "@type": "Brand",
          name: ConstantConfig.DEFAULT_AUTHOR,
        },
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
        ],
      },
  
      // Website (reuse)
      {
        "@type": "WebSite",
        "@id": `${ConstantConfig.BASE_URL}/#website`,
        url: ConstantConfig.BASE_URL,
        name: ConstantConfig.DEFAULT_AUTHOR,
        description: ConstantConfig.DEFAULT_DESCRIPTION,
        publisher: {
          "@id": `${ConstantConfig.BASE_URL}/#organization`,
        },
        inLanguage: "vi",
      },
  
      // Partners list page
      {
        "@type": "CollectionPage",
        "@id": `${ConstantConfig.BASE_URL}/doi-tac#webpage`,
        url: `${ConstantConfig.BASE_URL}/doi-tac`,
        name: `Đối tác - ${ConstantConfig.DEFAULT_AUTHOR}`,
        description:
          "Danh sách đối tác uy tín đang hợp tác trên nền tảng iAgree, kết nối doanh nghiệp với freelancer chất lượng.",
        isPartOf: {
          "@id": `${ConstantConfig.BASE_URL}/#website`,
        },
        about: {
          "@id": `${ConstantConfig.BASE_URL}/#organization`,
        },
        inLanguage: "vi",
      },
  
      // Breadcrumb
      {
        "@type": "BreadcrumbList",
        "@id": `${ConstantConfig.BASE_URL}/doi-tac#breadcrumb`,
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
        ],
      },
    ],
  };
  
  export default function Component(
    props: InferGetServerSidePropsType<typeof getServerSideProps>
  ) {
    const title = "Đối tác";
    const description =
      "Danh sách đối tác uy tín đang hợp tác trên nền tảng iAgree, kết nối doanh nghiệp với freelancer chất lượng.";
  
    return (
      <>
        <Seo
          title={title}
          description={description}
          canonicalPath="/doi-tac"
          ogImage={ConstantConfig.DEFAULT_OG_IMAGE?.[0]?.url}
          jsonLd={PARTNERS_LIST_JSONLD}
          jsonLdId="jsonld-partners-list"
        />
  
        <PartnersScreen {...(props as any)} />
      </>
    );
  }