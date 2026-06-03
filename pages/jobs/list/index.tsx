
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { GetServerSidePropsContext } from "next/types";

import BackendJobServices from "@/src/data/job/services/BackendJobServices";
import JobsListScreen from "@/src/screens/JobScreen/JobsListScreen/JobsListScreen";

import Seo from "@/src/components/Seo";
import { ConstantConfig } from "@/src/constants/Config";

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const apiRes = await new BackendJobServices(context).get({});

  return {
    props: {
      data: apiRes,
    },
  };
};

/* =========================
 * JSON-LD: JOBS LIST PAGE
 * ========================= */
const JOBS_LIST_JSONLD = {
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

    // Jobs list page
    {
      "@type": "CollectionPage",
      "@id": `${ConstantConfig.BASE_URL}/jobs#webpage`,
      url: `${ConstantConfig.BASE_URL}/jobs`,
      name: "Danh sách công việc freelance",
      description:
        "Danh sách công việc freelance mới nhất trên iAgree. Freelancer tìm việc dễ dàng, doanh nghiệp đăng việc nhanh chóng và minh bạch.",
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
      "@id": `${ConstantConfig.BASE_URL}/jobs#breadcrumb`,
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
          name: "Công việc",
          item: `${ConstantConfig.BASE_URL}/jobs`,
        },
      ],
    },
  ],
};

export default function Component(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const title = "Công việc freelance";
  const description =
    "Danh sách công việc freelance trên iAgree. Cập nhật liên tục các cơ hội việc làm mới, minh bạch và rõ ràng cho freelancer.";

  return (
    <>
      <Seo
        title={title}
        description={description}
        canonicalPath="/jobs"
        ogImage={ConstantConfig.DEFAULT_OG_IMAGE?.[0]?.url}
        jsonLd={JOBS_LIST_JSONLD}
        jsonLdId="jsonld-jobs-list"
      />

      <JobsListScreen {...(props as any)} />
    </>
  );
}