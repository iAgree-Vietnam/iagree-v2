// src/screens/JobScreen/JobsScreen.tsx

import React, { useMemo, useState, useCallback, useEffect } from "react";
import {
  AutoComplete,
  Breadcrumb,
  Button,
  Col,
  Grid,
  Input,
  List,
  Row,
  Typography,
} from "antd";
import Slider from "@ant-design/react-slick";
import Head from "next/head";
import { useRouter } from "next/router";

import RootLayoutWithFilterCategory from "@/src/layouts/RootLayoutWithFilterCategory";
import {
  FullJobResource,
  JobInitResource,
  JobsFilterParams,
} from "@/src/data/job/models/job.types";
import { DatasResource } from "@/src/data/base/models/base.types";
import JobRouteUtils from "@/src/data/job/utils/JobRouteUtils";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import JobCategoryItem from "@/src/components/jobs/JobCategoryItem";
import JobItem from "@/src/components/jobs/JobItem";
import { ButtonWithIcon } from "@/src/components/button";
import useJobSuggestion from "./hooks/useJobSuggestion";
import Constants from "@/src/constants/Constants";
import { FullJobResourceV2 } from "@/src/data/job/models/v2/job.types";
import JobItemV2 from "@/src/components/jobs/JobItemV2";
import { JobParseUtils } from "@/src/data/job/utils/JobParseUtils";

interface JobsScreenProps {
  data: JobInitResource;
  filters: JobsFilterParams;
}

const categorySlickSettings = {
  // arrows: false,
  // dots: true,
  // infinite: true,
  // speed: 500,
  // slidesToShow: 1,
  // slidesToScroll: 1,
  arrows: false,
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,

  responsive: [
    {
      breakpoint: 7, // tablet
      settings: {
        rows: 4,
      },
    },
    {
      breakpoint: 576, // mobile
      settings: {
        rows: 2,
      },
    },
  ],

  // default (desktop)
  rows: 6,
};

// 🟢 TÁCH HÀM CHUNK RA KHỎI LODASH
const chunkArray = (arr: any[] = [], size: number) => {
  if (!arr.length || size <= 0) return [];
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

function JobsScreen(props: JobsScreenProps) {
  const { data: jobInitResource } = props;

  const router = useRouter();
  const requestFilters = JobParseUtils.jobQueries(router.query);
  // ======== STATE ========
  // 🟢 TỐI ƯU STATE: Chỉ cần search và giá trị highlight
  const [search, setSearch] = useState<string>(requestFilters.search || "");
  const [highlightedValue, setHighlightedValue] = useState<string | null>(null);

  // ======== API gợi ý search ========
  const suggestSearch = useJobSuggestion(search);

  // ======== HANDLE SEARCH LOGIC ========
  const goSearch = useCallback(
    (searchTerm: string) => {
      const trimmed = searchTerm.trim();
      if (!trimmed) return;

      router.push(
        JobRouteUtils.toJobsSearchScreen({
          search: trimmed,
          categoryIds: requestFilters.categoryIds,
        })
      );
    },
    [router, requestFilters.categoryIds]
  );

  // Option cho AutoComplete
  const options = useMemo(() => {
    if (!suggestSearch.data || suggestSearch.data.length === 0) return [];

    const jobNames = Array.from(
      new Set(suggestSearch.data.map((item) => item.name).filter(Boolean))
    );

    return jobNames.map((name) => ({
      value: name,
      label: name,
    }));
  }, [suggestSearch.data]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 🟢 TỐI ƯU KEYDOWN: Chỉ xử lý Enter và Escape
    if (e.key === "Enter") {
      e.preventDefault();
      const searchTerm = highlightedValue || search;
      goSearch(searchTerm);
    } else if (e.key === "Escape") {
      setHighlightedValue(null);
    }
  };

  const handleSelect = (value: string) => {
    setSearch(value);
    setHighlightedValue(null);
    goSearch(value);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setHighlightedValue(null);
  };

  const handleSearchClick = () => {
    const searchTerm = highlightedValue || search;
    if (!searchTerm.trim()) return;
    goSearch(searchTerm);
  };

  // ======== CATEGORY SLIDES ========
  const categorySlideItems = useMemo(
    () => chunkArray(jobInitResource.categories || [], 6),
    [jobInitResource.categories]
  );

  // ======== JOB LIST (TẤT CẢ CÔNG VIỆC) ========
  const jobDataResource: DatasResource<FullJobResourceV2> | undefined =
    jobInitResource.jobs;

  // 🟢 TỐI ƯU LOGIC HIỂN THỊ JOB
  const { displayedJobs } = useMemo(() => {
    const TARGET_DISPLAY_COUNT = 12;

    if (!jobDataResource?.items?.length)
      return { displayedJobs: [] as FullJobResourceV2[] };

    const validStatus = [
      Constants.JOB.STATUS.DUYET_DANG_TUYEN,
      Constants.JOB.STATUS.CHO_UNG_TUYEN,
    ];

    // Lọc công việc public và có trạng thái hợp lệ
    const validPublicJobs = jobDataResource.items;

    // Chỉ lấy 12 công việc đầu tiên
    const mainJobs = validPublicJobs.slice(0, TARGET_DISPLAY_COUNT);

    return { displayedJobs: mainJobs };
  }, [jobDataResource]);

  // ======== JOB NỔI BẬT ========
  const { publicSpecialJobs, totalPublicSpecialJobs } = useMemo(() => {
    const validStatus = [
      Constants.JOB.STATUS.DUYET_DANG_TUYEN,
      Constants.JOB.STATUS.CHO_UNG_TUYEN,
    ];

    const special =
      jobInitResource?.specialJobs?.filter(
        (job) => job.isPublic === 1 && validStatus.includes(job.status)
      ) || [];

    return {
      publicSpecialJobs: special,
      totalPublicSpecialJobs: special.length,
    };
  }, [jobInitResource?.specialJobs]);
  const { useBreakpoint } = Grid;

  const screens = useBreakpoint();

  const columns = React.useMemo(() => {
    if (screens.xs) return 3;        // <576 mobile
    if (screens.sm) return 6;        // ≥576
    if (screens.md) return 6;        // ≥768
    return 6;                        // ≥992 (lg, xl)
  }, [screens.xs, screens.sm, screens.md]);

  // const displayData = useMemo(
  //   () => categorySlideItems.slice(0, maxItems).flat(),
  //   [categorySlideItems, maxItems]
  // );
  const displayData = React.useMemo(() => {
    return (categorySlideItems ?? []).flat();
  }, [categorySlideItems]);

  return (
    <RootLayoutWithFilterCategory>
      {/* <Head>
        <title>Công việc</title>
        <link
          rel="stylesheet"
          type="text/css"
          charSet="UTF-8"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
        />
      </Head> */}

      {/* HEADER BANNER */}
      <section className="pageHeaderWrapper">
        <div className="contentWrapperBanner">
          <div
            className="pageHeaderContainer jobHeaderContainer"
            style={{ margin: 0 }}
          >
            <Row justify="space-around" gutter={[0, 28]}>
              <Col flex="590px">
                <div className="pageHeaderTitle">
                  Tìm công việc tự do
                  <br />
                  hoàn hảo cho <span className="highlight">tương lai</span>
                </div>

                <Row className="searchContainer" justify="center">
                  <AutoComplete
                    options={options}
                    onSelect={handleSelect}
                    onSearch={handleSearchChange}
                    onBlur={() => {
                      // Đặt giá trị highlight về null khi focus ra ngoài
                      setHighlightedValue(null);
                    }}
                    value={highlightedValue || search || ""}
                    style={{ width: "80%", borderRadius: "40px" }}
                    size="middle"
                  >
                    <Input
                      size="middle"
                      placeholder="Nhập từ khóa tìm kiếm"
                      style={{ width: "100%", borderRadius: "40px" }}
                      onKeyDown={handleKeyDown}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      suffix={
                        <Button
                          type="primary"
                          size="middle"
                          onClick={handleSearchClick}
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
                    />
                  </AutoComplete>
                </Row>
              </Col>

              <Col flex="590px">
                <h1 className="pageHeaderTitle">
                  Tìm <span className="highlight">đối tác phù hợp</span> cho
                  <br />
                  công việc của bạn
                </h1>

                <Row justify="center">
                  <Button
                    size="large"
                    type="primary"
                    onClick={() => router.push(JobRouteUtils.toAddScreen())}
                    className="btnAddJob"
                  >
                    Đăng công việc mới
                  </Button>
                </Row>
              </Col>
            </Row>
          </div>
        </div>
      </section>

      {/* BREADCRUMB */}
      <section className="breadcrumbContainer">
        <div className="contentWrapper">
          <Breadcrumb
            items={[
              {
                title: (
                  <>
                    <IconSvgLocal name="IC_HOME" />
                    <span>Trang chủ</span>
                  </>
                ),
                href: "/",
              },
              { title: "Công việc" },
            ]}
          />
        </div>
      </section>

      {/* LĨNH VỰC CÔNG VIỆC */}
      <section className="sectionContainer jobCategory">
        <div className="contentWrapper">
          <div className="sectionTitleContainer">
            <Typography.Title className="sectionTitle text-center" level={3}>
              Lĩnh vực công việc
            </Typography.Title>
          </div>

          <Row className="sectionContentContainer" justify="center">
            {/* <Slider {...categorySlickSettings} className="categorySlider">
              {categorySlideItems.map((categoryPages, categoryPageIndex) => (
                <List
                  key={categoryPageIndex}
                  grid={{ gutter: [20, 4] }}
                  dataSource={categoryPages}
                  className="jobCategoryListContainer"
                  renderItem={(item) => (
                    <List.Item>
                      <JobCategoryItem data={item} />
                    </List.Item>
                  )}
                />
              ))}
            </Slider> */}
            <List
              className="jobCategoryListContainer"
              grid={{ gutter: [20, 12], column: columns }}
              dataSource={displayData}
              renderItem={(item) => (
                <List.Item className="!mx-auto !flex !items-center justify-center" key={item.categoryId}>
                <div style={{ display: "flex", justifyContent: "center" }}>

                  <JobCategoryItem  data={item} />
                </div>
                </List.Item>
              )}
            />
            {/* < div
    className="
      grid gap-x-5 gap-y-3
      grid-cols-2
      md:grid-cols-3
      xl:grid-cols-4
    "
  >
    {categorySlideItems.flat().map((item, index) => (
      <div
        key={index}
        className="
          xl:[&:nth-child(n+25)]:hidden
          md:max-xl:[&:nth-child(n+13)]:hidden
          [&:nth-child(n+5)]:hidden
        "
      >
        <JobCategoryItem data={item as any} />
      </div>
    ))}
  </div> */}
          </Row>
        </div>
      </section>

      {/* TẤT CẢ CÔNG VIỆC */}
      <section className="sectionContainer specialJobsContainer">
        <div className="contentWrapper">
          <div className="sectionTitleContainer">
            <Typography.Title className="sectionTitle" level={3}>
              Tất cả công việc
            </Typography.Title>
          </div>

          <List
            grid={{
              gutter: 24,
              xs: 1,
              sm: 1,
              md: 2,
              lg: 2,
              xl: 3,
              xxl: 3,
            }}
            dataSource={displayedJobs}
            locale={{ emptyText: "Không có dữ liệu" }}
            className="jobListContainer"
            renderItem={(item) => (
              <List.Item>
                {/* <JobItem data={item} /> */}
                <JobItemV2 data={item} />
              </List.Item>
            )}
          />

          <Row
            className="show-mb-flex"
            style={{ marginTop: 16 }}
            justify="center"
          >
            <ButtonWithIcon
              icon={
                <IconSvgLocal name="IC_ARROW_RIGHT" width={26} height={9} />
              }
              iconPosition="end"
              onClick={() => router.push(JobRouteUtils.toJobsSearchScreen())}
            >
              Xem tất cả công việc
            </ButtonWithIcon>
          </Row>
        </div>
      </section>

      {/* CÔNG VIỆC NỔI BẬT */}
      {publicSpecialJobs.length > 0 && (
        <section className="sectionContainer specialJobsContainer">
          <div className="contentWrapper">
            <div className="sectionTitleContainer">
              <Typography.Title className="sectionTitle" level={3}>
                Công việc nổi bật
              </Typography.Title>
            </div>

            <List
              grid={{
                gutter: 24,
                xs: 1,
                sm: 2,
                md: 2,
                lg: 3,
                xl: 3,
                xxl: 3,
              }}
              pagination={{
                pageSize: 16,
                total: totalPublicSpecialJobs,
                align: "center",
                hideOnSinglePage: true,
                showSizeChanger: false,
              }}
              dataSource={publicSpecialJobs}
              locale={{ emptyText: "Không có dữ liệu" }}
              className="jobListContainer"
              renderItem={(item) => (
                <List.Item>
                  <JobItem data={item} />
                </List.Item>
              )}
            />

            <Row
              className="show-mb-flex"
              style={{ marginTop: 16 }}
              justify="center"
            >
              <ButtonWithIcon
                icon={
                  <IconSvgLocal name="IC_ARROW_RIGHT" width={26} height={9} />
                }
                iconPosition="end"
                onClick={() => router.push(JobRouteUtils.toJobsSearchScreen())}
              >
                Xem thêm
              </ButtonWithIcon>
            </Row>
          </div>
        </section>
      )}
    </RootLayoutWithFilterCategory>
  );
}

export default JobsScreen;
