import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Button,
  Input,
  Row,
  Typography,
  Drawer,
  Col,
  Spin,
  Pagination,
  Select,
} from "antd";

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
import { includes, map, toPairs } from "lodash";
import {
  CateServiceResource,
  ServiceResource,
} from "@/src/data/category/models/category.types";
import Constants from "@/src/constants/Constants";
import { useBreakpoint } from "@/src/hooks/useBreakpoint";
import ArrayUtils from "@/src/utils/ArrayUtils";
import { FullJobResourceV2 } from "@/src/data/job/models/v2/job.types";
import JobItemV2 from "@/src/components/jobs/JobItemV2";

const initData = {
  total: 0,
  items: [],
};

export type JobSearchFilterParams = {
  search?: string | null;
  categoryIds: number[];
  skillIds: number[];
  serviceCategoryIds: number[];
  serviceIds: number[];
  salaryType?: number;
  priceMin?: number;
  priceMax?: number;
  postingEndDate?: string;
  postedDateRange?: string;
};

type SortOrder = Record<"price" | "created_at", "asc" | "desc">;

const per_page = 6;
const CUSTOM_BREAKPOINT = 1200;

function JobsSearchScreenV2(props: {
  jobFilters: any;
  skills: SkillResource[];
  serviceCategories: CateServiceResource[];
  services: ServiceResource[];
}) {
  const router = useRouter();
  const { isMobile } = useBreakpoint();
  const [searchFilters, setSearchFilters] = useState<JobSearchFilterParams>({
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
  });

  const [inputSearch, setInputSearch] = useState<string>(
    props.jobFilters.search || ""
  );
  const [searchTerm, setSearch] = useState<string | null>(inputSearch);
  const [jobPage, setJobPage] = useState<number>(props.jobFilters.page || 1);
  const [tempJobs, setTempJobs] = useState<FullJobResourceV2[]>([]);

  const [sidebarDrawerVisible, setSidebarDrawerVisible] = useState(false);
  const [sortField, setSortField] = useState<"created_at" | "price">(
    "created_at"
  );
  const [sortOrder, setSortOrder] = useState<SortOrder>({
    price: "asc",
    created_at: "asc",
  });

  const handleFieldChange = (value: "created_at" | "price") => {
    setSortField(value);
  };

  const handleOrderChange = (value: string) => {
    setSortOrder({
      ...sortOrder,
      [sortField]: value,
    });
  };
  const windowWidth = useWindowWidth();

  const isMobileOrTablet =
    windowWidth !== undefined && windowWidth <= CUSTOM_BREAKPOINT;
  const isDesktop =
    windowWidth === undefined || windowWidth > CUSTOM_BREAKPOINT;

  const setDefaultJobPageWhenFilter = useCallback(() => {
    setJobPage(1);
  }, []);

  const jobsQuery = usePaginatedJobs({
    filters: {
      ...props.jobFilters,
      search: searchTerm,
      page: jobPage,
      categoryIds: searchFilters.categoryIds,
      skillIds: searchFilters.skillIds,
      categoryServiceIds: searchFilters.serviceCategoryIds,
      serviceIds: searchFilters.serviceIds,
      salaryId: searchFilters.salaryType,
      priceMin: searchFilters.priceMin,
      priceMax: searchFilters.priceMax,
      postingEndDate: searchFilters.postingEndDate,
      postedDateRange: searchFilters.postedDateRange,
      locationId: undefined,
      accountType: undefined,
      languageIds: [],
      // statusList: [
      //   Constants.JOB.STATUS.DUYET_DANG_TUYEN,
      //   Constants.JOB.STATUS.CHO_UNG_TUYEN,
      // ],
    },
    sort: map(toPairs(sortOrder), ([key, value]) => `${key}:${value}`),
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

          // return [...prevJobs, ...uniqueNewJobs];
          return uniqueNewJobs;
        });
      }
    }
  }, [JSON.stringify(jobsQuery.data?.items), jobPage]);

  function goSearch() {
    if (
      inputSearch !== searchTerm ||
      JSON.stringify(searchFilters) !== JSON.stringify(props.jobFilters)
    ) {
      setSearch(inputSearch);
      setDefaultJobPageWhenFilter();
      setTempJobs([]);
    }
  }

  const onLoadMoreJob = (type = "prev") => {
    if (includes(type, "prev")) {
      setJobPage(jobPage - 1);
    } else {
      setJobPage(jobPage + 1);
    }
  };

  useEffect(() => {
    const currentParams: Record<string, any> = {
      search: searchTerm || undefined,
    };

    if (searchFilters.categoryIds.length > 0) {
      currentParams.category_ids = searchFilters.categoryIds.join(",");
    }
    if (searchFilters.skillIds.length > 0) {
      currentParams.skill_ids = searchFilters.skillIds.join(",");
    }
    if (searchFilters.serviceCategoryIds.length > 0) {
      currentParams.service_category_ids =
        searchFilters.serviceCategoryIds.join(",");
    }
    if (searchFilters.serviceIds.length > 0) {
      currentParams.service_ids = searchFilters.serviceIds.join(",");
    }
    if (searchFilters.salaryType !== undefined) {
      currentParams.salary_type = searchFilters.salaryType;
    }
    if (searchFilters.priceMin !== undefined) {
      currentParams.price_min = searchFilters.priceMin;
    }
    if (searchFilters.priceMax !== undefined) {
      currentParams.price_max = searchFilters.priceMax;
    }
    if (searchFilters.postingEndDate !== undefined) {
      currentParams.posting_end_date = searchFilters.postingEndDate;
    }
    if (searchFilters.postedDateRange !== undefined) {
      currentParams.posted_date_range = searchFilters.postedDateRange;
    }

    if (jobPage > 1) {
      currentParams.page = jobPage;
    } else {
      delete currentParams.page;
    }

    const filteredParams: Record<string, any> = {};
    for (const key in currentParams) {
      const value = currentParams[key];
      if (
        value !== undefined &&
        value !== null &&
        !(Array.isArray(value) && value.length === 0)
      ) {
        filteredParams[key] = value;
      }
    }

    router.replace(
      {
        pathname: router.pathname,
        query: filteredParams,
      },
      undefined,
      { shallow: true }
    );
  }, [searchTerm, searchFilters, jobPage]);
  // const totalItems = 106;

  const totalPages = useMemo(
    () => Math.ceil((jobsQuery?.data?.total || 0) / per_page),
    [jobsQuery?.data?.total, per_page]
  );

  const JobListContent = () => {
    return (
      <>
        {tempJobs && tempJobs.length > 0 ? (
          <div
            className="jobListContainer"
            style={{ position: "relative", minHeight: 120 }}
          >
            <Spin spinning={jobsQuery.isFetching} tip="Đang tải...">
              <Row gutter={[20, 24]}>
                {ArrayUtils.sortJobsByDateAndStatus(tempJobs)?.map((item) => (
                  <Col xs={24} sm={12} md={8} lg={8} xl={8} key={item.jobId}>
                    {/* <JobItem data={item} /> */}
                    <JobItemV2 data={item} />
                  </Col>
                ))}
              </Row>
            </Spin>

            <Row
              justify="center"
              className="loadMoreWrapper"
              style={{ marginTop: 16 }}
            >
              <Pagination
                current={jobPage}
                total={jobsQuery.data?.total}
                pageSize={per_page}
                showSizeChanger={false}
                onChange={(page: number) => {
                  setJobPage(page); // truyền page trực tiếp
                }}
                disabled={jobsQuery.isFetching}
              />
            </Row>
          </div>
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

  if (jobsQuery.isLoading && jobPage === 1) {
    return (
      <RootLayoutWithFilterCategory>
        <Head>
          <title>Tìm kiếm Công việc</title>
        </Head>
        <div style={{ padding: "50px", textAlign: "center" }}>
          <Spin size="large" tip="Đang tải dữ liệu..." />
        </div>
      </RootLayoutWithFilterCategory>
    );
  }

  return (
    <RootLayoutWithFilterCategory>
      <Head>
        <title>Tìm kiếm Công việc</title>
      </Head>

      <section className={"sectionContainer searchSectionContainer"}>
        <div className="contentWrapper">
          <Typography.Title level={3} className={"text-center"}>
            Tìm kiếm Công việc
          </Typography.Title>
          <Row className={"searchContainer"} justify={"center"}>
            <Input
              value={inputSearch || ""}
              onChange={(e) => setInputSearch(e.target.value)}
              onPressEnter={goSearch}
              size={"large"}
              placeholder={"Hãy để chúng tôi tìm kiếm công việc giúp bạn !"}
              suffix={
                <Button
                  type={"primary"}
                  size={"middle"}
                  onClick={goSearch}
                  className={"btnSearch"}
                >
                  <IconSvgLocal
                    name={"IC_SEARCH"}
                    width={20}
                    height={20}
                    fill={"#FFFFFF"}
                  />
                </Button>
              }
              className={"searchInput"}
            />
          </Row>
        </div>
      </section>

      <Row
        style={{
          maxWidth: "100%",
          margin: "0 auto",
          padding: "0 30px",
        }}
        gutter={isDesktop ? [20, 24] : undefined}
        wrap={isMobileOrTablet}
      >
        {isDesktop && (
          <Col
            style={{ flex: "0 0 300px", marginRight: "0", marginLeft: "20px" }}
          >
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5">
              <div
                style={{
                  ...(!isMobile ? { display: "flex" } : {}),
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
                className="!flex justify-between !flex-row"
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  className=""
                >
                  <div
                    style={{
                      ...(isMobile ? { marginBottom: 20 } : {}),
                      fontWeight: "400",
                      fontSize: "22px",
                    }}
                    className=""
                  >
                    Công việc ({jobsQuery.data?.total || 0})
                  </div>
                  {isMobileOrTablet && (
                    <div
                      style={{
                        ...(isMobile ? { marginBottom: 20 } : {}),
                        textAlign: "right",
                        marginLeft: "20px",
                        cursor: "pointer",
                      }}
                    >
                      {/* <Button
                        type="default"
                        shape="circle"
                        size="large"
                        style={{
                          // borderColor: "#09993E",
                          backgroundColor: "transparent",
                          color: "#000",
                          boxShadow: "none",
                        }}
                        icon={
                          <IconSvgLocal
                            name={"IC_FILTER"}
                            width={20}
                            height={20}
                          />
                        }
                        onClick={() => setSidebarDrawerVisible(true)}
                      /> */}
                      <IconSvgLocal
                        name={"IC_FILTER"}
                        width={20}
                        height={24}
                        onClick={() => setSidebarDrawerVisible(true)}
                      />
                    </div>
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyItems: "center",
                    rowGap: "8px",
                    alignItems: "center",
                  }}
                  className="!flex flex-row gap-x-8"
                >
                  {/* Sort by field */}
                  <div style={{ marginRight: "8px" }} className="flex-1 mr-2">
                    <label
                      style={{
                        marginBottom: "4px",
                      }}
                    >
                      Sắp xếp theo:
                    </label>
                    <Select
                      value={sortField}
                      onChange={handleFieldChange}
                      style={{ width: "100%" }}
                    >
                      <Select.Option value="created_at">
                        Ngày đăng
                      </Select.Option>
                      <Select.Option value="price">Thù lao</Select.Option>
                    </Select>
                  </div>

                  {/* Sort order */}
                  <div className="flex-1">
                    <label>Thứ tự:</label>
                    <Select
                      value={sortOrder[sortField]}
                      onChange={handleOrderChange}
                      style={{ width: "100%" }}
                    >
                      <Select.Option value="asc">
                        {includes(sortField, "price") ? "Thấp" : "Mới nhất"}
                      </Select.Option>
                      <Select.Option value="desc">
                        {includes(sortField, "price") ? "Cao" : "Cũ nhất"}
                      </Select.Option>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <section
              className={"sectionContainer"}
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

export default JobsSearchScreenV2;
