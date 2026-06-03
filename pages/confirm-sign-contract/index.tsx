
import { GetServerSidePropsContext } from "next/types";
import CookieUtils from "@/src/utils/CookieUtils";

import ContractConfirmScreen from "@/src/screens/ContractScreen/ContractConfirmScreen/ContractConfirmScreen";
import Seo from "@/src/components/Seo";
import { ConstantConfig } from "@/src/constants/Config";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  // Nếu sau này bắt buộc login thì bật lại
  // if (!CookieUtils.hasAccessToken(context)) {
  //   return {
  //     redirect: {
  //       destination: "/",
  //       permanent: false,
  //     },
  //   };
  // }

  return {
    props: {},
  };
};

/* =========================
 * JSON-LD: CONTRACT CONFIRM
 * ========================= */
const CONTRACT_CONFIRM_JSONLD = {
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

    // Contract confirm page
    {
      "@type": "WebPage",
      "@id": `${ConstantConfig.BASE_URL}/xac-nhan-ky-duyet#webpage`,
      url: `${ConstantConfig.BASE_URL}/xac-nhan-ky-duyet`,
      name: "Xác nhận yêu cầu ký duyệt hợp đồng",
      description:
        "Trang xác nhận yêu cầu ký duyệt hợp đồng, hỗ trợ kiểm tra thông tin, xác nhận nội dung và hoàn tất quy trình ký kết trên nền tảng iAgree.",
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
      "@id": `${ConstantConfig.BASE_URL}/xac-nhan-ky-duyet#breadcrumb`,
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
          name: "Xác nhận ký duyệt",
          item: `${ConstantConfig.BASE_URL}/xac-nhan-ky-duyet`,
        },
      ],
    },
  ],
};

function Component(props: any) {
  const title = "Xác nhận yêu cầu ký duyệt hợp đồng";
  const description =
    "Xác nhận yêu cầu ký duyệt hợp đồng trên iAgree, giúp freelancer và doanh nghiệp hoàn tất quy trình ký kết nhanh chóng, minh bạch và an toàn.";

  return (
    <>
      <Seo
        title={title}
        description={description}
        canonicalPath="/xac-nhan-ky-duyet"
        ogImage={ConstantConfig.DEFAULT_OG_IMAGE?.[0]?.url}
        jsonLd={CONTRACT_CONFIRM_JSONLD}
        jsonLdId="jsonld-contract-confirm"
      />

      <ContractConfirmScreen {...props} />
    </>
  );
}

export default Component;