
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";

import JobsSearchScreen from "@/src/screens/JobsSearchScreen/JobsSearchScreen";
import { JobParseUtils } from "@/src/data/job/utils/JobParseUtils";

import Seo from "@/src/components/Seo";
import { ConstantConfig } from "@/src/constants/Config";

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  return {
    props: {
      jobFilters: JobParseUtils.jobQueries(context.query),
      query: context.query,
    },
  };
};

export default function Component(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { jobFilters, query } = props;

  /**
   * ===== SEO DYNAMIC =====
   */
  const keyword = query?.keyword || query?.q;
  const category = query?.category;

  const title = keyword
    ? `Việc làm ${keyword} | iAgree`
    : category
    ? `Việc làm ${category} | iAgree`
    : "Tìm kiếm công việc freelance | iAgree";

  const description = keyword
    ? `Danh sách công việc freelance ${keyword} mới nhất, cập nhật liên tục trên iAgree.`
    : "Tìm kiếm công việc freelance theo ngành nghề, kỹ năng, mức lương và hình thức làm việc trên iAgree.";

  /**
   * Canonical: giữ query có ý nghĩa SEO
   */
  const canonicalPath = Object.keys(query || {}).length
    ? `/jobs?${new URLSearchParams(query as any).toString()}`
    : "/jobs";

  return (
    <>
      <Seo
        title={title}
        description={description}
        canonicalPath={canonicalPath}
        ogImage={ConstantConfig.DEFAULT_OG_IMAGE?.[0]?.url}
        
      />

      <JobsSearchScreen {...(props as any)} />
    </>
  );
}