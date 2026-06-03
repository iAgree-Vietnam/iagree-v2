"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button, Input, Row, Typography, Drawer, Col, Badge } from "antd";
import RootLayoutWithFilterCategory from "@/src/layouts/RootLayoutWithFilterCategory";
import Head from "next/head";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import usePaginatedJobs from "../JobScreen/hooks/usePaginatedJobs";
import usePaginatedPartners from "../PartnerScreen/hooks/usePaginatedPartners";
import { useRouter } from "next/router";
import type {
  CategoryResource,
  CateServiceResource,
  ServiceResource,
} from "@/src/data/category/models/category.types";
import type { SkillResource } from "@/src/data/skill/models/skill.types";
import useWindowWidth from "./hooks/useWindowWidth";
import SearchFilterPartnersListSidebar from "./components/SearchFilterPartnersListSidebar";
import SearchTabsComponent from "./components/SearchTabsComponent";
import SearchFilterJobsListSidebar from "./components/SearchFilterJobsListSidebar";
import type {
  PartnerFilterParamsV2,
  PartnerResource,
} from "@/src/data/partner/models/partner.types";
import type {
  JobsFilterParamsV2,
} from "@/src/data/job/models/job.types";
import {
  getInitialJobFilters,
  getInitialPartnerFilters,
} from "@/src/utils/ParserParamsUtils";
import { includes } from "lodash";
import ArrayUtils from "@/src/utils/ArrayUtils";
import { FullJobResourceV2 } from "@/src/data/job/models/v2/job.types";
import { JobParseUtils } from "@/src/data/job/utils/JobParseUtils";
import { PartnerParserUtils } from "@/src/data/partner/utils/PartnerParserUtils";

const initData = { total: 0, items: [] };
const per_page = 6;
const CUSTOM_BREAKPOINT = 1200;

export const STORAGE_KEYS = {
  JOB_FILTERS: "search_job_filters",
  PARTNER_FILTERS: "search_partner_filters",
  ACTIVE_TAB: "search_active_tab",
  SEARCH_TERM: "search_term",
  JOB_PAGE: "search_job_page",
  PARTNER_PAGE: "search_partner_page",
  TEMP_JOBS: "search_temp_jobs",
  TEMP_PARTNERS: "search_temp_partners",
};

function SearchScreen(props: {
  templateFilters: any;
  categories: CategoryResource[];
  serviceCategories: CateServiceResource[];
  skills: SkillResource[];
  serviceDetails: ServiceResource[];
}) {
  const router = useRouter();
  const isFirstMountRef = useRef(true);
  const jobFilters = JobParseUtils.jobQueriesV2(router.query);
  const partnerFilters = PartnerParserUtils.partnerQueriesV2(router.query);

  const initialJobFilters = getInitialJobFilters(router.query);
  const initialPartnerFilters = getInitialPartnerFilters(router.query);

  const [jobFiltersState, setJobFiltersState] =
    useState<JobsFilterParamsV2>(initialJobFilters);
  const [partnerFiltersState, setPartnerFiltersState] =
    useState<PartnerFilterParamsV2>(initialPartnerFilters);

  const [inputSearch, setInputSearch] = useState<string>(
    initialJobFilters.search || initialPartnerFilters.search || ""
  );
  const [searchTerm, setSearch] = useState<string | null>(inputSearch);
  const [activeTabKey, setActiveTabKey] = useState<string>(
    (router.query.type as string) || "job"
  );

  const [jobPage, setJobPage] = useState<number>(1);
  const [partnerPage, setPartnerPage] = useState<number>(1);

  const [tempJobs, setTempJobs] = useState<FullJobResourceV2[]>([]);
  const [tempPartners, setTempPartners] = useState<Partial<PartnerResource>[]>([]);
  const [sidebarDrawerVisible, setSidebarDrawerVisible] = useState(false);

  const windowWidth = useWindowWidth();
  const isMobileOrTablet =
    windowWidth !== undefined && windowWidth <= CUSTOM_BREAKPOINT;
  const isDesktop = !isMobileOrTablet;

  const setDefaultPages = useCallback(() => {
    setJobPage(1);
    setPartnerPage(1);
  }, []);

  // // Sử dụng hook useFilterStorage để lưu và khôi phục filter
  // useFilterStorage(jobFiltersState, setJobFiltersState, STORAGE_KEYS.JOB_FILTERS);
  // useFilterStorage(partnerFiltersState, setPartnerFiltersState, STORAGE_KEYS.PARTNER_FILTERS);
  // useSetRouterPath()

  // 🟢 Mount: nếu từ homepage → KHÔNG lấy LS; nếu từ trang khác → khôi phục LS
  useEffect(() => {
    if (
      !router.isReady ||
      !isFirstMountRef.current ||
      typeof window === "undefined"
    )
      return;
    if (
      !router.isReady ||
      !isFirstMountRef.current ||
      typeof window === "undefined"
    )
      return;
    isFirstMountRef.current = false;

    const prev = localStorage.getItem("PREVIOUS_PATH");

    const cameFromHome = includes(
      ["/", "/category-detail/[categorySlug]"],
      prev
    );
    if (cameFromHome) {
      // Chỉ lấy search từ URL, bỏ hết filters từ LS
      const qSearch = (router.query.search as string) || "";
      setInputSearch(qSearch);
      setSearch(qSearch);
      setJobFiltersState(getInitialJobFilters({ search: qSearch }));
      setPartnerFiltersState(getInitialPartnerFilters({ search: qSearch }));
      setDefaultPages();

      // clear cờ tạm để lần refresh sau không bị hiểu nhầm
      // sessionStorage.removeItem(HOME_FLAG);
      return;
    }

    // ⤵️ Vào từ trang khác / reload: khôi phục từ LS
    const storedJobFilters = localStorage.getItem(STORAGE_KEYS.JOB_FILTERS);
    const storedPartnerFilters = localStorage.getItem(
      STORAGE_KEYS.PARTNER_FILTERS
    );
    const storedActiveTab = localStorage.getItem(STORAGE_KEYS.ACTIVE_TAB);
    const storedSearchTerm = localStorage.getItem(STORAGE_KEYS.SEARCH_TERM);
    const storedJobPage = localStorage.getItem(STORAGE_KEYS.JOB_PAGE);
    const storedPartnerPage = localStorage.getItem(STORAGE_KEYS.PARTNER_PAGE);
    const savedJobs = localStorage.getItem(STORAGE_KEYS.TEMP_JOBS);
    const savedPartners = localStorage.getItem(STORAGE_KEYS.TEMP_PARTNERS);

    if (storedJobFilters) setJobFiltersState(JSON.parse(storedJobFilters));
    if (storedPartnerFilters)
      setPartnerFiltersState(JSON.parse(storedPartnerFilters));
    if (storedActiveTab) setActiveTabKey(storedActiveTab);
    if (storedSearchTerm !== null) {
      setSearch(storedSearchTerm);
      setInputSearch(storedSearchTerm);
    }
    if (storedJobPage) setJobPage(Number(storedJobPage));
    if (storedPartnerPage) setPartnerPage(Number(storedPartnerPage));
    if (savedJobs) setTempJobs(JSON.parse(savedJobs));
    if (savedPartners) setTempPartners(JSON.parse(savedPartners));
  }, [router.isReady, router.query, setDefaultPages]);

  // 🟡 Persist filters/tab/search/pages vào LS
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(
      STORAGE_KEYS.JOB_FILTERS,
      JSON.stringify(jobFiltersState)
    );
    localStorage.setItem(
      STORAGE_KEYS.PARTNER_FILTERS,
      JSON.stringify(partnerFiltersState)
    );
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB, activeTabKey);
    localStorage.setItem(STORAGE_KEYS.SEARCH_TERM, searchTerm || "");
    localStorage.setItem(STORAGE_KEYS.JOB_PAGE, String(jobPage));
    localStorage.setItem(STORAGE_KEYS.PARTNER_PAGE, String(partnerPage));

    return () => {
      localStorage.setItem("PREVIOUS_PATH", router.pathname); // Lưu lại đường dẫn hiện tại vào localStorage
    };
  }, [
    jobFiltersState,
    partnerFiltersState,
    activeTabKey,
    searchTerm,
    jobPage,
    partnerPage,
  ]);

  // 🔴 Clear SEARCH_TERM khi rời trang (SPA route change + reload/close)
  // useEffect(() => {
  //   if (typeof window === "undefined") return;
  //   const clearSearch = () =>
  //     localStorage.setItem(STORAGE_KEYS.SEARCH_TERM, "");
  //   router.events.on("routeChangeStart", clearSearch);
  //   const onBeforeUnload = () => clearSearch();
  //   window.addEventListener("beforeunload", onBeforeUnload);
  //   return () => {
  //     router.events.off("routeChangeStart", clearSearch);
  //     window.removeEventListener("beforeunload", onBeforeUnload);
  //   };
  // }, [router.events]);

  // 📡 Queries
  const jobsQuery = usePaginatedJobs({
    filters: {
      ...jobFilters,
      search: searchTerm,
      page: jobPage,
      categoryIds: (jobFiltersState as any).jobCategoryIds,
      skillIds: (jobFiltersState as any).jobSkillIds,
      categoryServiceIds: (jobFiltersState as any).jobServiceCategoryIds,
      serviceIds: (jobFiltersState as any).jobServiceIds,
      salaryId: (jobFiltersState as any).salaryId,
      priceMin: (jobFiltersState as any).priceMin,
      priceMax: (jobFiltersState as any).priceMax,
      postingEndDate: (jobFiltersState as any).postingEndDate,
      postedDateRange: (jobFiltersState as any).postedDateRange,
    } as any,
    initData,
    per_page,
  });

  const partnersQuery = usePaginatedPartners({
    filters: {
      ...partnerFilters,
      search: searchTerm,
      page: partnerPage,
      categoryIds: (partnerFiltersState as any).partnerCategoryIds,
      skillIds: (partnerFiltersState as any).partnerSkillIds,
      categoryServiceIds: (partnerFiltersState as any)
        .partnerServiceCategoryIds,
      serviceIds: (partnerFiltersState as any).partnerServiceIds,
      locationIds: (partnerFiltersState as any).locationIds,
      accountType: (partnerFiltersState as any).accountType,
      languageIds: (partnerFiltersState as any).languageIds,
    } as any,
    initData,
    per_page,
  });

  // 🧠 Cập nhật danh sách tạm + lưu LS
  useEffect(() => {
    if (!jobsQuery.data?.items) return;
    setTempJobs(jobsQuery.data.items);
    if (typeof window !== "undefined") {
      localStorage.setItem(
        STORAGE_KEYS.TEMP_JOBS,
        JSON.stringify(jobsQuery.data.items)
      );
    }
  }, [jobsQuery.data?.items]);

  useEffect(() => {
    if (!partnersQuery.data?.partners) return;
    setTempPartners(partnersQuery?.data?.partners || []);
    if (typeof window !== "undefined") {
      localStorage.setItem(
        STORAGE_KEYS.TEMP_PARTNERS,
        JSON.stringify(partnersQuery.data.partners)
      );
    }
  }, [partnersQuery.data?.partners]);

  // 🔍 Thực thi search
  function goSearch() {
    if (inputSearch !== searchTerm) {
      if (typeof window !== "undefined") {
        setSearch(inputSearch);
        localStorage.setItem(STORAGE_KEYS.SEARCH_TERM, inputSearch);
        setDefaultPages();
        setTempJobs([]);
        setTempPartners([]);

        const newQuery = { ...router.query, search: inputSearch };

        router.replace({
          pathname: router.pathname,
          query: newQuery,
        });
      }
    }
  }

  // 🔢 Đếm filter
  const countFilters = () => {
    const isJob = activeTabKey === "job";
    const f: any = isJob ? jobFiltersState : partnerFiltersState;
    let count = 0;
    if (isJob) {
      count +=
        (f.jobCategoryIds?.length || 0) +
        (f.jobSkillIds?.length || 0) +
        (f.jobServiceCategoryIds?.length || 0) +
        (f.jobServiceIds?.length || 0);
      if (f.salaryId) count++;
      if (f.priceMin) count++;
      if (f.priceMax) count++;
      if (f.postingEndDate) count++;
      if (f.postedDateRange) count++;
    } else {
      count +=
        (f.partnerCategoryIds?.length || 0) +
        (f.partnerSkillIds?.length || 0) +
        (f.partnerServiceCategoryIds?.length || 0) +
        (f.partnerServiceIds?.length || 0) +
        (f.locationIds?.length || 0) +
        (f.languageIds?.length || 0);
      if (f.accountType) count++;
    }
    return count;
  };
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Khi rời trang Search thì xóa PREVIOUS_PATH
    const handleRouteChangeStart = (url: string) => {
      if (!url.includes("/search")) {
        localStorage.removeItem("PREVIOUS_PATH");
      }
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);
    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
    };
  }, [router.events]);
  return (
    <RootLayoutWithFilterCategory>
      <Head>
        <title>Kết quả tìm kiếm</title>
      </Head>

      <section className="sectionContainer searchSectionContainer">
        <div className="contentWrapper">
          <Typography.Title level={3} className="text-center">
            Kết quả tìm kiếm
          </Typography.Title>
          <Row className="searchContainer" justify="center">
            <Input
              value={inputSearch || ""}
              onChange={(e) => {
                const value = e.target.value;
                setInputSearch(value);
                if (typeof window !== "undefined") {
                  localStorage.setItem(STORAGE_KEYS.SEARCH_TERM, value);
                }
              }}
              onPressEnter={goSearch}
              size="large"
              placeholder="Hãy để chúng tôi tìm kiếm giúp bạn !"
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
                {activeTabKey === "job" ? (
                  <SearchFilterJobsListSidebar
                    skills={props.skills}
                    serviceCategories={props.serviceCategories}
                    services={props.serviceDetails}
                    filters={jobFiltersState}
                    setJobPage={setJobPage}
                    setFilters={setJobFiltersState}
                    setJobsList={setTempJobs}
                  />
                ) : (
                  <SearchFilterPartnersListSidebar
                    serviceCategories={props.serviceCategories}
                    skills={props.skills}
                    services={props.serviceDetails}
                    filters={partnerFiltersState}
                    setPartnerPage={setPartnerPage}
                    setFilters={setPartnerFiltersState}
                    setPartnersList={setTempPartners}
                  />
                )}
              </div>
            </section>
          </Col>
        )}

        <Col flex="auto" style={{ minWidth: 0 }}>
          {isMobileOrTablet && (
            <div style={{ marginBottom: 20, textAlign: "right" }}>
              <Badge count={countFilters()} offset={[-8, 0]}>
                <Button
                  type="default"
                  shape="circle"
                  size="large"
                  style={{
                    borderColor: "#09993E",
                    backgroundColor: "transparent",
                    color: "#000",
                    boxShadow: "none",
                  }}
                  icon={
                    <IconSvgLocal name="IC_FILTER" width={20} height={20} />
                  }
                  onClick={() => setSidebarDrawerVisible(true)}
                />
              </Badge>
            </div>
          )}

          <SearchTabsComponent
            jobsQuery={jobsQuery}
            partnersQuery={partnersQuery as any}
            searchTerm={searchTerm}
            setJobPage={setJobPage}
            setPartnerPage={setPartnerPage}
            jobPage={jobPage}
            partnerPage={partnerPage}
            activeTabKey={activeTabKey}
            setActiveTabKey={setActiveTabKey}
            tempJobs={ArrayUtils.sortJobsByDateAndStatus(tempJobs)}
            tempPartners={tempPartners}
          />
        </Col>
      </Row>

      <Drawer
        title="Bộ lọc tìm kiếm"
        placement="left"
        onClose={() => setSidebarDrawerVisible(false)}
        open={sidebarDrawerVisible}
      >
        {activeTabKey === "job" ? (
          <SearchFilterJobsListSidebar
            skills={props.skills}
            serviceCategories={props.serviceCategories}
            services={props.serviceDetails}
            filters={jobFiltersState}
            setJobPage={setJobPage}
            setFilters={setJobFiltersState}
            setJobsList={setTempJobs}
          />
        ) : (
          <SearchFilterPartnersListSidebar
            serviceCategories={props.serviceCategories}
            skills={props.skills}
            services={props.serviceDetails}
            filters={partnerFiltersState}
            setPartnerPage={setPartnerPage}
            setFilters={setPartnerFiltersState}
            setPartnersList={setTempPartners}
          />
        )}
      </Drawer>
    </RootLayoutWithFilterCategory>
  );
}

export default SearchScreen;
