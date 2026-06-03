import { useEffect, useMemo, useState } from "react";
import {
  Breadcrumb,
  Button,
  Dropdown,
  Col,
  Input,
  List,
  Row,
  Typography,
  Space,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import RootLayoutWithFilterCategory from "@/src/layouts/RootLayoutWithFilterCategory";
import Head from "next/head";
import {
  JobInitResource,
  JobsFilterParams,
} from "@/src/data/job/models/job.types";
import _ from "lodash";
import JobFilterSection from "../components/JobFilterSection";
import usePaginatedJobs from "../hooks/usePaginatedJobs";
import { DatasResource } from "@/src/data/base/models/base.types";
import HTTPHelper from "@/src/utils/HTTPHelper";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import JobRouteUtils from "@/src/data/job/utils/JobRouteUtils";
import { useRouter } from "next/router";
import { FullJobResourceV2 } from "@/src/data/job/models/v2/job.types";
import JobItemV2 from "@/src/components/jobs/JobItemV2";
import { JobParseUtils } from "@/src/data/job/utils/JobParseUtils";

interface JobsListScreenProps {
  data: JobInitResource;
  filters: JobsFilterParams;
}

function JobsListScreen(props: JobsListScreenProps) {
  const { data: jobInitResource } = props;
  const router = useRouter();
  const requestFilters = JobParseUtils.jobQueries(router.query);

  const [search, setSearch] = useState<string | null>(
    requestFilters.search || null
  );
  const [filters, setFilters] = useState<JobsFilterParams>(requestFilters);
  const [sort, setSort] = useState(null);

  const jobQuery = usePaginatedJobs({
    filters,
    sort,
    initData: jobInitResource.jobs,
  });
  const jobDataResource: DatasResource<FullJobResourceV2> | undefined =
    jobQuery.data;

  const publicJobs = jobDataResource?.items;
  const totalPublicJobs = publicJobs?.length || 0;


  const categoryMenuItems = useMemo(
    () =>
      jobInitResource.categories.map((item) => ({
        key: item.categoryId,
        label: item.name,
      })),
    [jobInitResource]
  );

  // const skillMenuItems = useMemo(
  //   () =>
  //       jobInitResource.skills.map((item) => ({
  //           key: item.skillId,
  //           label: item.name,
  //       })),
  //   [jobInitResource]
  // );

  function goSearch() {
    setFilters((prevState) => ({ ...prevState, search: search }));
  }

  useEffect(() => {
    HTTPHelper.pushState(filters);

    const search = filters.search;
    if (search) {
      router.push(
        JobRouteUtils.toJobsSearchScreen({
          search,
          categoryIds: filters.categoryIds,
        })
      );
    }
  }, [filters]);

  return (
    <RootLayoutWithFilterCategory>
      {/* <Head>
        <title>Công việc</title>
      </Head> */}

      <section className={"breadcrumbContainer"}>
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
              { title: "Công việc" },
            ]}
          />
        </div>
      </section>

      <section
        className={"sectionContainer templateSectionContainer"}
        style={{ paddingTop: 16, paddingBottom: 0 }}
      >
        <div className="contentWrapper">
          <Row className={"searchContainer"} justify={"center"}>
            <Input
              value={search || ""}
              onChange={(e) => setSearch(e.target.value)}
              onPressEnter={() => goSearch()}
              size={"large"}
              placeholder={"Nhập từ khóa tìm kiếm"}
              suffix={
                <Button
                  type={"primary"}
                  size={"middle"}
                  onClick={() => goSearch()}
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
              prefix={
                <Dropdown
                  trigger={["click"]}
                  menu={{
                    items: categoryMenuItems,
                    selectedKeys: [filters.categoryIds[0]?.toString()],
                    onClick: ({ key }) =>
                      setFilters((prevState) => ({
                        ...prevState,
                        categoryIds: [Number(key)],
                      })),
                  }}
                >
                  <Space className={"searchSelect"}>
                    <Typography.Paragraph
                      ellipsis={{ rows: 1 }}
                      className={"nm-typo"}
                      // style={{ width: !isDesktop ? "50px" : "80px" }}
                    >
                      {categoryMenuItems.find(
                        (item) => item.key === filters.categoryIds[0]
                      )?.label || "Lĩnh vực"}
                    </Typography.Paragraph>
                    <DownOutlined style={{ fontSize: "12px" }} />
                  </Space>
                </Dropdown>
              }
              className={"searchInput"}
              style={{ maxWidth: "100%" }}
            />
          </Row>
        </div>
      </section>

      <section className={"sectionContainer templateSectionContainer"}>
        <div className="contentWrapper">
          <Typography.Title className={"sectionTitle"} level={3}>
            Công việc
          </Typography.Title>
          <Row gutter={[40, 64]}>
            <Col span={24}>
              <div className={"desktopFilterContainer"}>
                <JobFilterSection
                  categories={jobInitResource.categories}
                  experiences={jobInitResource.experiences}
                  times={jobInitResource.times}
                  filters={filters}
                  setFilters={setFilters}
                  // serviceCategories={jobInitResource.categoryServices}
                  // skills={skillMenuItems}
                  // services={jobInitResource.services}
                />
              </div>
            </Col>

            <Col span={24}>
              <List
                pagination={{
                  current: filters.page,
                  pageSize: 12,
                  total: totalPublicJobs,
                  align: "center",
                  hideOnSinglePage: true,
                  showSizeChanger: false,
                  onChange: (pageNumber) =>
                    setFilters((prevState) => ({
                      ...prevState,
                      page: pageNumber,
                    })),
                }}
                dataSource={publicJobs}
                loading={jobQuery.isFetching}
                grid={{
                  gutter: 24,
                  xs: 1,
                  sm: 2,
                  md: 2,
                  lg: 4,
                  xl: 4,
                  xxl: 4,
                }}
                locale={{ emptyText: "Không có dữ liệu" }}
                className={"templateListContainer"}
                renderItem={(item) => {
                  return (
                    <List.Item className={"jobItemWrapper"}>
                      {/* <JobItem data={item} /> */}
                      <JobItemV2 data={item} />
                    </List.Item>
                  );
                }}
              />
            </Col>
          </Row>
        </div>
      </section>
    </RootLayoutWithFilterCategory>
  );
}

export default JobsListScreen;
