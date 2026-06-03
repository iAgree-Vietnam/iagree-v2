import React from 'react';
import UserJobsScreen from '../../../../src/screens/UserScreen/UserJobsScreen/UserJobsScreen';
import Constants from '../../../../src/constants/Constants';
import { GetServerSidePropsContext } from 'next/types';
import CookieUtils from '@/src/utils/CookieUtils';
import { JobResource } from '@/src/data/job/models/job.types';
import Link from 'next/link';
import JobRouteUtils from '@/src/data/job/utils/JobRouteUtils';
import { Typography } from 'antd';
import { SalaryResource } from '@/src/data/salary/models/salary.types';
import { JobParseUtils } from '@/src/data/job/utils/JobParseUtils';
import { ConstantsHelper } from '@/src/constants/ConstantsHelper';

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    if (!CookieUtils.hasAccessToken(context)) {
        return {
            redirect: {
                destination: '/login',
                permanent: true,
            },
        };
    }

    return {
        props: {},
    };
};

export default function Component(props: any) {

    return (
        <UserJobsScreen
            {...props}
            type={Constants.JOB.TYPE.MANAGEMENT}
            statusId={Constants.JOB.ROUTE_COMMON_STATUS.DANG_THUC_HIEN}
            columns={[
                {
                    dataIndex: 'name',
                    key: 'name',
                    title: 'Công việc',
                    render: (value: string, jobResource: JobResource) => (
                        <Link href={JobRouteUtils.toDetailUrl(jobResource)}>
                            <Typography.Text>{jobResource.name}</Typography.Text>
                        </Link>
                    ),
                },
                {
                    dataIndex: 'salary',
                    key: 'salary',
                    title: 'Mức lương',
                    width: 180,
                    render: (salaryResource: SalaryResource, jobResource: JobResource) => JobParseUtils.renderSalaryText(jobResource),
                },
                {
                    dataIndex: 'contractDate',
                    key: 'contractDate',
                    title: 'Ngày hợp đồng',
                    width: 150,
                    render: (value: string, jobResource: JobResource) => jobResource.contract?.createdDate || '...',
                },
                {
                    dataIndex: 'endDate',
                    key: 'endDate',
                    title: 'Thời hạn',
                    width: 130,
                },
                {
                    dataIndex: 'status',
                    key: 'status',
                    title: 'Trạng thái',
                    width: 120,
                    render: (statusId: number) => {
                        const statusInfo = ConstantsHelper.getJobStatusTitle(statusId);

                        return (
                            <div
                                className={'jobStatusContainer'}
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
    );
}
