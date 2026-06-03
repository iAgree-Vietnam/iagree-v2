
import { GetServerSidePropsContext } from "next/types";
import Link from "next/link";
import { Typography } from "antd";

import UserJobsScreen from "../../../../src/screens/UserScreen/UserJobsScreen/UserJobsScreen";
import Constants from "../../../../src/constants/Constants";
import CookieUtils from "@/src/utils/CookieUtils";
import { JobResource } from "@/src/data/job/models/job.types";
import JobRouteUtils from "@/src/data/job/utils/JobRouteUtils";
import { SalaryResource } from "@/src/data/salary/models/salary.types";
import { JobParseUtils } from "@/src/data/job/utils/JobParseUtils";
import { ConstantsHelper } from "@/src/constants/ConstantsHelper";

import Seo from "@/src/components/Seo";
import { ConstantConfig } from "@/src/constants/Config";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  if (!CookieUtils.hasAccessToken(context)) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default function Component(props: any) {
  const title = "Công việc được mời";
  const description =
    "Danh sách các công việc bạn được mời tham gia trên iAgree. Trang yêu cầu đăng nhập.";

  return (
    <>
      <Seo
        title={title}
        description={description}
        canonicalPath="/user/jobs/invited"
        ogImage={ConstantConfig.DEFAULT_OG_IMAGE?.[0]?.url}
        
      />

      <UserJobsScreen
        {...props}
        hideAddButton={true}
        type={Constants.JOB.TYPE.INVITED}
        statusId={Constants.JOB.ROUTE_COMMON_STATUS.ALL}
        columns={[
          {
            dataIndex: "name",
            key: "name",
            title: "Công việc",
            render: (value: string, jobResource: JobResource) => (
              <Link href={JobRouteUtils.toDetailUrl(jobResource)}>
                <Typography.Text>{jobResource.name}</Typography.Text>
              </Link>
            ),
          },
          {
            dataIndex: "salary",
            key: "salary",
            title: "Thù lao công việc",
            width: 180,
            render: (salaryResource: SalaryResource, jobResource: JobResource) =>
              JobParseUtils.renderSalaryText(jobResource),
          },
          {
            dataIndex: "status",
            key: "status",
            title: "Trạng thái",
            width: 120,
            render: (statusId: number) => {
              const statusInfo = ConstantsHelper.getJobStatusTitle(
                statusId,
                true
              );

              return (
                <div
                  className="jobStatusContainer"
                  style={{
                    backgroundColor: statusInfo.bgColor,
                    color: statusInfo.color,
                    borderColor:
                      statusInfo.borderColor || statusInfo.bgColor,
                  }}
                >
                  {statusInfo.shortName || statusInfo.name}
                </div>
              );
            },
          },
        ]}
      />
    </>
  );
}