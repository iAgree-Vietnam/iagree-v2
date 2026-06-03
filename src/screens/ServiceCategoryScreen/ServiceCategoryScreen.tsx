import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Breadcrumb, Typography } from "antd";

import RootLayoutWithFilterCategory from "@/src/layouts/RootLayoutWithFilterCategory";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import {
  JobSelectboxResource,
  FullJobResource,
} from "@/src/data/job/models/job.types";
import HorizontalServicesList from "./components/HorizontalServicesList";
import {
  CategoryResource,
  CateServiceResource,
} from "@/src/data/category/models/category.types";
import usePaginatedJobs from "../JobScreen/hooks/usePaginatedJobs";
import usePaginatedPartners from "../PartnerScreen/hooks/usePaginatedPartners";
import JobsAndPartnersListTab from "./components/JobsAndPartnersListTab";
import { PartnerResource } from "@/src/data/partner/models/partner.types";
import { FullJobResourceV2 } from "@/src/data/job/models/v2/job.types";

const { Text } = Typography;

const per_page = 6;
const initData = { total: 0, items: [] };

interface SearchFilterParams {
  search: string | null;
  categoryIds: number[];
  serviceCategoryIds: number[];
  serviceIds: number[];
}

interface ServiceCategoryScreenProps {
  selectboxResource: JobSelectboxResource;
  categoryId: number;
  serviceCategoryId: number;
  categorySlug: string;
  serviceCategorySlug: string;
  jobFilters?: any;
  partnerFilters?: any;
  serviceIdsFromQuery?: number[]; // thêm prop
}

function ServiceCategoryScreen({
  selectboxResource,
  categoryId,
  serviceCategoryId,
  categorySlug,
  serviceCategorySlug,
  jobFilters,
  partnerFilters,
  serviceIdsFromQuery = [],
}: ServiceCategoryScreenProps) {
  const router = useRouter();

  const [selectedServiceCategoryData, setSelectedServiceCategoryData] =
    useState<CateServiceResource | null>(null);
  const [parentCategoryData, setParentCategoryData] =
    useState<CategoryResource | null>(null);

  // Khởi tạo state filter với serviceIds lấy từ prop nếu có
  const [searchFilters, setSearchFilters] = useState<SearchFilterParams>({
    categoryIds: [categoryId],
    serviceCategoryIds: [serviceCategoryId],
    serviceIds: serviceIdsFromQuery && serviceIdsFromQuery.length > 0 ? serviceIdsFromQuery : [],
    search: null,
  });

  const [jobPage, setJobPage] = useState<number>(1);
  const [partnerPage, setPartnerPage] = useState<number>(1);
  const [activeTabKey, setActiveTabKey] = useState<string>("job");

  const [tempJobs, setTempJobs] = useState<FullJobResourceV2[]>([]);
  const [tempPartners, setTempPartners] = useState<Partial<PartnerResource>[]>([]);

  const memoJobFilters = React.useMemo(
    () => ({
      ...(jobFilters || {}),
      search: searchFilters.search,
      page: jobPage,
      categoryIds: searchFilters.categoryIds,
      categoryServiceIds: searchFilters.serviceCategoryIds,
      serviceIds: searchFilters.serviceIds,
    }),
    [jobFilters, searchFilters, jobPage]
  );

  const memoPartnerFilters = React.useMemo(
    () => ({
      ...(partnerFilters || {}),
      search: searchFilters.search,
      page: partnerPage,
      categoryIds: searchFilters.categoryIds,
      categoryServiceIds: searchFilters.serviceCategoryIds,
      serviceIds: searchFilters.serviceIds,
    }),
    [partnerFilters, searchFilters, partnerPage]
  );

  const jobsQuery = usePaginatedJobs({
    filters: memoJobFilters,
    initData,
    per_page,
  });

  const partnersQuery = usePaginatedPartners({
    filters: memoPartnerFilters,
    initData,
    per_page,
  });

  useEffect(() => {
    const newItems = jobsQuery.data?.items ?? [];
    if (jobPage === 1) {
      setTempJobs(newItems);
    } else if (newItems.length > 0) {
      setTempJobs((prevJobs) => {
        const existingJobIds = new Set(prevJobs.map((job) => job.jobId));
        const uniqueNewJobs = newItems.filter(
          (job) => !existingJobIds.has(job.jobId)
        );
        return [...prevJobs, ...uniqueNewJobs];
      });
    }
  }, [jobsQuery.data?.items, jobPage]);

  useEffect(() => {
    const newItems = partnersQuery.data?.partners ?? [];
    if (partnerPage === 1) {
      setTempPartners(newItems);
    } else if (newItems.length > 0) {
      setTempPartners((prevPartners: any) => {
        const existingPartnerIds = new Set(
          prevPartners.map((partner:PartnerResource) => partner.partnerId)
        );
        const uniqueNewPartners = newItems.filter(
          (partner) => !existingPartnerIds.has(partner.partnerId)
        );
        return [...prevPartners, ...uniqueNewPartners];
      });
    }
  }, [partnersQuery.data?.partners, partnerPage]);

  useEffect(() => {
    if (selectboxResource && categoryId && serviceCategoryId) {
      const foundCategory = selectboxResource?.categories?.find(
        (cat) => cat.categoryId === categoryId
      );

      if (foundCategory) {
        setParentCategoryData(foundCategory);
        const foundServiceCategory = foundCategory?.childrens?.find(
          (serviceCat) => serviceCat.cateServiceId === serviceCategoryId
        );
        setSelectedServiceCategoryData(foundServiceCategory || null);
      } else {
        setSelectedServiceCategoryData(null);
        setParentCategoryData(null);
      }
    } else {
      setSelectedServiceCategoryData(null);
      setParentCategoryData(null);
      setSearchFilters((prev) => ({
        ...prev,
        categoryIds: [categoryId],
        serviceCategoryIds: [serviceCategoryId],
        serviceIds: [],
      }));
    }
  }, [selectboxResource, categoryId, serviceCategoryId]);

  // Đồng bộ nếu props serviceIdsFromQuery thay đổi sau khi mount component
  useEffect(() => {
    if (
      serviceIdsFromQuery &&
      serviceIdsFromQuery.length > 0 &&
      JSON.stringify(serviceIdsFromQuery) !==
        JSON.stringify(searchFilters.serviceIds)
    ) {
      setSearchFilters((prev) => ({
        ...prev,
        serviceIds: serviceIdsFromQuery,
      }));
    }
  }, [serviceIdsFromQuery]);

  useEffect(() => {
    const currentPath = `/category-detail/${categorySlug}/${serviceCategorySlug}`;
    const queryObj: Record<string, any> = {
      type: activeTabKey,
      page: activeTabKey === "job" ? jobPage : partnerPage,
      category_ids: searchFilters.categoryIds.join(","),
      service_category_ids: searchFilters.serviceCategoryIds.join(","),
    };

    if (searchFilters.serviceIds.length > 0) {
      queryObj.service_ids = searchFilters.serviceIds.join(",");
    }

    const searchParams = new URLSearchParams();
    Object.entries(queryObj).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.set(key, String(value));
      }
    });

    const newUrl = `${currentPath}?${searchParams.toString()}`;
    if (router.asPath !== newUrl) {
      router.replace(newUrl, undefined, {
        shallow: true,
      });
    }
  }, [
    activeTabKey,
    jobPage,
    partnerPage,
    searchFilters.serviceIds,
    searchFilters.categoryIds,
    searchFilters.serviceCategoryIds,
    categorySlug,
    serviceCategorySlug,
    router,
  ]);

  const handleSelectedServiceIdsChange = useCallback(
    (newSelectedIds: number[]) => {
      const isSameFilter =
        JSON.stringify(newSelectedIds) ===
        JSON.stringify(searchFilters.serviceIds);
      if (!isSameFilter) {
        setTempJobs([]);
        setTempPartners([]);
        setJobPage(1);
        setPartnerPage(1);
        setSearchFilters((prevFilters) => ({
          ...prevFilters,
          categoryIds: [categoryId],
          serviceCategoryIds: [serviceCategoryId],
          serviceIds: newSelectedIds,
        }));
      }
    },
    [searchFilters.serviceIds, categoryId, serviceCategoryId]
  );

  const handleCollapseJobs = () => setJobPage(1);
  const handleCollapsePartners = () => setPartnerPage(1);

  if (!selectedServiceCategoryData || !parentCategoryData) {
    return (
      <RootLayoutWithFilterCategory>
        <div style={{ padding: "50px", textAlign: "center" }}>
          <Text type="secondary">
            Không tìm thấy thông tin danh mục dịch vụ hoặc dữ liệu chưa sẵn
            sàng.
          </Text>
        </div>
      </RootLayoutWithFilterCategory>
    );
  }

  return (
    <RootLayoutWithFilterCategory>
      <Head>
        <title>
          {selectedServiceCategoryData.name || "Chi tiết Danh mục Dịch vụ"}
        </title>
      </Head>

      <section className={"breadcrumbContainer"} style={{ paddingBottom: 0 }}>
        <div className="contentWrapper">
          <Breadcrumb
            items={[
              {
                title: (
                  <>
                    <IconSvgLocal name={"IC_HOME"} />
                    <span>Trang chủ</span>
                  </>
                ),
                href: "/",
              },
              {
                title: parentCategoryData.name,
                href: `/category-detail/${categorySlug}`,
              },
              {
                title: selectedServiceCategoryData.name,
              },
            ]}
          />
        </div>
      </section>

      <section className={"sectionContainer"}>
        <div className="contentWrapper">
          <Typography.Title
            className={"sectionTitle"}
            level={4}
            style={{ paddingBottom: "20px" }}
          >
            {selectedServiceCategoryData.name}{" "}
          </Typography.Title>

          {selectedServiceCategoryData.childrens &&
          selectedServiceCategoryData.childrens.length > 0 ? (
            <HorizontalServicesList
              services={selectedServiceCategoryData.childrens}
              categoryId={categoryId}
              serviceCategoryId={serviceCategoryId}
              selectedServiceIds={searchFilters.serviceIds}
              onServiceIdsChange={handleSelectedServiceIdsChange}
            />
          ) : (
            <Text type="secondary" style={{ paddingLeft: "16px" }}>
              Hiện chưa có dịch vụ nào trong danh mục này.
            </Text>
          )}

          <div
            style={{
              borderBottom: "0.5px solid #d4d4d4",
              margin: "30px 0",
            }}
          />

          <JobsAndPartnersListTab
            jobsQuery={jobsQuery}
            partnersQuery={partnersQuery as any}
            searchTerm={null}
            setJobPage={setJobPage}
            setPartnerPage={setPartnerPage}
            jobPage={jobPage}
            partnerPage={partnerPage}
            tempJobs={tempJobs}
            tempPartners={tempPartners}
            activeTabKey={activeTabKey}
            setActiveTabKey={setActiveTabKey}
            onCollapseJobs={handleCollapseJobs}
            onCollapsePartners={handleCollapsePartners}
          />
        </div>
      </section>
    </RootLayoutWithFilterCategory>
  );
}

export default ServiceCategoryScreen;
