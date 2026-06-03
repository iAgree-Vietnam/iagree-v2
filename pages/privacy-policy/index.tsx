import { GetServerSidePropsContext } from "next/types";

import BackendPrivacyPolicyServices from "@/src/data/privacy-policy/services/BackendPrivacyPolicyServices";
import PrivacyPolicyScreen from "@/src/screens/PrivacyPolicyScreen/PrivacyPolicyScreen";

import Seo from "@/src/components/Seo";
import { ConstantConfig } from "@/src/constants/Config";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const res = await new BackendPrivacyPolicyServices(context).get();

  return {
    props: {
      data: res,
    },
  };
};

const PRIVACY_POLICY_JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${ConstantConfig.BASE_URL}/chinh-sach-bao-mat#webpage`,
      url: `${ConstantConfig.BASE_URL}/chinh-sach-bao-mat`,
      name: `Chính sách bảo mật - ${ConstantConfig.DEFAULT_AUTHOR}`,
      description:
        "Chính sách bảo mật của iAgree quy định cách thu thập, sử dụng và bảo vệ thông tin cá nhân của người dùng khi sử dụng nền tảng.",
      isPartOf: { "@id": `${ConstantConfig.BASE_URL}/#website` },
      about: { "@id": `${ConstantConfig.BASE_URL}/#organization` },
      inLanguage: "vi",
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${ConstantConfig.BASE_URL}/chinh-sach-bao-mat#breadcrumb`,
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
          name: "Chính sách bảo mật",
          item: `${ConstantConfig.BASE_URL}/chinh-sach-bao-mat`,
        },
      ],
    },
  ],
};

function Component(props: any) {
  const title = "Chính sách bảo mật";
  const description =
    "Chính sách bảo mật của iAgree quy định cách thu thập, sử dụng và bảo vệ thông tin cá nhân của người dùng khi sử dụng nền tảng.";

  return (
    <>
      <Seo
        title={title}
        description={description}
        canonicalPath="/chinh-sach-bao-mat"
        ogImage={ConstantConfig.DEFAULT_OG_IMAGE?.[0]?.url}
        jsonLd={PRIVACY_POLICY_JSONLD}
        jsonLdId="jsonld-privacy-policy"
      />

      <PrivacyPolicyScreen {...props} />
    </>
  );
}

export default Component;