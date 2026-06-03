import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { GetServerSidePropsContext } from "next/types";

import NotFoundPage from "@/pages/404";
import JobServices from "@/src/data/job/services/JobServices";
import { JobSelectboxResource } from "@/src/data/job/models/job.types";
import StringUtils from "@/src/utils/StringUtils";
import {
  CategoryResource,
  CateServiceResource,
} from "@/src/data/category/models/category.types";
import ServiceCategoryScreen from "@/src/screens/ServiceCategoryScreen/ServiceCategoryScreen";

type ServiceCategorySuccessProps = {
  selectboxResource: JobSelectboxResource;
  categoryId: number;
  serviceCategoryId: number;
  categorySlug: string;
  serviceCategorySlug: string;
  serviceIdsFromQuery: number[]; // thêm prop mới
};

type ServiceCategoryErrorProps = {
  error: string;
};

type ServiceCategoryPageProps =
  | ServiceCategorySuccessProps
  | ServiceCategoryErrorProps;

export const getServerSideProps: GetServerSideProps<
  ServiceCategoryPageProps
> = async (context: GetServerSidePropsContext) => {
  const { categorySlug, serviceCategorySlug, serviceIds } = context.query;

  const mainCategorySlug = Array.isArray(categorySlug)
    ? categorySlug[0]
    : categorySlug || "";
  const subCategorySlug = Array.isArray(serviceCategorySlug)
    ? serviceCategorySlug[0]
    : serviceCategorySlug || "";

  if (!mainCategorySlug || !subCategorySlug) {
    return { notFound: true };
  }

  // Lấy serviceIds từ query param nếu có
  const serviceIdsParam = serviceIds;
  const serviceIdsFromQuery = serviceIdsParam
    ? (Array.isArray(serviceIdsParam) ? serviceIdsParam[0] : serviceIdsParam)
        .split(",")
        .map((idStr) => parseInt(idStr, 10))
        .filter((id) => !isNaN(id))
    : [];

  try {
    const jobDetailResource = await new JobServices().getSelectBoxes();
    const selectboxData: JobSelectboxResource =
      jobDetailResource as JobSelectboxResource;

    const foundMainCategory: CategoryResource | undefined =
      selectboxData?.categories?.find(
        (cat) => StringUtils.slugify(cat.name) === mainCategorySlug
      );

    if (!foundMainCategory) {
      return { notFound: true };
    }

    const foundServiceCategory: CateServiceResource | undefined =
      foundMainCategory.childrens?.find(
        (serviceCat) => StringUtils.slugify(serviceCat.name) === subCategorySlug
      );

    if (!foundServiceCategory) {
      return { notFound: true };
    }

    return {
      props: {
        selectboxResource: selectboxData,
        categoryId: foundMainCategory.categoryId,
        serviceCategoryId: foundServiceCategory.cateServiceId,
        categorySlug: mainCategorySlug,
        serviceCategorySlug: subCategorySlug,
        serviceIdsFromQuery, // truyền serviceIds từ query
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

  return <ServiceCategoryScreen {...(props as ServiceCategorySuccessProps)} />;
}
