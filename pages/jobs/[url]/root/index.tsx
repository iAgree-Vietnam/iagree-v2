
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { GetServerSidePropsContext } from "next/types";

import NotFoundPage from "@/pages/404";
import JobDetailScreen from "@/src/screens/JobScreen/JobDetailScreen/JobDetailScreen";
import BackendJobServices from "@/src/data/job/services/BackendJobServices";

import Seo from "@/src/components/Seo";
import { ConstantConfig } from "@/src/constants/Config";

import { size } from "lodash";

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const slug: string | any = context?.query?.url || "";
  const slugList: string[] = slug?.split("-");
  const jobId = slugList.length > 1 ? Number(slugList[size(slugList) - 1]) : 0;

  try {
    const jobDetailResource = await new BackendJobServices(context).getFullInfo(
      jobId
    );

    return {
      props: {
        data: jobDetailResource,
        // Dùng resolvedUrl để canonical đúng cả khi route là /cong-viec/[url]
        resolvedUrl: context.resolvedUrl || "",
      },
    };
  } catch (error: any) {
    return { props: { error: JSON.stringify(error) } };
  }
};

/* =========================
 * Helpers: safe getter
 * ========================= */
const toText = (v: any, fallback = "") =>
  typeof v === "string" && v.trim() ? v.trim() : fallback;

export default function Component(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  if ((props as any).error) return <NotFoundPage />;

  const job = (props as any)?.data;

  // ======= SEO title/description động =======
  const jobName = toText(job?.name, "Công việc freelance");
  const partnerName =
    toText(job?.partner?.name) ||
    toText(job?.partnerName) ||
    toText(job?.companyName) ||
    "";

  const title = partnerName
    ? `${jobName} - ${partnerName}`
    : `${jobName} - iAgree`;

  const description =
    toText(job?.shortDescription) ||
    toText(job?.description) ||
    `Xem chi tiết công việc "${jobName}" trên iAgree: mô tả, yêu cầu, thù lao và cách ứng tuyển.`;

  // Canonical path: lấy từ resolvedUrl (bỏ query string)
  const canonicalPath = (() => {
    const raw = toText((props as any)?.resolvedUrl, "");
    const pathOnly = raw.split("?")[0] || "";
    return pathOnly || "/jobs";
  })();

  // OG image: ưu tiên ảnh job/partner nếu có, fallback default
  const ogImage =
    job?.thumbnail ||
    job?.coverImage ||
    job?.partner?.avatar ||
    ConstantConfig.DEFAULT_OG_IMAGE?.[0]?.url;

  /* =========================
   * JSON-LD: JobPosting + Breadcrumb
   * ========================= */
  const JOB_DETAIL_JSONLD = {
    "@context": "https://schema.org",
    "@graph": [
      // Organization
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
      },

      // Website
      {
        "@type": "WebSite",
        "@id": `${ConstantConfig.BASE_URL}/#website`,
        url: ConstantConfig.BASE_URL,
        name: ConstantConfig.DEFAULT_AUTHOR,
        publisher: { "@id": `${ConstantConfig.BASE_URL}/#organization` },
        inLanguage: "vi",
      },

      // Breadcrumb
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
            name: "Công việc",
            item: `${ConstantConfig.BASE_URL}/jobs`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: jobName,
            item: `${ConstantConfig.BASE_URL}${canonicalPath}`,
          },
        ],
      },

      // JobPosting
      {
        "@type": "JobPosting",
        "@id": `${ConstantConfig.BASE_URL}${canonicalPath}#jobposting`,
        title: jobName,
        description: description,
        url: `${ConstantConfig.BASE_URL}${canonicalPath}`,
        hiringOrganization: {
          "@type": "Organization",
          name: partnerName || ConstantConfig.DEFAULT_AUTHOR,
          url: ConstantConfig.BASE_URL,
        },

        // Optional fields (nếu backend có thì set, không có thì thôi)
        datePosted: job?.createdAt || job?.created_at || undefined,
        validThrough: job?.expiredAt || job?.expired_at || undefined,

        employmentType:
          job?.employmentType ||
          job?.typeName ||
          "CONTRACTOR", // freelance

        // Location (nếu remote thì set jobLocationType)
        jobLocationType:
          job?.isRemote || job?.remote ? "TELECOMMUTE" : undefined,

        // Salary (nếu có)
        baseSalary:
          job?.salary && (job?.salary?.min || job?.salary?.max)
            ? {
                "@type": "MonetaryAmount",
                currency: "VND",
                value: {
                  "@type": "QuantitativeValue",
                  minValue: job?.salary?.min || undefined,
                  maxValue: job?.salary?.max || undefined,
                  unitText: "TOTAL",
                },
              }
            : undefined,
      },
    ],
  };

  // NOTE: JSON.stringify sẽ tự loại undefined khi render jsonLd trong component Seo
  return (
    <>
      <Seo
        title={title}
        description={description}
        canonicalPath={canonicalPath}
        ogImage={ogImage}
        jsonLd={JOB_DETAIL_JSONLD}
        jsonLdId="jsonld-job-detail"
      />

      <JobDetailScreen {...(props as any)} />
    </>
  );
}