
import { GetServerSidePropsContext } from "next/types";

import { HowItWorksForPartnersScreen } from "@/src/screens/HowItWorksForPartners/HowItWorksForPartners";
import Seo from "@/src/components/Seo";
import { ConstantConfig } from "@/src/constants/Config";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  return {
    props: {},
  };
};

/* =========================
 * JSON-LD: HOW IT WORKS FOR PARTNERS
 * ========================= */
const HOW_IT_WORKS_PARTNERS_JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
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
    },

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

    {
      "@type": "WebPage",
      "@id": `${ConstantConfig.BASE_URL}/huong-dan-doi-tac#webpage`,
      url: `${ConstantConfig.BASE_URL}/huong-dan-doi-tac`,
      name: "Hướng dẫn dành cho Đối tác",
      description:
        "Hướng dẫn dành cho đối tác doanh nghiệp trên iAgree: đăng công việc, quản lý freelancer, ký hợp đồng và thanh toán an toàn.",
      isPartOf: {
        "@id": `${ConstantConfig.BASE_URL}/#website`,
      },
      about: {
        "@id": `${ConstantConfig.BASE_URL}/#organization`,
      },
      inLanguage: "vi",
    },

    {
      "@type": "BreadcrumbList",
      "@id": `${ConstantConfig.BASE_URL}/huong-dan-doi-tac#breadcrumb`,
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
          name: "Hướng dẫn cho đối tác",
          item: `${ConstantConfig.BASE_URL}/huong-dan-doi-tac`,
        },
      ],
    },
  ],
};

function Component(props: any) {
  const title = "Hướng dẫn dành cho Đối tác";
  const description =
    "Hướng dẫn sử dụng iAgree dành cho đối tác doanh nghiệp: đăng công việc, tìm freelancer, ký hợp đồng và quản lý thanh toán hiệu quả.";

  return (
    <>
      <Seo
        title={title}
        description={description}
        canonicalPath="/huong-dan-doi-tac"
        ogImage={ConstantConfig.DEFAULT_OG_IMAGE?.[0]?.url}
        jsonLd={HOW_IT_WORKS_PARTNERS_JSONLD}
        jsonLdId="jsonld-how-it-works-partners"
      />

      <HowItWorksForPartnersScreen {...props} />
    </>
  );
}

export default Component;