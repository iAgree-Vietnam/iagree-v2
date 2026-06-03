
import UserJobsScreen from "../../../../src/screens/UserScreen/UserJobsScreen/UserJobsScreen";
import Constants from "../../../../src/constants/Constants";
import { GetServerSidePropsContext } from "next/types";
import CookieUtils from "@/src/utils/CookieUtils";
import { FullJobResource, JobResource } from "@/src/data/job/models/job.types";
import Link from "next/link";
import JobRouteUtils from "@/src/data/job/utils/JobRouteUtils";
import { Tag, Typography } from "antd";
import { SalaryResource } from "@/src/data/salary/models/salary.types";
import { JobParseUtils } from "@/src/data/job/utils/JobParseUtils";
import { ConstantsHelper } from "@/src/constants/ConstantsHelper";
import { useAccountContext } from "@/src/contexts/AccountContext";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  if (!CookieUtils.hasAccessToken(context)) {
    return {
      redirect: {
        destination: "/login",
        permanent: true,
      },
    };
  }

  return {
    props: {},
  };
};

const PAGE_TYPE = Constants.JOB.TYPE.APPLY;

export default function Component(props: any) {
  const { auth: fullProfileResource } = useAccountContext();

  return (
    <UserJobsScreen
      {...props}
      hideAddButton={true}
      type={Constants.JOB.TYPE.APPLY}
      statusId={Constants.JOB.ROUTE_COMMON_STATUS.ALL}
      columns={[
        {
          dataIndex: "name",
          key: "name",
          title: "Công việc",
          render: (value: string, jobResource: JobResource) => {
 
            return (
              <Link href={JobRouteUtils.toDetailUrl(jobResource)}>
                <Typography.Text>{jobResource.name}</Typography.Text>
              </Link>
            );
          },
        }, //user_project_bids?.[0]?.application_letter
        {
          dataIndex: "salary",
          key: "salary",
          title: "Thù lao công việc",
          width: 180,
          render: (salaryResource: SalaryResource, jobResource: JobResource) =>
            JobParseUtils.renderSalaryText(jobResource),
        },
        {
          dataIndex: "applyDate",
          key: "applyDate",
          title: "Ngày nộp đơn",
          width: 130,
        },
        {
          dataIndex: "status",
          key: "status",
          title: "Trạng thái",
          width: 120,
          render: (statusId: number, jobResource: FullJobResource) => {           
            if (PAGE_TYPE === Constants.JOB.TYPE.APPLY) {
              const userBid = jobResource.userProjectBids?.find(
                (bid) => bid.userId === fullProfileResource?.userId
              );

              if (
                userBid &&
                userBid.status === Constants.PARTNER.STATUS_APPLY_KEY.REJECTED
              ) {
                return (
                  <div
                    className={"jobStatusContainer"}
                    style={{
                      backgroundColor: 'red',
                      color: 'white',
                      borderColor: 'red',
                    }}
                  >
                    Bị từ chối
                  </div>
                )
              }
            }

            const statusInfo = ConstantsHelper.getJobStatusTitle(
              statusId,
              true
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
      ]}
    />
  );
}
