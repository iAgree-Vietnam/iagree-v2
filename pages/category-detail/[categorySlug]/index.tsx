import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { GetServerSidePropsContext } from "next/types";

import NotFoundPage from "@/pages/404";
import CategoryDetailScreen from "@/src/screens/CategoryDetailScreen/CategoryDetailScreen";
import JobServices from "@/src/data/job/services/JobServices";
import { JobSelectboxResource } from "@/src/data/job/models/job.types";
import { CategoryResource } from "@/src/data/category/models/category.types";
import StringUtils from "@/src/utils/StringUtils";

type SuccessProps = {
  selectboxResource: JobSelectboxResource;
  categoryId: number;
  selectedCategorySlug: string;
};

type ErrorProps = {
  error: string;
};

type PageProps = SuccessProps | ErrorProps;

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context: GetServerSidePropsContext
) => {
  const { categorySlug } = context.query;
  const slug = Array.isArray(categorySlug)
    ? categorySlug[0]
    : categorySlug || "";

  if (!slug) {
    return { notFound: true };
  }

  try {
    const jobDetailResource = await new JobServices().getSelectBoxes();
    const selectboxData: JobSelectboxResource =
      jobDetailResource as JobSelectboxResource;

    const foundCategory: CategoryResource | undefined =
      selectboxData?.categories?.find((cat) => {
        const categoryNameSlug = StringUtils.slugify(cat.name);
        return categoryNameSlug === categorySlug;
      });

    if (!foundCategory) {
      return { notFound: true };
    }

    return {
      props: {
        selectboxResource: selectboxData,
        categoryId: foundCategory.categoryId,
        selectedCategorySlug: slug,
      },
    };
  } catch (error: any) {
    console.error("Error fetching data in getServerSideProps:", error);
    return { props: { error: JSON.stringify(error) } };
  }
};

export default function Component(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  if ("error" in props && props.error) {
    return <NotFoundPage />;
  }

  return <CategoryDetailScreen {...(props as SuccessProps)} />;
}
