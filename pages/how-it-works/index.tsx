import { GetServerSidePropsContext } from "next/types";

import { HowItWorkScreen } from "@/src/screens/HowItWorkScreen/HowItWorkScreen";
import IntroduceServices from "@/src/data/introduce/services/IntroduceServices";

import Seo from "@/src/components/Seo";
import { ConstantConfig } from "@/src/constants/Config";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const apiRes = await new IntroduceServices().introduce();

  return {
    props: {
      data: apiRes,
    },
  };
};

/* =========================
 * JSON-LD: HOW IT WORKS
 * ========================= */
const HOW_IT_WORKS_JSONLD = {
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

    // How it works page
    {
      "@type": "WebPage",
      "@id": `${ConstantConfig.BASE_URL}/huong-dan-su-dung#webpage`,
      url: `${ConstantConfig.BASE_URL}/huong-dan-su-dung`,
      name: "Hướng dẫn sử dụng iAgree",
      description:
        "Hướng dẫn chi tiết cách sử dụng nền tảng iAgree dành cho freelancer và doanh nghiệp: đăng công việc, tìm ứng viên, ký hợp đồng và thanh toán.",
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
      "@id": `${ConstantConfig.BASE_URL}/huong-dan-su-dung#breadcrumb`,
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
          name: "Hướng dẫn sử dụng",
          item: `${ConstantConfig.BASE_URL}/huong-dan-su-dung`,
        },
      ],
    },
  ],
};

function Component(props: any) {
  const title = "Hướng dẫn sử dụng iAgree";
  const description =
    "Hướng dẫn sử dụng iAgree cho freelancer và doanh nghiệp: cách đăng công việc, tìm ứng viên, ký hợp đồng và thanh toán an toàn.";

  return (
    <>
      <Seo
        title={title}
        description={description}
        canonicalPath="/huong-dan-su-dung"
        ogImage={ConstantConfig.DEFAULT_OG_IMAGE?.[0]?.url}
        jsonLd={HOW_IT_WORKS_JSONLD}
        jsonLdId="jsonld-how-it-works"
      />

      <HowItWorkScreen {...props} />
    </>
  );
}

export default Component;