import React, { useState, useEffect, useCallback } from "react";
import {
  Alert,
  Button,
  Input,
  Row,
  Space,
  Typography,
  Drawer,
  Col,
  List,
  Spin,
  Badge,
} from "antd";
import RootLayoutWithFilterCategory from "@/src/layouts/RootLayoutWithFilterCategory";
import Head from "next/head";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import usePaginatedPartners from "../PartnerScreen/hooks/usePaginatedPartners";
import JobRouteUtils from "@/src/data/job/utils/JobRouteUtils";
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

const initData = {
  total: 0,
  items: [],
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

function PartnerSearchScreen(props: {
  partnerFilters: any;
  serviceCategories: CateServiceResource[];
  skills: SkillResource[];
  serviceDetails: ServiceResource[];
}) {
  const router = useRouter();
  const [searchFilters, setSearchFilters] = useState<PartnerSearchFilterParams>(
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
  const [inputSearch, setInputSearch] = useState<string>(
    props.partnerFilters?.search || ""
  );
  const [searchTerm, setSearch] = useState<string | null>(inputSearch);
  const [partnerPage, setPartnerPage] = useState<number>(
    props.partnerFilters?.page || 1
  );
  const [tempPartners, setTempPartners] = useState<Partial<PartnerResource>[]>([]);

  const [sidebarDrawerVisible, setSidebarDrawerVisible] = useState(false);

  const windowWidth = useWindowWidth();

  const isMobileOrTablet =
    windowWidth !== undefined && windowWidth <= CUSTOM_BREAKPOINT;
  const isDesktop =
    windowWidth === undefined || windowWidth > CUSTOM_BREAKPOINT;

  const setDefaultPartnerPageWhenFilter = useCallback(() => {
    setPartnerPage(1);
  }, []);

  const partnersQuery = usePaginatedPartners({
    filters: {
      ...props.partnerFilters,
      search: searchTerm,
      page: partnerPage,
      categoryIds: searchFilters.categoryIds,
      skillIds: searchFilters.skillIds,
      categoryServiceIds: searchFilters.serviceCategoryIds,
      serviceIds: searchFilters.serviceIds,
      locationIds: searchFilters.locationIds,
      accountType: searchFilters.accountType,
      languageIds: searchFilters.languageIds,
      salaryId: undefined,
      priceMin: undefined,
      priceMax: undefined,
      endDate: undefined,
      updateDate: undefined,
    },
    initData,
    per_page,
  });

  useEffect(() => {
    if (partnerPage === 1) {
      setTempPartners(partnersQuery?.data?.partners ?? []);
    } else {
      const newItems = partnersQuery?.data?.partners ?? [];
      if (newItems.length > 0) {
        setTempPartners((prevPartners) => {
          const existingPartnerIds = new Set(
            prevPartners.map((partner) => partner.partnerId)
          );
          const uniqueNewPartners = newItems.filter(
            (partner) => !existingPartnerIds.has(partner.partnerId)
          );
          return [...prevPartners, ...uniqueNewPartners];
        });
      }
    }
  }, [partnersQuery.data.partners, partnerPage]);

  const totalPages = Math.ceil((partnersQuery.data?.total ?? 0) / per_page);

  const hasMorePartners = partnerPage < totalPages;

  // isCollapsed vẫn dùng để kiểm soát trạng thái thu gọn nhưng sẽ không tự động bật nữa
  const [isCollapsed, setIsCollapsed] = useState(false);

  const onLoadMorePartner = () => {
    if (!partnersQuery.isFetching && hasMorePartners && !isCollapsed) {
      setPartnerPage(partnerPage + 1);
    }
  };

  const onCollapsePartners = () => {
    setPartnerPage(1);
    setIsCollapsed(false);
    setTempPartners(partnersQuery?.data?.partners ?? []);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  function goSearch() {
    if (inputSearch !== searchTerm) {
      setSearch(inputSearch);
      setDefaultPartnerPageWhenFilter();
      setTempPartners([]);
      setIsCollapsed(false);
    }
  }

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
    if (searchFilters.locationIds.length > 0) {
      currentParams.location_ids = searchFilters.locationIds.join(",");
    }
    if (searchFilters.accountType !== undefined) {
      currentParams.account_type = searchFilters.accountType;
    }
    if (searchFilters.languageIds.length > 0) {
      currentParams.language_ids = searchFilters.languageIds.join(",");
    }

    if (partnerPage > 1) {
      currentParams.page = partnerPage;
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
  }, [searchTerm, searchFilters, partnerPage]);

  const PartnerListContent = (
    <>
      {tempPartners && tempPartners.length > 0 ? (
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
              <PartnerItem data={item} />
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

  function countTotalFilters(filters: PartnerSearchFilterParams): number {
    let total = 0;
    if (filters.categoryIds) total += filters.categoryIds.length;
    if (filters.skillIds) total += filters.skillIds.length;
    if (filters.serviceCategoryIds) total += filters.serviceCategoryIds.length;
    if (filters.serviceIds) total += filters.serviceIds.length;
    if (filters.locationIds) total += filters.locationIds.length;
    if (filters.accountType !== undefined) total += 1;
    if (filters.languageIds) total += filters.languageIds.length;
    return total;
  }

  const totalSelectedFilters = countTotalFilters(searchFilters);

  return (
    <RootLayoutWithFilterCategory>
      <Head>
        <title>Tìm kiếm Đối tác</title>
      </Head>

      <section className={"sectionContainer searchSectionContainer"}>
        <div className="contentWrapper">
          <Typography.Title level={3} className={"text-center"}>
            Tìm kiếm Đối tác
          </Typography.Title>
          <Row className={"searchContainer"} justify={"center"}>
            <Input
              value={inputSearch || ""}
              onChange={(e) => setInputSearch(e.target.value)}
              onPressEnter={goSearch}
              size={"large"}
              placeholder={"Hãy để chúng tôi tìm kiếm đối tác giúp bạn !"}
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
                <FilterPartnersListComponents
                  serviceCategories={props.serviceCategories}
                  skills={props.skills}
                  services={props.serviceDetails}
                  filters={searchFilters}
                  setPartnerPage={setPartnerPage}
                  setFilters={setSearchFilters}
                  setPartnersList={setTempPartners}
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
                        <IconSvgLocal
                          name={"IC_FILTER"}
                          width={20}
                          height={20}
                        />
                      }
                      onClick={() => setSidebarDrawerVisible(true)}
                    />
                  </Badge>
                </div>
              )}
            </Row>

            <section
              className={"sectionContainer"}
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
          setPartnersList={setTempPartners}
        />
      </Drawer>

      {/* <div
        style={{
          marginBottom: "20px",
          marginInline: "auto",
          maxWidth: "70%",
        }}
      >
        <Alert
          message="Đăng tải dự án mới ngay bây giờ để tìm kiếm đối tác cùng IAgree"
          type="info"
          showIcon
          style={{ justifyContent: "center" }}
          action={
            <Space direction="vertical">
              <Button
                size="small"
                style={{ borderColor: "#1677ff" }}
                className="iagree-select-partner-btn"
                onClick={() => router.push(JobRouteUtils.toAddScreen())}
              >
                Tìm đối tác
              </Button>
            </Space>
          }
        />
      </div> */}
    </RootLayoutWithFilterCategory>
  );
}

export default PartnerSearchScreen;
