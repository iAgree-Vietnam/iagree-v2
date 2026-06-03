

import ComplainResolvePolicyScreen from "@/src/screens/ComplainResolvePolicyScreen/ComplainResolvePolicyScreen";
import CookieUtils from "@/src/utils/CookieUtils";
import { GetServerSidePropsContext } from "next";

import Seo from "@/src/components/Seo";
import { ConstantConfig } from "@/src/constants/Config";

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  // Nếu sau này cần auth thì xử lý ở đây
  // if (!CookieUtils.hasAccessToken(context)) {}

  return {
    props: {},
  };
};

const COMPLAIN_RESOLVE_POLICY_JSONLD = {
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
        ConstantConfig.SOCIAL_LINKS.website,
      ],
    },

    // Website
    {
      "@type": "WebSite",
      "@id": `${ConstantConfig.BASE_URL}/#website`,
      url: ConstantConfig.BASE_URL,
      name: ConstantConfig.DEFAULT_AUTHOR,
      description: ConstantConfig.DEFAULT_DESCRIPTION,
      publisher: { "@id": `${ConstantConfig.BASE_URL}/#organization` },
      inLanguage: "vi",
    },

    // Policy Page
    {
      "@type": "WebPage",
      "@id": `${ConstantConfig.BASE_URL}/chinh-sach-huy-cong-viec-tranh-chap-khieu-nai#webpage`,
      url: `${ConstantConfig.BASE_URL}/chinh-sach-huy-cong-viec-tranh-chap-khieu-nai`,
      name: `Chính sách hủy công việc, giải quyết tranh chấp và khiếu nại - ${ConstantConfig.DEFAULT_AUTHOR}`,
      description:
        "Quy định về hủy công việc, quy trình giải quyết tranh chấp, tiếp nhận và xử lý khiếu nại khi sử dụng nền tảng iAgree.",
      isPartOf: { "@id": `${ConstantConfig.BASE_URL}/#website` },
      about: { "@id": `${ConstantConfig.BASE_URL}/#organization` },
      inLanguage: "vi",
    },

    // Breadcrumb
    {
      "@type": "BreadcrumbList",
      "@id": `${ConstantConfig.BASE_URL}/chinh-sach-huy-cong-viec-tranh-chap-khieu-nai#breadcrumb`,
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
          name: "Chính sách hủy công việc, giải quyết tranh chấp và khiếu nại",
          item: `${ConstantConfig.BASE_URL}/chinh-sach-huy-cong-viec-tranh-chap-khieu-nai`,
        },
      ],
    },
  ],
};

function Component(props: any) {
  const title = "Chính sách hủy công việc, giải quyết tranh chấp và khiếu nại";
  const description =
    "Quy định về hủy công việc, quy trình giải quyết tranh chấp, tiếp nhận và xử lý khiếu nại khi sử dụng nền tảng iAgree.";

  return (
    <>
      <Seo
        title={title}
        description={description}
        canonicalPath="/chinh-sach-huy-cong-viec-tranh-chap-khieu-nai"
        ogImage={ConstantConfig.DEFAULT_OG_IMAGE?.[0]?.url}
        jsonLd={COMPLAIN_RESOLVE_POLICY_JSONLD}
        jsonLdId="jsonld-complain-resolve-policy"
      />

      <ComplainResolvePolicyScreen {...props} />
    </>
  );
}

export default Component;