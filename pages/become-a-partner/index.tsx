import { GetServerSidePropsContext } from "next";
import IntroduceServices from "@/src/data/introduce/services/IntroduceServices";
import { BecomeAPartnerScreen } from "@/src/screens/BecomeAPartnerScreen/BecomeAPartnerScreen";
import Seo from "@/src/components/Seo";
import { ConstantConfig } from "@/src/constants/Config";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const apiRes = await new IntroduceServices().introduce();

  return {
    props: { data: apiRes },
  };
};

const BECOME_PARTNER_JSONLD = {
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
      ],
    },

    // Website (reuse)
    {
      "@type": "WebSite",
      "@id": `${ConstantConfig.BASE_URL}/#website`,
      url: ConstantConfig.BASE_URL,
      name: ConstantConfig.DEFAULT_AUTHOR,
      description: ConstantConfig.DEFAULT_DESCRIPTION,
      publisher: { "@id": `${ConstantConfig.BASE_URL}/#organization` },
      inLanguage: "vi",
    },

    // Become a Partner page
    {
      "@type": "WebPage",
      "@id": `${ConstantConfig.BASE_URL}/become-a-partner#webpage`,
      url: `${ConstantConfig.BASE_URL}/become-a-partner`,
      name: `Trở thành đối tác - ${ConstantConfig.DEFAULT_AUTHOR}`,
      description:
        "Đăng ký trở thành đối tác trên iAgree để tiếp cận khách hàng, nhận dự án phù hợp, quản lý hợp đồng và thanh toán minh bạch, an toàn.",
      isPartOf: { "@id": `${ConstantConfig.BASE_URL}/#website` },
      about: { "@id": `${ConstantConfig.BASE_URL}/#organization` },
      inLanguage: "vi",
    },

    // Breadcrumb
    {
      "@type": "BreadcrumbList",
      "@id": `${ConstantConfig.BASE_URL}/become-a-partner#breadcrumb`,
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
          name: "Trở thành đối tác",
          item: `${ConstantConfig.BASE_URL}/become-a-partner`,
        },
      ],
    },
  ],
};

export default function Component(props: any) {
  const title = "Trở thành đối tác";
  const description =
    "Đăng ký trở thành đối tác trên iAgree để tiếp cận khách hàng, nhận dự án phù hợp, quản lý hợp đồng và thanh toán minh bạch, an toàn.";

  return (
    <>
      <Seo
        title={title}
        description={description}
        canonicalPath="/become-a-partner"
        ogImage={ConstantConfig.DEFAULT_OG_IMAGE?.[0]?.url}
        jsonLd={BECOME_PARTNER_JSONLD}
        jsonLdId="jsonld-become-a-partner"
      />

      <BecomeAPartnerScreen {...props} />
    </>
  );
}
