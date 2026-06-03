import { Tabs, Typography, Row, Col, Spin, Pagination } from "antd";

import NoResultMessages from "./NoResultMessages";
import { PartnerResource } from "@/src/data/partner/models/partner.types";
import { FullJobResource } from "@/src/data/job/models/job.types";
import PartnerItem from "@/src/components/partner/PartnerItem";
import JobItem from "@/src/components/jobs/JobItem";
import { UseQueryResult } from "@tanstack/react-query";
import { DatasResource } from "@/src/data/base/models/base.types";
import { RawJobFilterInfo } from "@/src/data/job/models/job.raw";
import { FullJobResourceV2 } from "@/src/data/job/models/v2/job.types";
import JobItemV2 from "@/src/components/jobs/JobItemV2";

interface SearchTabsComponentProps {
  jobsQuery: UseQueryResult<
    DatasResource<FullJobResourceV2> & RawJobFilterInfo
  >;
  partnersQuery: UseQueryResult<DatasResource<Partial<PartnerResource>>>;
  searchTerm: string | null;
  setJobPage: React.Dispatch<React.SetStateAction<number>>;
  setPartnerPage: React.Dispatch<React.SetStateAction<number>>;
  jobPage: number;
  partnerPage: number;
  activeTabKey: string;
  setActiveTabKey: React.Dispatch<React.SetStateAction<string>>;
  tempJobs: FullJobResourceV2[];
  tempPartners: Partial<PartnerResource>[];
}

const per_page_job = 6;
const per_page_partner = 6;

const SearchTabsComponent: React.FC<SearchTabsComponentProps> = ({
  jobsQuery,
  partnersQuery,
  searchTerm,
  setJobPage,
  setPartnerPage,
  jobPage,
  partnerPage,
  activeTabKey,
  setActiveTabKey,
  tempJobs,
  tempPartners,
}) => {
  const JobListContent = (
    <>
      {tempJobs && tempJobs.length > 0 ? (
        <div
          className="jobListContainer"
          style={{ position: "relative", minHeight: 120, marginBottom: 30 }}
        >
          <Spin spinning={jobsQuery.isFetching} tip="Đang tải...">
            <Row gutter={[20, 24]}>
              {tempJobs?.map((item) => (
                <Col
                  xs={24}
                  sm={24}
                  md={12}
                  lg={8}
                  xl={12}
                  xxl={8}
                  key={item.jobId || item.jobId}
                >
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
              pageSize={per_page_job}
              showSizeChanger={false}
              onChange={(page) => {
                setJobPage(page);
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

  const PartnerListContent = (
    <>
      {/* Thay đổi logic hiển thị */}
      {tempPartners && tempPartners.length > 0 ? (
        <div
          className="partnerListContainer"
          style={{ position: "relative", minHeight: 120, marginBottom: 30 }}
        >
          <Spin spinning={partnersQuery.isFetching} tip="Đang tải...">
            <Row gutter={[20, 24]}>
              {tempPartners?.map((item) => (
                <Col
                  xs={24}
                  sm={24}
                  md={12}
                  lg={8}
                  xl={12}
                  xxl={8}
                  key={item.partnerId || item.id}
                >
                  <PartnerItem data={item} />
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
              current={partnerPage}
              total={partnersQuery.data?.total}
              pageSize={per_page_partner}
              showSizeChanger={false}
              onChange={(page) => {
                setPartnerPage(page);
              }}
              disabled={partnersQuery.isFetching}
            />
          </Row>
        </div>
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
        <NoResultMessages searchTerm={searchTerm} type="Đối tác" />
      )}
    </>
  );

  if (
    (jobsQuery.isLoading && jobPage === 1 && activeTabKey === "job") ||
    (partnersQuery.isLoading && partnerPage === 1 && activeTabKey === "partner")
  ) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  return (
    <div className="contentWrapperSearch" style={{ minHeight: "auto" }}>
      <Tabs
        className="custom-tabs-styling"
        size="large"
        activeKey={activeTabKey}
        onChange={setActiveTabKey}
        items={[
          {
            key: "job",
            label: (
              <Typography.Title
                style={{
                  marginBottom: 0,
                  fontWeight: "400",
                  fontSize: "22px",
                }}
              >
                Công việc ({jobsQuery.data?.total || 0})
              </Typography.Title>
            ),
            children: JobListContent,
          },
          {
            key: "partner",
            label: (
              <Typography.Title
                style={{
                  marginBottom: 0,
                  fontWeight: "400",
                  fontSize: "22px",
                }}
              >
                Đối tác ({partnersQuery.data?.total || 0})
              </Typography.Title>
            ),
            children: PartnerListContent,
          },
        ]}
      />
    </div>
  );
};

export default SearchTabsComponent;
