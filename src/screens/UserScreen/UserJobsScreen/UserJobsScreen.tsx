import React, { useEffect, useMemo, useRef, useState } from "react";
import RootLayout from "@/src/layouts/RootLayout";
import Head from "next/head";
import {
  Breadcrumb,
  Button,
  Col,
  Input,
  Row,
  Space,
  Table,
  Tabs,
  TabsProps,
  Typography,
} from "antd";
import Link from "next/link";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import {
  FullJobResource,
  JobsFilterParams,
} from "@/src/data/job/models/job.types";
import usePaginatedJobs from "@/src/screens/JobScreen/hooks/usePaginatedJobs";
import { ConstantsHelper } from "@/src/constants/ConstantsHelper";
import JobSidebarRoutes from "@/src/screens/JobScreen/components/JobSidebarRoutes";
import { SalaryResource } from "@/src/data/salary/models/salary.types";
import JobRouteUtils from "@/src/data/job/utils/JobRouteUtils";
import Constants from "@/src/constants/Constants";
import { useRouter } from "next/router";
import { JobParseUtils } from "@/src/data/job/utils/JobParseUtils";
import { ColumnType } from "antd/es/table";
import { useAccountContext } from "@/src/contexts/AccountContext";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import JobDeleteModal, {
  JobDeleteModalizeHelperVisible,
} from "@/src/screens/JobScreen/JobDetailScreen/modals/JobDeteleModal";
import { ButtonWithIcon } from "@/src/components/button";
import { useBreakpoint } from "@/src/hooks/useBreakpoint";
import datetimeUtils from "@/src/utils/DatetimeUtils";
import { isEmpty, size } from "lodash";
import { ContentTree } from "./component/ContentTree";
import StringUtils from "@/src/utils/StringUtils";
import { FullJobResourceV2 } from "@/src/data/job/models/v2/job.types";
import { JobParseUtilsV2 } from "@/src/data/job/utils/JobParseUtilsV2";

interface UserJobsScreenProps {
  type: number;
  statusId: number;
  columns?: ColumnType<FullJobResourceV2>[];
  hideAddButton: boolean;
}

const initData = {
  items: [],
  total_by_status: [],
  total: 0,
  count_total_by_status: 0,
};

function UserJobsScreen(props: UserJobsScreenProps) {
  const { type, statusId, hideAddButton = false } = props;
  const isApply = type === Constants.JOB.TYPE.APPLY;

  const router = useRouter();
  const { isDesktop, isMobile } = useBreakpoint();

  const { auth: fullProfileResource } = useAccountContext();

  const jobDeleteModalRef = useRef<JobDeleteModalizeHelperVisible>(null);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // ⏱️ Debounce 1 giây
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchInput]);
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      search: debouncedSearch,
      page: 1, // reset về trang đầu khi tìm kiếm
    }));
  }, [debouncedSearch]);
  // const [search, setSearch] = useState<string | null>(null);
  const [filters, setFilters] = useState<JobsFilterParams>({
    page: 1,
    type: type,
    statusId: statusId,
    search: "",
    categoryIds: [],
    timeIds: [],
    salaryId: null,
    experienceId: null,
    tagIds: [],
    locationIds: [],
    skillIds: [],
    categoryServiceIds: [],
    serviceIds: [],
  });
  // const [sort, setSort] = useState<string[] | null>(null);

  const jobQuery = usePaginatedJobs({
    filters,
    initData,
    per_page: 12,
    version: 1,
  });

  const jobDatasResource = jobQuery.data;

  const jobFilterCount: Record<string, number> =
    jobDatasResource!.total_by_status?.reduce(
      (result, item) => ({ ...result, [item.status]: item.total_status }),
      {}
    ) || {};

  const pageTitle = ConstantsHelper.getAuthJobTitle(type);
  // const onChangeSearch = useCallback(
  //   () => setFilters((prevState) => ({ ...prevState, search })),
  //   [search]
  // );
  const filteredJobs = useMemo(() => {
    if (!jobDatasResource?.items) return [];
    if (!debouncedSearch.trim()) return jobDatasResource.items;

    return jobDatasResource.items.filter((job) =>
      StringUtils.isSoftMatch(job.name, debouncedSearch)
    );
  }, [JSON.stringify(jobDatasResource?.items), debouncedSearch]);
  const filteredJobFilterCount = useMemo(() => {
    if (!filteredJobs?.length) return {};
    return filteredJobs.reduce((acc, job) => {
      acc[job.status] = (acc[job.status] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
  }, [filteredJobs]);
  function getColumns() {
    const defaultColumns: (ColumnType<FullJobResourceV2> & {
      order?: number;
    })[] = props.columns
      ? props.columns
      : [
          {
            dataIndex: "name",
            key: "name",
            title: "Công việc",
            order: 1,
            render: (value: string, jobResource: FullJobResourceV2) => (
              <Link href={JobRouteUtils.toDetailUrl(jobResource)}>
                <Typography.Text>
                  {/* {jobResource.name} */}

                  <ContentTree
                    text={jobResource?.name || ""}
                    highlight={debouncedSearch}
                  />
                </Typography.Text>
              </Link>
            ),
            width: 200,
          },
          {
            dataIndex: "salary",
            key: "salary",
            title: "Thù lao công việc",
            order: 2,
            width: 180,
            render: (
              salaryResource: SalaryResource,
              jobResource: FullJobResourceV2
            ) => JobParseUtilsV2.renderSalaryText(jobResource),
          },
          // {
          //     dataIndex: 'endDate',
          //     key: 'endDate',
          //     title: 'Hạn ứng tuyển',
          //     width: 130,
          // },
          {
            dataIndex: "status",
            key: "status",
            title: "Trạng thái",
            order: 98,
            width: 120,
            render: (statusId: number, jobResource: FullJobResourceV2) => {
              const isPartner =
                jobResource.partnerUserId === fullProfileResource?.userId;

              const statusInfo = ConstantsHelper.getJobStatusTitle(
                statusId,
                isPartner
              );

              return (
                <div
                  className={"jobStatusContainer"}
                  style={{
                    backgroundColor: statusInfo.bgColor,
                    color: statusInfo.color,
                    borderColor: statusInfo.borderColor || statusInfo.bgColor,
                  }}
                >
                  {statusInfo.shortName || statusInfo.name}
                </div>
              );
            },
          },
          {
            dataIndex: "updatedDate",
            key: "updatedDate",
            title: "Cập nhật lúc",
            order: 99,
            width: 130,
          },
        ];

    // if (
    //   filters.type === Constants.JOB.TYPE.MANAGEMENT &&
    //   filters.statusId === Constants.JOB.ROUTE_MANAGE_STATUS.TIM_DOI_TAC
    // ) {
    //   defaultColumns.push({
    //     dataIndex: "user_project_bids",
    //     key: "user_project_bids",
    //     title: "Số đối tác đã ứng tuyển",
    //     order: 3,
    //     render: (value: string, jobResource: FullJobResource) => {

    //       return (
    //         <Link href={JobRouteUtils.toDetailUrl(jobResource)}>
    //           <Typography.Text>
    //             {/* {jobResource?.user_project_bids?.[0]?.application_letter} */}
    //           </Typography.Text>
    //         </Link>
    //       );
    //     },
    //     width: 200,
    //   });
    // }

    // if (
    //   filters.type === Constants.JOB.TYPE.MANAGEMENT &&
    //   (filters.statusId === Constants.JOB.ROUTE_COMMON_STATUS.DANG_THUC_HIEN ||
    //     filters.statusId === Constants.JOB.ROUTE_COMMON_STATUS.HOAN_THANH)
    // ) {
    //   defaultColumns.push({
    //     dataIndex: "user_project_bids",
    //     key: "user_project_bids",
    //     title: "Tên đối tác",
    //     order: 3,
    //     render: (value: string, jobResource: FullJobResource) => {

    //       return (
    //         <Link href={JobRouteUtils.toDetailUrl(jobResource)}>
    //           <Typography.Text>
    //             {/* {jobResource?.user_project_bids?.[0]?.application_letter} */}
    //           </Typography.Text>
    //         </Link>
    //       );
    //     },
    //   });
    // }

    const actionCol: ColumnType<FullJobResourceV2> & { order: number } = {
      dataIndex: "actions",
      key: "actions",
      title: "",
      order: 100,
      fixed: "right",
      align: "right",
      width: 80,
      render: (value: any, jobResource: FullJobResourceV2) => {
        return (
          <Row justify={"end"}>
            <Space size={"small"} align={"end"}>
              {renderActions(jobResource).map((actionBtn, actionBtnIndex) => (
                <div key={actionBtnIndex.toString()}>{actionBtn}</div>
              ))}
            </Space>
          </Row>
        );
      },
    };

    // return defaultColumns.concat([actionCol]);
    return defaultColumns
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .concat([actionCol]);
  }

  function renderActions(jobResource: FullJobResourceV2) {
    let actions: React.ReactNode[] = [];

    const viewActionBtn = (
      <Link href={JobRouteUtils.toDetailUrl(jobResource)}>
        <Button icon={<EyeOutlined />} className={"btnAction"} />
      </Link>
    );

    // const editActionBtn = (
    //   <Link href={JobRouteUtils.toEditUrl(jobResource)}>
    //     <Button icon={<EditOutlined />} className={"btnAction"} />
    //   </Link>
    // );

    // const deleteActionBtn = (
    //   <Button
    //     className={"btnAction"}
    //     icon={<DeleteOutlined />}
    //     onClick={() => jobDeleteModalRef.current?.open(jobResource)}
    //   />
    // );

    switch (jobResource.status) {
      // case Constants.JOB.STATUS.LUU_NHAP: {
      //   actions = [viewActionBtn, editActionBtn, deleteActionBtn];
      //   break;
      // }

      // case Constants.JOB.STATUS.CANCEL_DANG_TUYEN: {
      //   actions = [viewActionBtn, deleteActionBtn];
      //   break;
      // }

      default: {
        actions = [viewActionBtn];
        break;
      }
    }

    return actions;
  }

  function getTabs() {
    const tab: TabsProps["items"] = [
      {
        key: Constants.JOB.ROUTE_COMMON_STATUS.ALL.toString(),
        label: `Tất cả (${
          !isEmpty(debouncedSearch)
            ? size(filteredJobs)
            : jobDatasResource?.count_total_by_status
        })`,
      },
    ];

    if (!isApply && type === Constants.JOB.TYPE.MANAGEMENT) {
      tab.push({
        key: Constants.JOB.ROUTE_MANAGE_STATUS.DANG_CHO_DUYET.toString(),
        label: `Đang chờ duyệt (${
          // jobFilterCount[Constants.JOB.STATUS.YEU_CAU_DANG_TUYEN] || 0
          (!isEmpty(debouncedSearch) ? filteredJobFilterCount : jobFilterCount)[
            Constants.JOB.STATUS.YEU_CAU_DANG_TUYEN
          ] || 0
        })`,
      });
    }

    if (isApply && type === Constants.JOB.TYPE.APPLY) {
      tab.push({
        key: Constants.JOB.ROUTE_APPLY_STATUS.UNG_TUYEN.toString(),
        label: `Ứng tuyển (${
          // jobFilterCount[Constants.JOB.STATUS.CHO_UNG_TUYEN] || 0
          (!isEmpty(debouncedSearch) ? filteredJobFilterCount : jobFilterCount)[
            Constants.JOB.STATUS.CHO_UNG_TUYEN
          ] || 0
        })`,
      });
    } else {
      tab.push({
        key: Constants.JOB.ROUTE_MANAGE_STATUS.DANG_TUYEN.toString(),
        label: `Đăng tuyển (${
          // jobFilterCount[Constants.JOB.ROUTE_MANAGE_STATUS.DANG_TUYEN] || 0
          (!isEmpty(debouncedSearch) ? filteredJobFilterCount : jobFilterCount)[
            Constants.JOB.ROUTE_MANAGE_STATUS.DANG_TUYEN
          ] || 0
        })`,
      });
    }

    if (!isApply && type === Constants.JOB.TYPE.MANAGEMENT) {
      tab.push({
        key: Constants.JOB.ROUTE_MANAGE_STATUS.TIM_DOI_TAC.toString(),
        label: `Tìm đối tác (${
          // jobFilterCount[Constants.JOB.STATUS.CHO_UNG_TUYEN] || 0
          (!isEmpty(debouncedSearch) ? filteredJobFilterCount : jobFilterCount)[
            Constants.JOB.STATUS.CHO_UNG_TUYEN
          ] || 0
        })`,
      });
    }

    // if (!isApply && type === Constants.JOB.TYPE.MANAGEMENT) {
    tab.push({
      key: Constants.JOB.ROUTE_MANAGE_STATUS.TAM_UNG.toString(),
      label: `Chờ thanh toán (${
        // jobFilterCount[Constants.JOB.STATUS.TAM_UNG_THANH_TOAN] || 0
        (!isEmpty(debouncedSearch) ? filteredJobFilterCount : jobFilterCount)[
          Constants.JOB.STATUS.TAM_UNG_THANH_TOAN
        ] || 0
      })`,
    });
    // }

    if (!isApply && type === Constants.JOB.TYPE.MANAGEMENT) {
      tab.push({
        key: Constants.JOB.ROUTE_MANAGE_STATUS.CHO_PARTNER_XAC_NHAN.toString(),
        label: `Chờ Đối Tác xác nhận (${
          // jobFilterCount[Constants.JOB.STATUS.CHO_PARTNER_XAC_NHAN] || 0
          (!isEmpty(debouncedSearch) ? filteredJobFilterCount : jobFilterCount)[
            Constants.JOB.STATUS.CHO_PARTNER_XAC_NHAN
          ] || 0
        })`,
      });
    }

    if (isApply && type === Constants.JOB.TYPE.APPLY) {
      tab.push({
        key: Constants.JOB.ROUTE_MANAGE_STATUS.CHO_PARTNER_XAC_NHAN.toString(),
        label: `Xác nhận thực hiện (${
          // jobFilterCount[Constants.JOB.STATUS.CHO_PARTNER_XAC_NHAN] || 0
          (!isEmpty(debouncedSearch) ? filteredJobFilterCount : jobFilterCount)[
            Constants.JOB.STATUS.CHO_PARTNER_XAC_NHAN
          ] || 0
        })`,
      });
    }

    // if (isApply && type === Constants.JOB.TYPE.APPLY) {
    //   tab.push({
    //     key: Constants.JOB.ROUTE_APPLY_STATUS.UNG_TUYEN.toString(),
    //     label: `Ứng tuyển (${
    //       jobFilterCount[Constants.JOB.STATUS.CHO_UNG_TUYEN] || 0
    //     })`,
    //   });
    // }

    // tab.push({
    //     key: Constants.JOB.ROUTE_COMMON_STATUS.KY_HOP_DONG.toString(),
    //     label: `Ký hợp đồng (${jobFilterCount[Constants.JOB.ROUTE_COMMON_STATUS.KY_HOP_DONG] || 0
    //         })`,
    // });

    if (type !== Constants.JOB.TYPE.INVITED) {
      tab.push({
        key: Constants.JOB.ROUTE_COMMON_STATUS.DANG_THUC_HIEN.toString(),
        label: `Đang thực hiện (${
          // jobFilterCount[Constants.JOB.ROUTE_COMMON_STATUS.DANG_THUC_HIEN] || 0
          (!isEmpty(debouncedSearch) ? filteredJobFilterCount : jobFilterCount)[
            Constants.JOB.ROUTE_COMMON_STATUS.DANG_THUC_HIEN
          ] || 0
        })`,
      });
    }

    // if (isApply) {
    //     tab.push({
    //         key: Constants.JOB.ROUTE_APPLY_STATUS.GUI_KET_QUA.toString(),
    //         label: `Gửi kết quả (${jobFilterCount[Constants.JOB.ROUTE_APPLY_STATUS.GUI_KET_QUA] || 0
    //             })`,
    //     });
    // }

    tab.push({
      key: Constants.JOB.ROUTE_COMMON_STATUS.CHO_NGHIEM_THU.toString(),
      label: `Chờ nghiệm thu (${
        // jobFilterCount[Constants.JOB.ROUTE_COMMON_STATUS.CHO_NGHIEM_THU] || 0
        (!isEmpty(debouncedSearch) ? filteredJobFilterCount : jobFilterCount)[
          Constants.JOB.ROUTE_COMMON_STATUS.CHO_NGHIEM_THU
        ] || 0
      })`,
    });

    tab.push({
      key: Constants.JOB.ROUTE_COMMON_STATUS.DUYET_KET_QUA.toString(),
      label: `Duyệt kết quả (${
        // jobFilterCount[Constants.JOB.ROUTE_COMMON_STATUS.DUYET_KET_QUA] || 0
        (!isEmpty(debouncedSearch) ? filteredJobFilterCount : jobFilterCount)[
          Constants.JOB.ROUTE_COMMON_STATUS.DUYET_KET_QUA
        ] || 0
      })`,
    });

    if (type !== Constants.JOB.TYPE.INVITED) {
      tab.push({
        key: Constants.JOB.ROUTE_COMMON_STATUS.HOAN_THANH.toString(),
        label: `Hoàn thành (${
          // jobFilterCount[Constants.JOB.ROUTE_COMMON_STATUS.HOAN_THANH] || 0
          (!isEmpty(debouncedSearch) ? filteredJobFilterCount : jobFilterCount)[
            Constants.JOB.ROUTE_COMMON_STATUS.HOAN_THANH
          ] || 0
        })`,
      });
    }

    tab.push({
      key: Constants.JOB.ROUTE_COMMON_STATUS.HUY.toString(),
      label: `Hủy (${
        // jobFilterCount[Constants.JOB.ROUTE_COMMON_STATUS.HUY] || 0
        (!isEmpty(debouncedSearch) ? filteredJobFilterCount : jobFilterCount)[
          Constants.JOB.ROUTE_COMMON_STATUS.HUY
        ] || 0
      })`,
    });

    return tab;
  }
  const { isTablet } = useBreakpoint();
  const pageSize = useMemo(() => {
    switch (true) {
      case isDesktop:
        return 12;
      case isTablet:
        return 6;
      default:
        return 3;
    }
  }, [isDesktop, isTablet]);

  return (
    <RootLayout>
      <Head>
        <title>{`${pageTitle}`}</title>
      </Head>

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
              {
                title: "Công việc",
                href: JobRouteUtils.toJobsSearchScreen({}),
              },
              { title: pageTitle },
            ]}
          />
        </div>
      </section>

      <section className={"sectionContainer jobManage"}>
        <div className="contentWrapper">
          <Row gutter={[40, 24]}>
            <Col xs={24} lg={6}>
              <div className={"desktopFilterContainer"}>
                <JobSidebarRoutes type={type} statusId={statusId} />
              </div>
            </Col>

            <Col xs={24} lg={18}>
              <div className={"jobListContainer"}>
                <Row
                  justify={"space-between"}
                  align={"middle"}
                  // style={{ marginBottom: "32px" }}
                  gutter={[24, 24]}
                  style={{
                    marginBottom: "32px",
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: "center",
                    gap: isMobile ? "16px" : "0px",
                  }}
                >
                  <Col>
                    <Typography.Title level={3} className={"title nm-typo"}>
                      {type === Constants.JOB.TYPE.MANAGEMENT
                        ? "Công việc đăng tuyển"
                        : type === Constants.JOB.TYPE.APPLY
                        ? "Công việc ứng tuyển"
                        : // : type === Constants.JOB.TYPE.INVITED
                          // ? "Công việc được mời"
                          ""}
                    </Typography.Title>
                  </Col>

                  {!hideAddButton && (
                    // <Col span={!isApply ? 24 : "auto"}>
                    <ButtonWithIcon
                      size={"large"}
                      icon={
                        <IconSvgLocal
                          name={"IC_ARROW_RIGHT"}
                          width={26}
                          height={9}
                        />
                      }
                      iconPosition={"end"}
                      onClick={() => router.push(JobRouteUtils.toAddScreen())}
                      block
                    >
                      Đăng công việc mới
                    </ButtonWithIcon>
                    // </Col>
                  )}
                </Row>
                <Row
                  justify="space-between"
                  align="middle"
                  style={{ marginBottom: "16px" }}
                >
                  <Input
                    placeholder="Tìm công việc..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    style={{
                      width: "100%",
                    }}
                    allowClear
                  />
                </Row>
                <Tabs
                  defaultActiveKey={Constants.JOB.ROUTE_COMMON_STATUS.ALL.toString()}
                  items={getTabs()}
                  onChange={(activeKey) =>
                    setFilters((prevState) => ({
                      ...prevState,
                      statusId: Number(activeKey),
                    }))
                  }
                />

                <Table
                  columns={getColumns()}
                  loading={jobQuery.isRefetching}
                  dataSource={jobDatasResource?.items}
                  pagination={{
                    position: ["bottomCenter"],
                    current: filters.page,
                    pageSize,
                    hideOnSinglePage: true,
                    showSizeChanger: false,
                    total: jobDatasResource?.total,
                    onChange: (pageNumber) =>
                      setFilters((prevState) => ({
                        ...prevState,
                        page: pageNumber,
                      })),
                  }}
                  locale={{
                    emptyText:
                      !jobQuery.isFetching &&
                      isApply &&
                      filters.statusId ===
                        Constants.JOB.ROUTE_COMMON_STATUS.ALL ? (
                        <Space
                          direction={"vertical"}
                          className={"d-flex"}
                          size={30}
                        >
                          <Typography.Title
                            level={5}
                            className={"nm-typo text-center"}
                            style={{ marginTop: "14px" }}
                          >
                            Bạn chưa ứng tuyển công việc nào
                          </Typography.Title>
                          <Link href={JobRouteUtils.toJobsSearchScreen({})}>
                            <Button
                              type={"primary"}
                              size={"large"}
                              style={{ width: !isDesktop ? "100%" : "300px" }}
                            >
                              Tìm việc ngay
                            </Button>
                          </Link>
                        </Space>
                      ) : (
                        "Không có dữ liệu"
                      ),
                  }}
                  scroll={{ x: "max-content" }}
                  rowKey={"jobId"}
                  style={{ marginTop: "14px" }}
                />
              </div>
            </Col>
          </Row>
        </div>
      </section>

      <JobDeleteModal ref={jobDeleteModalRef} />
    </RootLayout>
  );
}

export default UserJobsScreen;
