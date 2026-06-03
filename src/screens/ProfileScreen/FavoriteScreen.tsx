import React, { useState } from 'react';
import RootLayout from '@/src/layouts/RootLayout';
import Head from 'next/head';
import { Breadcrumb, List, Tabs } from 'antd';

import { ProfileContainer } from '@/src/components/ProfileContainer';
import { IconSvgLocal } from '@/src/components/icon-svg-local';
import usePaginatedJobs from '../JobScreen/hooks/usePaginatedJobs';
import { JobsFilterParams } from '@/src/data/job/models/job.types';
import Constants from '@/src/constants/Constants';
import useFavoritePartners from '../PartnerScreen/hooks/useFavoritePartners';
import PartnerItem from '@/src/components/partner/PartnerItem';
import { useQueryClient } from '@tanstack/react-query';
import JobItem from '@/src/components/jobs/JobItem';
import JobItemV2 from '@/src/components/jobs/JobItemV2';
import useFavoriteProjects from '../JobScreen/hooks/useFavoriteProjects';

const initData = {
    items: [],
    total: 0,
};

function FavoriteScreen(props: any) {
    const queryClient = useQueryClient();

    const [filters, setFilters] = useState<JobsFilterParams>({
        page: 1,
        type: Constants.JOB.TYPE.APPLY,
        statusId: Constants.JOB.ROUTE_APPLY_STATUS.DA_LUU,
        search: '',
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

    // const jobQuery = usePaginatedJobs({ filters, initData, per_page: 9 });
    const jobQuery = useFavoriteProjects();
    const partnerQuery = useFavoritePartners();

    const jobDatasResource = jobQuery.data;
    const partnerDatasResource = partnerQuery.data;

    return (
        <RootLayout>
            <Head>
                <title>Yêu thích</title>
            </Head>

            <section className={'breadcrumbContainer'}>
                <div className="contentWrapper">
                    <Breadcrumb
                        items={[
                            {
                                title: (
                                    <>
                                        <IconSvgLocal name={'IC_HOME'} />
                                        <span>Trang chủ</span>
                                    </>
                                ),
                                href: '/',
                            },
                            { title: 'Yêu thích' },
                        ]}
                    />
                </div>
            </section>
            <ProfileContainer>
                <h1 className={'pageHeaderTitle'} style={{ marginBottom: '28px' }}>
                    Yêu thích
                </h1>
                <Tabs
                    defaultActiveKey={'1'}
                    items={[
                        {
                            key: '1',
                            label: `Công việc (${jobDatasResource?.total})`,
                            children: (
                                <List
                                    pagination={{
                                        current: filters.page,
                                        pageSize: 9,
                                        total: jobDatasResource?.total,
                                        align: 'center',
                                        hideOnSinglePage: true,
                                        showSizeChanger: false,
                                        onChange: (pageNumber) =>
                                            setFilters((prevState) => ({
                                                ...prevState,
                                                page: pageNumber,
                                            })),
                                    }}
                                    dataSource={jobDatasResource?.items}
                                    loading={jobQuery.isFetching}
                                    grid={{
                                        gutter: 24,
                                        xs: 1,
                                        sm: 2,
                                        md: 2,
                                        lg: 3,
                                        xl: 3,
                                        xxl: 3,
                                    }}
                                    locale={{ emptyText: 'Không có dữ liệu' }}
                                    className={'templateListContainer'}
                                    renderItem={(item) => {
                                        return (
                                            <List.Item className={'jobItemWrapper'}>
                                                {/* <JobItem
                                                    data={item}
                                                    onReactionSuccess={() =>
                                                        queryClient.invalidateQueries([
                                                            'JOBS_SCREEN',
                                                            filters,
                                                        ])
                                                    }
                                                /> */}
                                                <JobItemV2
                                                    data={item}
                                                    onReactionSuccess={() =>
                                                        queryClient.invalidateQueries([
                                                            'JOBS_SCREEN',
                                                            filters,
                                                        ])
                                                    }
                                                />
                                            </List.Item>
                                        );
                                    }}
                                    style={{ marginTop: '24px' }}
                                />
                            ),
                        },
                        {
                            key: '2',
                            label: `Đối tác (${partnerDatasResource?.length || 0})`,
                            children: (
                                <List
                                    pagination={{
                                        pageSize: 9,
                                        align: 'center',
                                        hideOnSinglePage: true,
                                        showSizeChanger: false,
                                    }}
                                    dataSource={partnerDatasResource}
                                    loading={partnerQuery.isFetching}
                                    grid={{
                                        gutter: 16,
                                        xs: 1,
                                        sm: 2,
                                        md: 2,
                                        lg: 3,
                                        xl: 3,
                                        xxl: 3,
                                    }}
                                    locale={{ emptyText: 'Không có dữ liệu' }}
                                    className={'templateListContainer'}
                                    renderItem={(item) => {
                                        return (
                                            <List.Item className={'partnerItemWrapper'}>
                                                <PartnerItem
                                                    data={item}
                                                    onReactionSuccess={() =>
                                                        queryClient.invalidateQueries(['PARTNERS_FAVORITE'])
                                                    }
                                                />
                                            </List.Item>
                                        );
                                    }}
                                    style={{ marginTop: '24px' }}
                                />
                            ),
                        },
                    ]}
                />
            </ProfileContainer>
        </RootLayout>
    );
}

export default FavoriteScreen;
