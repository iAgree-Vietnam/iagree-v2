"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Button,
  Input,
  Row,
  Typography,
  Drawer,
  Col,
  Badge,
  List,
  Spin,
} from "antd";
import RootLayoutWithFilterCategory from "@/src/layouts/RootLayoutWithFilterCategory";
import Head from "next/head";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import usePaginatedPartners from "../PartnerScreen/hooks/usePaginatedPartners";
import { useRouter } from "next/router";
import {
  CateServiceResource,
  ServiceResource,
} from "@/src/data/category/models/category.types";
import { SkillResource } from "@/src/data/skill/models/skill.types";
import { PartnerResource } from "@/src/data/partner/models/partner.types";
import useWindowWidth from "../SearchScreen/hooks/useWindowWidth";
import NoResultMessages from "../SearchScreen/components/NoResultMessages";
import FilterPartnersListComponents from "./components/FilterPartnersListComponents";
import PartnerItem from "@/src/components/partner/PartnerItem";
import { ButtonWithDottedLoadingIcon } from "@/src/components/button/ButtonWithDottedLoadingIcon";
import { size } from "lodash";
import { PartnerParserUtils } from "@/src/data/partner/utils/PartnerParserUtils";

const STORAGE_KEYS = {
  PARTNER_FILTERS: "search_partner_filters",
  PARTNER_PAGE: "search_partner_page",
  SEARCH_TERM: "search_term",
};

export type PartnerSearchFilterParams = {
  search?: string | null;
  type?: string | null;
  categoryIds: number[];
  serviceCategoryIds: number[];
  skillIds: number[];
  serviceIds: number[];
  salaryType?: number;
  priceMin?: number;
  priceMax?: number;
  deadline?: string;
  postedDateRange?: string;
  locationIds: number[];
  accountType?: "PERSONAL" | "BUSINESS";
  languageIds: number[];
};

const per_page = 6;
const CUSTOM_BREAKPOINT = 1200;

const initData = {
  total: 0,
  items: [],
};

function safeParseJSON<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

// ✅ key dedupe chắc chắn (đỡ dính undefined)
function getPartnerKey(p: any) {
  return p?.partnerId ?? p?.id ?? p?.userId ?? p?.user_id ?? p?.username;
}

function PartnerSearchScreen(props: {
  serviceCategories: CateServiceResource[];
  skills: SkillResource[];
  serviceDetails: ServiceResource[];
}) {
  const router = useRouter();

  // ====== parse query trên URL (đầu vào) ======
  const partnerFilters = PartnerParserUtils.partnerQueries(router.query);

  // ====== localStorage default filters ======
  const [searchFilters, setSearchFilters] = useState<PartnerSearchFilterParams>(
    () => {
      if (typeof window === "undefined") {
        return {
          categoryIds: [],
          serviceCategoryIds: [],
          skillIds: [],
          serviceIds: [],
          search: null,
          locationIds: [],
          accountType: undefined,
          languageIds: [],
        };
      }

      const stored = safeParseJSON<PartnerSearchFilterParams>(
        localStorage.getItem(STORAGE_KEYS.PARTNER_FILTERS),
        {
          categoryIds: [],
          serviceCategoryIds: [],
          skillIds: [],
          serviceIds: [],
          search: null,
          locationIds: [],
          accountType: undefined,
          languageIds: [],
        }
      );

      return stored;
    }
  );

  // ====== search input + term ======
  const [inputSearch, setInputSearch] = useState<string>(
    partnerFilters?.search || ""
  );
  const [searchTerm, setSearch] = useState<string | null>(inputSearch);

  // ====== page ======
  const [partnerPage, setPartnerPage] = useState<number>(
    partnerFilters?.page || 1
  );

  // ✅ list hiển thị thực tế (append tại đây)
  const [tempPartners, setTempPartners] = useState<PartnerResource[]>([]);

  const [sidebarDrawerVisible, setSidebarDrawerVisible] = useState(false);

  const windowWidth = useWindowWidth();
  const isMobileOrTablet =
    windowWidth !== undefined && windowWidth <= CUSTOM_BREAKPOINT;
  const isDesktop =
    windowWidth === undefined || windowWidth > CUSTOM_BREAKPOINT;

  const setDefaultPartnerPageWhenFilter = useCallback(() => {
    setPartnerPage(1);
  }, []);

  // ====== build filters cho hook ======
  const mergedFilters = useMemo(() => {
    return {
      ...partnerFilters,
      search: searchTerm,
      page: partnerPage,
      categoryIds: searchFilters.categoryIds,
      skillIds: searchFilters.skillIds,
      categoryServiceIds: searchFilters.serviceCategoryIds,
      serviceIds: searchFilters.serviceIds,
      locationIds: searchFilters.locationIds,
      ...(searchFilters.accountType
        ? { accountType: searchFilters.accountType }
        : {}),
      languageIds: searchFilters.languageIds,
    };
  }, [partnerFilters, searchTerm, partnerPage, searchFilters]);

  const partnersQuery = usePaginatedPartners({
    filters: mergedFilters,
    initData,
    per_page,
  });

  // ====== append đúng (dedupe + không bị undefined) ======
  useEffect(() => {
    const newItems: PartnerResource[] = (partnersQuery.data?.partners ??
      []) as any;

    if (partnerPage === 1) {
      setTempPartners(newItems);
      return;
    }

    if (size(newItems) > 0) {
      setTempPartners((prev) => {
        const existed = new Set(prev.map(getPartnerKey));
        const unique = newItems.filter(
          (p) => !existed.has(getPartnerKey(p))
        );
        return [...prev, ...unique];
      });
    }
  }, [partnersQuery.data?.partners, partnerPage]);

  const totalPages = Math.ceil((partnersQuery.data?.total ?? 0) / per_page);
  const hasMorePartners = partnerPage < totalPages;

  const [isCollapsed, setIsCollapsed] = useState(false);

  // ✅ fix stale closure
  const onLoadMorePartner = () => {
    if (!partnersQuery.isFetching && hasMorePartners && !isCollapsed) {
      setPartnerPage((p) => p + 1);
    }
  };

  const onCollapsePartners = () => {
    setPartnerPage(1);
    setIsCollapsed(false);
    setTempPartners((partnersQuery.data?.partners ?? []) as any);

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // ====== save filters/page/searchTerm ======
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(
      STORAGE_KEYS.PARTNER_FILTERS,
      JSON.stringify(searchFilters)
    );
    localStorage.setItem(STORAGE_KEYS.PARTNER_PAGE, String(partnerPage));
    localStorage.setItem(STORAGE_KEYS.SEARCH_TERM, searchTerm || "");
  }, [searchFilters, partnerPage, searchTerm]);

  // ====== sync URL query params (shallow) ======
  useEffect(() => {
    const currentParams: Record<string, any> = {
      search: searchTerm || undefined,
    };

    if (size(searchFilters.categoryIds) > 0)
      currentParams.category_ids = searchFilters.categoryIds.join(",");
    if (size(searchFilters.skillIds) > 0)
      currentParams.skill_ids = searchFilters.skillIds.join(",");
    if (size(searchFilters.serviceCategoryIds) > 0)
      currentParams.service_category_ids =
        searchFilters.serviceCategoryIds.join(",");
    if (size(searchFilters.serviceIds) > 0)
      currentParams.service_ids = searchFilters.serviceIds.join(",");
    if (size(searchFilters.locationIds) > 0)
      currentParams.location_ids = searchFilters.locationIds.join(",");
    if (searchFilters.accountType !== undefined)
      currentParams.account_type = searchFilters.accountType;
    if (size(searchFilters.languageIds) > 0)
      currentParams.language_ids = searchFilters.languageIds.join(",");

    if (partnerPage > 1) currentParams.page = partnerPage;

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
      { pathname: router.pathname, query: filteredParams },
      undefined,
      { shallow: true }
    );
  }, [router, searchTerm, searchFilters, partnerPage]);

  function goSearch() {
    if (inputSearch !== searchTerm) {
      setSearch(inputSearch);
      setDefaultPartnerPageWhenFilter();
      setTempPartners([]);
      setIsCollapsed(false);
    }
  }

  const totalSelectedFilters = (() => {
    let total = 0;
    if (searchFilters.categoryIds) total += size(searchFilters.categoryIds);
    if (searchFilters.skillIds) total += size(searchFilters.skillIds);
    if (searchFilters.serviceCategoryIds)
      total += size(searchFilters.serviceCategoryIds);
    if (searchFilters.serviceIds) total += size(searchFilters.serviceIds);
    if (searchFilters.locationIds) total += size(searchFilters.locationIds);
    if (searchFilters.accountType !== undefined) total += 1;
    if (searchFilters.languageIds) total += size(searchFilters.languageIds);
    return total;
  })();

  const PartnerListContent = (
    <>
      {tempPartners && size(tempPartners) > 0 ? (
        <List
          loading={partnersQuery.isFetching && partnerPage === 1}
          dataSource={tempPartners}
          loadMore={
            (hasMorePartners || partnerPage >= 2) && (
              <Row justify={"center"} className={"loadMoreWrapper"}>
                {hasMorePartners && (
                  <ButtonWithDottedLoadingIcon
                    icon={
                      <IconSvgLocal
                        name={"IC_ARROW_RIGHT"}
                        width={26}
                        height={9}
                      />
                    }
                    iconPosition={"end"}
                    onClick={onLoadMorePartner}
                    loading={partnersQuery.isFetching}
                    disabled={partnersQuery.isFetching}
                  >
                    Tải thêm
                  </ButtonWithDottedLoadingIcon>
                )}

                {partnerPage >= 2 && (
                  <Button
                    type="default"
                    onClick={onCollapsePartners}
                    style={{ marginLeft: 12 }}
                  >
                    Thu gọn
                  </Button>
                )}
              </Row>
            )
          }
          grid={{ gutter: 24, xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 3 }}
          className={"partnerListContainer"}
          renderItem={(item) => (
            <List.Item className={"partnerItemWrapper"}>
              <PartnerItem data={item as any} />
            </List.Item>
          )}
        />
      ) : partnersQuery.isFetching ? (
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
          <Typography.Text>Đang tải danh sách Đối tác...</Typography.Text>
        </div>
      ) : (
        <NoResultMessages searchTerm={searchTerm} type="đối tác" />
      )}
    </>
  );

  if (partnersQuery.isLoading && partnerPage === 1) {
    return (
      <RootLayoutWithFilterCategory>
        <Head>
          <title>Tìm kiếm Đối tác</title>
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
        <title>Tìm kiếm Đối tác</title>
      </Head>

      <section className="sectionContainer searchSectionContainer">
        <div className="contentWrapper">
          <Typography.Title level={3} className="text-center">
            Tìm kiếm Đối tác
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
              placeholder="Hãy để chúng tôi tìm kiếm đối tác giúp bạn !"
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
                <FilterPartnersListComponents
                  serviceCategories={props.serviceCategories}
                  skills={props.skills}
                  services={props.serviceDetails}
                  filters={searchFilters}
                  setPartnerPage={setPartnerPage}
                  setFilters={setSearchFilters}
                  setPartnersList={setTempPartners as any}
                />
              </div>
            </section>
          </Col>
        )}

        <Col flex="auto" style={{ minWidth: 0 }}>
          <div className="contentWrapperSearch" style={{ minHeight: "auto" }}>
            <Row justify={"space-between"} align={"top"}>
              <Typography.Title
                style={{
                  marginBottom: 10,
                  fontWeight: "400",
                  fontSize: "22px",
                }}
              >
                Đối tác
              </Typography.Title>

              {isMobileOrTablet && (
                <div style={{ marginBottom: 10, textAlign: "right" }}>
                  <Badge
                    count={totalSelectedFilters}
                    offset={[-8, 0]}
                    style={{
                      backgroundColor: "#ff4d4f",
                      color: "#fff",
                      boxShadow: "0 0 0 1px #fff inset",
                    }}
                    overflowCount={99}
                  >
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
            </Row>

            <section
              className="sectionContainer"
              style={{ padding: "0px 0px", paddingBottom: "40px" }}
            >
              <div className="contentWrapperSearch" style={{ minHeight: 200 }}>
                {PartnerListContent}
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
        <FilterPartnersListComponents
          serviceCategories={props.serviceCategories}
          skills={props.skills}
          services={props.serviceDetails}
          filters={searchFilters}
          setPartnerPage={setPartnerPage}
          setFilters={setSearchFilters}
          setPartnersList={setTempPartners as any}
        />
      </Drawer>
    </RootLayoutWithFilterCategory>
  );
}

export default PartnerSearchScreen;