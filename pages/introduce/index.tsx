
import { GetServerSidePropsContext } from "next/types";

import { IntroduceScreen } from "@/src/screens/IntroduceScreen/IntroduceScreen";
import Seo from "@/src/components/Seo";
import { ConstantConfig } from "@/src/constants/Config";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  // Hiện tại page này không cần fetch data
  // const apiRes = await new IntroduceServices().introduce();

  return {
    props: {
      data: null,
    },
  };
};

/* =========================
 * JSON-LD: INTRODUCE / ABOUT US
 * ========================= */
const INTRODUCE_JSONLD = {
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
      sameAs: [
        ConstantConfig.SOCIAL_LINKS.facebook,
        ConstantConfig.SOCIAL_LINKS.instagram,
        ConstantConfig.SOCIAL_LINKS.tiktok,
        ConstantConfig.SOCIAL_LINKS.linkedin,
      ],
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

    // Introduce page
    {
      "@type": "AboutPage",
      "@id": `${ConstantConfig.BASE_URL}/gioi-thieu#webpage`,
      url: `${ConstantConfig.BASE_URL}/gioi-thieu`,
      name: "Giới thiệu iAgree",
      description:
        "Giới thiệu về iAgree – nền tảng kết nối freelancer và doanh nghiệp, cung cấp giải pháp đăng việc, quản lý hợp đồng, thanh toán và biểu mẫu pháp lý an toàn.",
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
      "@id": `${ConstantConfig.BASE_URL}/gioi-thieu#breadcrumb`,
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
          name: "Giới thiệu",
          item: `${ConstantConfig.BASE_URL}/gioi-thieu`,
        },
      ],
    },
  ],
};

function Component(props: any) {
  const title = "Giới thiệu iAgree";
  const description =
    "iAgree là nền tảng kết nối freelancer và doanh nghiệp, hỗ trợ đăng công việc, tìm ứng viên, quản lý hợp đồng, thanh toán và biểu mẫu pháp lý minh bạch, an toàn.";

  return (
    <>
      <Seo
        title={title}
        description={description}
        canonicalPath="/gioi-thieu"
        ogImage={ConstantConfig.DEFAULT_OG_IMAGE?.[0]?.url}
        jsonLd={INTRODUCE_JSONLD}
        jsonLdId="jsonld-introduce"
      />

      <IntroduceScreen {...props} />
    </>
  );
}

export default Component;