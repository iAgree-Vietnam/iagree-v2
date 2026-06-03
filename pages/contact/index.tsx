import { GetServerSidePropsContext } from "next";

import { ContactFormScreen } from "@/src/screens/ContactFormScreen/ContactFormScreen";
import Seo from "@/src/components/Seo";
import { ConstantConfig } from "@/src/constants/Config";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  // Nếu sau này muốn bắt buộc đăng nhập thì mở lại
  // if (!CookieUtils.hasAccessToken(context)) {}

  return {
    props: {},
  };
};

/* =========================
 * JSON-LD: CONTACT FORM PAGE
 * ========================= */
const CONTACT_FORM_JSONLD = {
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

    // Contact page
    {
      "@type": "ContactPage",
      "@id": `${ConstantConfig.BASE_URL}/lien-he#webpage`,
      url: `${ConstantConfig.BASE_URL}/lien-he`,
      name: "Liên hệ iAgree",
      description:
        "Trang liên hệ iAgree, nơi người dùng gửi yêu cầu hỗ trợ, góp ý, hợp tác hoặc thắc mắc liên quan đến dịch vụ freelancer, hợp đồng và thanh toán.",
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
      "@id": `${ConstantConfig.BASE_URL}/lien-he#breadcrumb`,
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
          name: "Liên hệ",
          item: `${ConstantConfig.BASE_URL}/lien-he`,
        },
      ],
    },
  ],
};

function Component(props: any) {
  const title = "Liên hệ iAgree";
  const description =
    "Liên hệ iAgree để được hỗ trợ, gửi yêu cầu hợp tác, phản hồi dịch vụ hoặc giải đáp thắc mắc liên quan đến freelancer, hợp đồng và thanh toán.";

  return (
    <>
      <Seo
        title={title}
        description={description}
        canonicalPath="/lien-he"
        ogImage={ConstantConfig.DEFAULT_OG_IMAGE?.[0]?.url}
        jsonLd={CONTACT_FORM_JSONLD}
        jsonLdId="jsonld-contact-form"
      />

      <ContactFormScreen {...props} />
    </>
  );
}

export default Component;