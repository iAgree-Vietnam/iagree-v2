import { GetServerSidePropsContext } from "next";

import ContactPolicyScreen from "@/src/screens/ContactPolicyScreen/ContactPolicyScreen";
import Seo from "@/src/components/Seo";
import { ConstantConfig } from "@/src/constants/Config";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  // Nếu sau này cần login mới xem thì bật lại
  // if (!CookieUtils.hasAccessToken(context)) {}

  return {
    props: {},
  };
};

/* =========================
 * JSON-LD: CONTACT POLICY
 * ========================= */
const CONTACT_POLICY_JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    // Organization
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
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        telephone: ConstantConfig.CONTACT_PHONES,
        email: ConstantConfig.CONTACT_EMAIL,
      },
    },

    // Website
    {
      "@type": "WebSite",
      "@id": `${ConstantConfig.BASE_URL}/#website`,
      url: ConstantConfig.BASE_URL,
      name: ConstantConfig.DEFAULT_AUTHOR,
      publisher: {
        "@id": `${ConstantConfig.BASE_URL}/#organization`,
      },
      inLanguage: "vi",
    },

    // Policy page
    {
      "@type": "WebPage",
      "@id": `${ConstantConfig.BASE_URL}/chinh-sach-lien-he#webpage`,
      url: `${ConstantConfig.BASE_URL}/chinh-sach-lien-he`,
      name: `Chính sách liên hệ - ${ConstantConfig.DEFAULT_AUTHOR}`,
      description:
        "Chính sách liên hệ của iAgree quy định cách thức tiếp nhận, xử lý yêu cầu hỗ trợ, phản hồi, khiếu nại và liên hệ giữa người dùng với nền tảng.",
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
      "@id": `${ConstantConfig.BASE_URL}/chinh-sach-lien-he#breadcrumb`,
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
          name: "Chính sách liên hệ",
          item: `${ConstantConfig.BASE_URL}/chinh-sach-lien-he`,
        },
      ],
    },
  ],
};

function Component(props: any) {
  const title = "Chính sách liên hệ";
  const description =
    "Chính sách liên hệ của iAgree, quy định quy trình tiếp nhận, phản hồi và xử lý các yêu cầu hỗ trợ, góp ý và khiếu nại từ người dùng.";

  return (
    <>
      <Seo
        title={title}
        description={description}
        canonicalPath="/chinh-sach-lien-he"
        ogImage={ConstantConfig.DEFAULT_OG_IMAGE?.[0]?.url}
        jsonLd={CONTACT_POLICY_JSONLD}
        jsonLdId="jsonld-contact-policy"
      />

      <ContactPolicyScreen {...props} />
    </>
  );
}

export default Component;