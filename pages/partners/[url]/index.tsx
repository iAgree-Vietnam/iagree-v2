import {
    GetServerSideProps,
    InferGetServerSidePropsType,
  } from "next";
  import { GetServerSidePropsContext } from "next/types";
  
  import PartnerDetailScreen from "@/src/screens/PartnerScreen/PartnerDetailScreen/PartnerDetailScreen";
  import BackendPartnerServices from "@/src/data/partner/services/BackendPartnerServices";
  
  import Seo from "@/src/components/Seo";
  import { ConstantConfig } from "@/src/constants/Config";
import ValidatorUtils from "@/src/utils/ValidatorUtils";
  
  export const getServerSideProps: GetServerSideProps = async (
    context: GetServerSidePropsContext
  ) => {
    const slug: string | any = context?.query?.url || "";
    const slugList: string[] = slug?.split(".");
    const partnerId = slugList.length > 1 ? Number(slugList[1]) : 0;

    const apiRes = await new BackendPartnerServices(context).getFullInfo(
      partnerId
    );

    return {
      props: {
        data: ValidatorUtils.removeEmptyFields(apiRes),
      },
    };
  };
  
  export default function Component(
    props: InferGetServerSidePropsType<typeof getServerSideProps>
  ) {
    const partner = props?.data;
  
    const partnerName = partner?.name || "Đối tác";
    const title = `${partnerName} | Đối tác trên iAgree`;
    const description =
      partner?.shortDescription ||
      `Thông tin hồ sơ, lĩnh vực hoạt động và đánh giá của đối tác ${partnerName} trên nền tảng iAgree.`;
  
    const canonicalPath = `/doi-tac/${partner?.slug}.${partner?.id}`;
  
    /**
     * ===== JSON-LD ORGANIZATION =====
     */
    const PARTNER_DETAIL_JSONLD = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": `${ConstantConfig.BASE_URL}${canonicalPath}#organization`,
          name: partnerName,
          url: `${ConstantConfig.BASE_URL}${canonicalPath}`,
          logo: partner?.logo
            ? {
                "@type": "ImageObject",
                url: partner.logo,
              }
            : {
                "@type": "ImageObject",
                url: `${ConstantConfig.BASE_URL}${ConstantConfig.DEFAULT_LOGO}`,
              },
          description: description,
          sameAs: partner?.socialLinks?.length
            ? partner.socialLinks
            : undefined,
          address: partner?.address
            ? {
                "@type": "PostalAddress",
                streetAddress: partner.address,
                addressCountry: "VN",
              }
            : undefined,
        },
  
        {
          "@type": "WebPage",
          "@id": `${ConstantConfig.BASE_URL}${canonicalPath}#webpage`,
          url: `${ConstantConfig.BASE_URL}${canonicalPath}`,
          name: title,
          isPartOf: {
            "@id": `${ConstantConfig.BASE_URL}/#website`,
          },
          about: {
            "@id": `${ConstantConfig.BASE_URL}${canonicalPath}#organization`,
          },
          inLanguage: "vi",
        },
  
        {
          "@type": "BreadcrumbList",
          "@id": `${ConstantConfig.BASE_URL}${canonicalPath}#breadcrumb`,
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
              name: "Đối tác",
              item: `${ConstantConfig.BASE_URL}/doi-tac`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: partnerName,
              item: `${ConstantConfig.BASE_URL}${canonicalPath}`,
            },
          ],
        },
      ],
    };
  
    return (
      <>
        <Seo
          title={title}
          description={description}
          canonicalPath={canonicalPath}
          ogImage={
            partner?.thumbnail ||
            ConstantConfig.DEFAULT_OG_IMAGE?.[0]?.url
          }
          jsonLd={PARTNER_DETAIL_JSONLD}
          jsonLdId="jsonld-partner-detail"
        />
  
        <PartnerDetailScreen {...(props as any)} />
      </>
    );
  }