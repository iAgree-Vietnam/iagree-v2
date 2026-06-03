
import { Tabs, Typography, List, Row, Spin, Button } from "antd";

import { PartnerResource } from "@/src/data/partner/models/partner.types";
import { FullJobResource } from "@/src/data/job/models/job.types";
import { DatasResource } from "@/src/data/base/models/base.types";
import { DefinedUseQueryResult, UseQueryResult } from "@tanstack/react-query";
import NoResultMessages from "../../SearchScreen/components/NoResultMessages";
import PartnerItem from "@/src/components/partner/PartnerItem";
import JobItem from "@/src/components/jobs/JobItem";
import { ButtonWithDottedLoadingIcon } from "@/src/components/button/ButtonWithDottedLoadingIcon";
import { FullJobResourceV2 } from "@/src/data/job/models/v2/job.types";
import JobItemV2 from "@/src/components/jobs/JobItemV2";

interface JobsAndPartnersListTabProps {
  jobsQuery: UseQueryResult<DatasResource<FullJobResourceV2>>;
  partnersQuery: DefinedUseQueryResult<DatasResource<Partial<PartnerResource>>, unknown>;
  searchTerm: string | null;
  setJobPage: React.Dispatch<React.SetStateAction<number>>;
  setPartnerPage: React.Dispatch<React.SetStateAction<number>>;
  jobPage: number;
  partnerPage: number;
  tempJobs: FullJobResourceV2[];
  tempPartners: Partial<PartnerResource>[];
  activeTabKey: string;
  setActiveTabKey: React.Dispatch<React.SetStateAction<string>>;
  onCollapseJobs: () => void;
  onCollapsePartners: () => void;
}

const JobsAndPartnersListTab: React.FC<JobsAndPartnersListTabProps> = ({
  jobsQuery: jobQuery,
  partnersQuery: partnerQuery,
  searchTerm,
  setJobPage,
  setPartnerPage,
  jobPage,
  partnerPage,
  tempJobs,
  tempPartners,
  activeTabKey,
  setActiveTabKey,
  onCollapseJobs,
  onCollapsePartners,
}) => {
  const onLoadMoreJob = () => {
    setJobPage(jobPage + 1);
  };

  const onLoadMorePartner = () => {
    setPartnerPage(partnerPage + 1);
  };

  const hasMoreJobs = tempJobs.length < (jobQuery.data?.total ?? 0);
  const hasMorePartners = tempPartners.length < (partnerQuery.data?.total ?? 0);

  const JobListContent = (
    <>
      {tempJobs && tempJobs.length > 0 ? (
        <List
          loading={jobQuery.isFetching}
          dataSource={tempJobs}
          loadMore={
            (hasMoreJobs || jobPage >= 2) && (
              <Row justify={"center"} className={"loadMoreWrapper"}>
                {hasMoreJobs && (
                  <ButtonWithDottedLoadingIcon
                    iconPosition={"end"}
                    onClick={onLoadMoreJob}
                    loading={jobQuery.isFetching}
                    disabled={jobQuery.isFetching}
                  >
                    Tải thêm
                  </ButtonWithDottedLoadingIcon>
                )}
                {jobPage >= 2 && (
                  <Button
                    type="default"
                    onClick={onCollapseJobs}
                    style={{ marginLeft: 12 }}
                  >
                    Thu gọn
                  </Button>
                )}
              </Row>
            )
          }
          grid={{ gutter: 24, xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 3 }}
          className={"jobListContainer"}
          renderItem={(item) => (
            <List.Item className={"jobItemWrapper"}>
              <JobItemV2 data={item} />
            </List.Item>
          )}
        />
      ) : jobQuery.isFetching ? (
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
      {tempPartners && tempPartners.length > 0 ? (
        <List
          loading={partnerQuery.isFetching}
          dataSource={tempPartners}
          loadMore={
            (hasMorePartners || partnerPage >= 2) && (
              <Row justify={"center"} className={"loadMoreWrapper"}>
                {hasMorePartners && (
                  <ButtonWithDottedLoadingIcon
                    iconPosition={"end"}
                    onClick={onLoadMorePartner}
                    loading={partnerQuery.isFetching}
                    disabled={partnerQuery.isFetching}
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
      ) : partnerQuery.isFetching ? (
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
    (jobQuery.isLoading && jobPage === 1 && activeTabKey === "job") ||
    (partnerQuery.isLoading && partnerPage === 1 && activeTabKey === "partner")
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
                Công việc (
                {jobQuery.isFetching && jobPage > 1
                  ? tempJobs.length
                  : jobQuery.data?.total || 0}
                )
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
                Đối tác (
                {partnerQuery.isFetching && partnerPage > 1
                  ? tempPartners.length
                  : partnerQuery.data?.total || 0}
                )
              </Typography.Title>
            ),
            children: PartnerListContent,
          },
        ]}
      />
    </div>
  );
};

export default JobsAndPartnersListTab;
