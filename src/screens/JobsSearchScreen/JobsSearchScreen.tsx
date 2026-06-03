"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button, Input, Row, Typography, Drawer, Col, Spin, List } from "antd";
import RootLayoutWithFilterCategory from "@/src/layouts/RootLayoutWithFilterCategory";
import Head from "next/head";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import usePaginatedJobs from "../JobScreen/hooks/usePaginatedJobs";
import { useRouter } from "next/router";
import { SkillResource } from "@/src/data/skill/models/skill.types";
import { FullJobResource } from "@/src/data/job/models/job.types";
import useWindowWidth from "../SearchScreen/hooks/useWindowWidth";
import NoResultMessages from "../SearchScreen/components/NoResultMessages";
import FilterJobsListComponents from "./components/FilterJobsListComponents";
import JobItem from "@/src/components/jobs/JobItem";
import { ButtonWithDottedLoadingIcon } from "@/src/components/button/ButtonWithDottedLoadingIcon";
import {
  CateServiceResource,
  ServiceResource,
} from "@/src/data/category/models/category.types";
import { FullJobResourceV2 } from "@/src/data/job/models/v2/job.types";
import JobItemV2 from "@/src/components/jobs/JobItemV2";

const initData = {
  total: 0,
  items: [],
};

const STORAGE_KEYS = {
  JOB_FILTERS: "search_job_filters",
  JOB_PAGE: "search_job_page",
};

const per_page = 6;
const CUSTOM_BREAKPOINT = 1200;

const DEFAULT_FILTERS = {
  categoryIds: [],
  skillIds: [],
  serviceCategoryIds: [],
  serviceIds: [],
  search: null,
  salaryType: undefined,
  priceMin: undefined,
  priceMax: undefined,
  postingEndDate: undefined,
  postedDateRange: undefined,
};

function JobsSearchScreen(props: {
  jobFilters: any;
  skills: SkillResource[];
  serviceCategories: CateServiceResource[];
  services: ServiceResource[];
}) {
  // Initialize filters and page from localStorage
  // const [searchFilters, setSearchFilters] = useState<any>(() => {
  //   if (typeof localStorage !== "undefined") {
  //     const storedFilters = localStorage.getItem(STORAGE_KEYS.JOB_FILTERS);
  //     return storedFilters
  //       ? JSON.parse(storedFilters)
  //       : DEFAULT_FILTERS;
  //   }

  //   return DEFAULT_FILTERS;
  // });
  const [searchFilters, setSearchFilters] = useState<any>(DEFAULT_FILTERS);

  const [inputSearch, setInputSearch] = useState<string>(
    props.jobFilters.search || ""
  );
  const [searchTerm, setSearch] = useState<string | null>(inputSearch);
  const [jobPage, setJobPage] = useState<number>(props.jobFilters.page || 1);
  const [tempJobs, setTempJobs] = useState<FullJobResourceV2[]>([]);

  const [sidebarDrawerVisible, setSidebarDrawerVisible] = useState(false);

  const windowWidth = useWindowWidth();
  const isMobileOrTablet =
    windowWidth !== undefined && windowWidth <= CUSTOM_BREAKPOINT;
  const isDesktop =
    windowWidth === undefined || windowWidth > CUSTOM_BREAKPOINT;

  // Reset to page 1 when filters are changed
  const setDefaultJobPageWhenFilter = useCallback(() => {
    setJobPage(1);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const storedFilters = window.localStorage.getItem(
        STORAGE_KEYS.JOB_FILTERS
      );
      const storedPage = window.localStorage.getItem(STORAGE_KEYS.JOB_PAGE);

      if (storedFilters) {
        const parsed = JSON.parse(storedFilters);
        setSearchFilters((prev: any) => ({
          ...prev,
          ...parsed,
        }));
      }

      if (storedPage) {
        const pageNum = Number(storedPage);
        if (!Number.isNaN(pageNum) && pageNum > 0) {
          setJobPage(pageNum);
        }
      }
    } catch (err) {
      console.error("Failed to restore job filters from localStorage", err);
    }
  }, []);

  const jobsQuery = usePaginatedJobs({
    filters: {
      ...props.jobFilters,
      search: searchTerm,
      page: jobPage,
      categoryIds: searchFilters?.categoryIds,
      skillIds: searchFilters?.skillIds,
      categoryServiceIds: searchFilters?.serviceCategoryIds,
      serviceIds: searchFilters?.serviceIds,
      salaryId: searchFilters?.salaryType,
      priceMin: searchFilters?.priceMin,
      priceMax: searchFilters?.priceMax,
      postingEndDate: searchFilters?.postingEndDate,
      postedDateRange: searchFilters?.postedDateRange,
    },
    initData,
    per_page,
  });

  useEffect(() => {
    const filteredJobs = jobsQuery.data?.items ?? [];

    if (jobPage === 1) {
      setTempJobs(filteredJobs);
    } else {
      const newItems = filteredJobs;
      if (newItems.length > 0) {
        setTempJobs((prevJobs) => {
          const existingJobIds = new Set(prevJobs.map((job) => job.jobId));
          const uniqueNewJobs = newItems.filter(
            (job) => !existingJobIds.has(job.jobId)
          );
          return [...prevJobs, ...uniqueNewJobs];
        });
      }
    }
  }, [jobsQuery.data?.items, jobPage]);

  const onLoadMoreJob = () => {
    if (
      !jobsQuery.isFetching &&
      jobPage < Math.ceil((jobsQuery.data?.total || 0) / per_page)
    ) {
      setJobPage(jobPage + 1);
    }
  };

  // Save filters and page number to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        STORAGE_KEYS.JOB_FILTERS,
        JSON.stringify(searchFilters)
      );
      localStorage.setItem(STORAGE_KEYS.JOB_PAGE, String(jobPage));
    }
  }, [searchFilters, jobPage]);

  // Update URL (queryParams) when filters or page change
  // useEffect(() => {
  //   const currentParams: Record<string, any> = {
  //     search: searchTerm || undefined,
  //   };

  //   if (searchFilters.categoryIds.length > 0)
  //     currentParams.category_ids = searchFilters.categoryIds.join(",");
  //   if (searchFilters.skillIds.length > 0)
  //     currentParams.skill_ids = searchFilters.skillIds.join(",");
  //   if (searchFilters.serviceCategoryIds.length > 0)
  //     currentParams.service_category_ids =
  //       searchFilters.serviceCategoryIds.join(",");
  //   if (searchFilters.serviceIds.length > 0)
  //     currentParams.service_ids = searchFilters.serviceIds.join(",");
  //   if (searchFilters.salaryType !== undefined)
  //     currentParams.salary_type = searchFilters.salaryType;
  //   if (searchFilters.priceMin !== undefined)
  //     currentParams.price_min = searchFilters.priceMin;
  //   if (searchFilters.priceMax !== undefined)
  //     currentParams.price_max = searchFilters.priceMax;
  //   if (searchFilters.postingEndDate !== undefined)
  //     currentParams.posting_end_date = searchFilters.postingEndDate;
  //   if (searchFilters.postedDateRange !== undefined)
  //     currentParams.posted_date_range = searchFilters.postedDateRange;

  //   if (jobPage > 1) currentParams.page = jobPage;

  //   const filteredParams: Record<string, any> = {};
  //   Object.entries(currentParams).forEach(([key, value]) => {
  //     if (
  //       value !== undefined &&
  //       value !== null &&
  //       !(Array.isArray(value) && value.length === 0)
  //     ) {
  //       filteredParams[key] = value;
  //     }
  //   });

  //   router.replace(
  //     { pathname: router.pathname, query: filteredParams },
  //     undefined,
  //     { shallow: true }
  //   );
  // }, [searchTerm, searchFilters, jobPage]);

  // Count filters
  const totalSelectedFilters = (() => {
    let total = 0;
    if (searchFilters.categoryIds) total += searchFilters.categoryIds.length;
    if (searchFilters.skillIds) total += searchFilters.skillIds.length;
    if (searchFilters.serviceCategoryIds)
      total += searchFilters.serviceCategoryIds.length;
    if (searchFilters.serviceIds) total += searchFilters.serviceIds.length;
    if (searchFilters.salaryType !== undefined) total += 1;
    if (
      searchFilters.priceMin !== undefined ||
      searchFilters.priceMax !== undefined
    )
      total += 1;
    if (searchFilters.postingEndDate !== undefined) total += 1;
    if (searchFilters.postedDateRange !== undefined) total += 1;
    return total;
  })();

  function goSearch() {
    if (inputSearch !== searchTerm) {
      setSearch(inputSearch);
      setDefaultJobPageWhenFilter();
      setTempJobs([]);
    }
  }

  const JobListContent = () => {
    return (
      <>
        {tempJobs && tempJobs.length > 0 ? (
          <List
            loading={jobsQuery.isFetching && jobPage === 1}
            dataSource={tempJobs}
            loadMore={
              jobPage < Math.ceil((jobsQuery?.data?.total || 0) / per_page) && (
                <Row justify="center" className="loadMoreWrapper">
                  <ButtonWithDottedLoadingIcon
                    icon={
                      <IconSvgLocal
                        name="IC_ARROW_RIGHT"
                        width={26}
                        height={9}
                      />
                    }
                    iconPosition="end"
                    onClick={onLoadMoreJob}
                    loading={jobsQuery.isFetching}
                    disabled={jobsQuery.isFetching}
                  >
                    Tải thêm
                  </ButtonWithDottedLoadingIcon>
                </Row>
              )
            }
            grid={{ gutter: 24, xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 3 }}
            className="jobListContainer"
            renderItem={(item) => (
              // <List.Item className="jobItemWrapper">
              //   {/* <JobItem data={item} /> */}
              //   <JobItemV2 key={item.jobId} data={item} />
              // </List.Item>
              <List.Item
              style={{
                height: "100%",
                display: "flex",
                alignItems: "stretch",

              }}
              className="jobItemWrapper"
            >
              <div style={{ display: "flex", flex: 1 }}>
                {/* <JobItem data={item} /> */}
                <JobItemV2 key={item.jobId} data={item} />
              </div>
            </List.Item>
            )}
          />
        ) : jobsQuery.isFetching ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 200,
              flexDirection: "column",
              gap: 16,
            }}
          >
            <Spin size="large" />
            <Typography.Text>Đang tải danh sách Công việc...</Typography.Text>
          </div>
        ) : (
          <NoResultMessages searchTerm={searchTerm} type="công việc" />
        )}
      </>
    );
  };

  return (
    <RootLayoutWithFilterCategory>
      <Head>
        <title>Tìm kiếm Công việc</title>
      </Head>
      <section className="sectionContainer searchSectionContainer">
        <div className="contentWrapper">
          <Typography.Title level={3} className="text-center">
            Tìm kiếm Công việc
          </Typography.Title>
          <Row className="searchContainer" justify="center">
            <Input
              value={inputSearch || ""}
              onChange={(e) => setInputSearch(e.target.value)}
              onPressEnter={goSearch}
              size="large"
              placeholder="Hãy để chúng tôi tìm kiếm công việc giúp bạn !"
              suffix={
                <Button
                  type="primary"
                  size="middle"
                  onClick={goSearch}
                  className="btnSearch"
                >
                  <IconSvgLocal
                    name="IC_SEARCH"
                    width={20}
                    height={20}
                    fill="#FFFFFF"
                  />
                </Button>
              }
              className="searchInput"
            />
          </Row>
        </div>
      </section>

      <Row
        style={{ maxWidth: "100%", margin: "0 auto", padding: "0 30px" }}
        gutter={isDesktop ? [20, 24] : undefined}
        wrap={isMobileOrTablet}
      >
        {isDesktop && (
          <Col style={{ flex: "0 0 300px", marginLeft: "20px" }}>
            <section className="sectionContainer" style={{ paddingTop: 0 }}>
              <div className="contentWrapper">
                <FilterJobsListComponents
                  serviceCategories={props.serviceCategories}
                  services={props.services}
                  skills={props.skills}
                  filters={searchFilters}
                  setJobPage={setJobPage}
                  setFilters={setSearchFilters}
                  setJobsList={setTempJobs}
                />
              </div>
            </section>
          </Col>
        )}

        <Col flex="auto" style={{ minWidth: 0 }}>
          <div className="contentWrapperSearch" style={{ minHeight: "auto" }}>
            <Row justify="space-between" align="top">
              <Typography.Title
                style={{
                  marginBottom: 10,
                  fontWeight: "400",
                  fontSize: "22px",
                }}
              >
                Công việc
              </Typography.Title>
            </Row>
            <section
              className="sectionContainer"
              style={{ padding: "0px 0px", paddingBottom: "40px" }}
            >
              <div className="contentWrapperSearch" style={{ minHeight: 200 }}>
                {JobListContent()}
              </div>
            </section>
          </div>
        </Col>
      </Row>

      <Drawer
        title="Bộ lọc tìm kiếm"
        placement="left"
        onClose={() => setSidebarDrawerVisible(false)}
        open={sidebarDrawerVisible}
      >
        <FilterJobsListComponents
          serviceCategories={props.serviceCategories}
          services={props.services}
          skills={props.skills}
          filters={searchFilters}
          setJobPage={setJobPage}
          setFilters={setSearchFilters}
          setJobsList={setTempJobs}
        />
      </Drawer>
    </RootLayoutWithFilterCategory>
  );
}

export default JobsSearchScreen;
