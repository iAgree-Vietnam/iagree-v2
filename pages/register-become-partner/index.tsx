import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { GetServerSidePropsContext } from "next/types";

import RegisterBecomePartnerScreen from "@/src/screens/RegisterBecomePartnerScreen/RegisterBecomePartnerScreen";
import Seo from "@/src/components/Seo";
import { ConstantConfig } from "@/src/constants/Config";

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  return {
    props: {},
  };
};

const BECOME_PARTNER_JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${ConstantConfig.BASE_URL}/dang-ky-doi-tac#webpage`,
      url: `${ConstantConfig.BASE_URL}/dang-ky-doi-tac`,
      name: `Đăng ký trở thành đối tác - ${ConstantConfig.DEFAULT_AUTHOR}`,
      description:
        "Đăng ký trở thành đối tác iAgree để tiếp cận khách hàng, quản lý công việc, ký hợp đồng và thanh toán minh bạch trên nền tảng.",
      isPartOf: { "@id": `${ConstantConfig.BASE_URL}/#website` },
      about: { "@id": `${ConstantConfig.BASE_URL}/#organization` },
      inLanguage: "vi",
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${ConstantConfig.BASE_URL}/dang-ky-doi-tac#breadcrumb`,
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
          name: "Đăng ký đối tác",
          item: `${ConstantConfig.BASE_URL}/dang-ky-doi-tac`,
        },
      ],
    },
  ],
};

export default function Component(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const title = "Đăng ký trở thành đối tác";
  const description =
    "Đăng ký trở thành đối tác iAgree để tiếp cận khách hàng, quản lý công việc, ký hợp đồng và thanh toán minh bạch trên nền tảng.";

  return (
    <>
      <Seo
        title={title}
        description={description}
        canonicalPath="/dang-ky-doi-tac"
        ogImage={ConstantConfig.DEFAULT_OG_IMAGE?.[0]?.url}
        jsonLd={BECOME_PARTNER_JSONLD}
        jsonLdId="jsonld-become-partner"
      />

      <RegisterBecomePartnerScreen {...props} />
    </>
  );
}