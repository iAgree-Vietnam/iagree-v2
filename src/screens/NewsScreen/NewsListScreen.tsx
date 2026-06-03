import React, { useState } from 'react';
import Head from 'next/head';
import { Breadcrumb, Col, List, Row } from 'antd';

import RootLayout from '@/src/layouts/RootLayout';
import NewsItem from '@/src/components/news/NewsItem';
import {
    PostFilterParams,
    PostInitResource,
} from '@/src/data/post/models/post.types';
import { usePaginatedNews } from '@/src/screens/NewsScreen/hooks/usePaginatedNews';
import { IconSvgLocal } from '@/src/components/icon-svg-local';

function NewsListScreen(props: any) {
    const postInitResource: PostInitResource = props.data;

    const [filters, setFilters] = useState<PostFilterParams>({
        page: 1,
    });

    const { data: news, isFetching } = usePaginatedNews({
        filters: filters,
        initData: postInitResource,
    });

    return (
        <RootLayout>
            <Head>
                <title>Tin tức</title>
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
                            { title: 'Tin tức' },
                        ]}
                    />
                </div>
            </section>

            <section className={'pageHeaderWrapper'}>
                <div className="contentWrapper">
                    <div className={'pageHeaderContainer noRadius'}>
                        <h1 className={'pageHeaderTitle breadcrumbContainer'} style={{ textAlign: 'left', paddingBottom: 0,marginBottom: 0, color: '#25272D' }}>Tin tức</h1>
                    </div>
                </div>
            </section>

            <section className={'sectionContainer newsSectionContainer'}>
                <div className="contentWrapper">
                    <List
                        pagination={{
                            current: filters.page,
                            pageSize: 12,
                            total: news.total,
                            align: 'center',
                            onChange: (pageNumber) =>
                                setFilters((prevState) => ({ ...prevState, page: pageNumber })),
                            showSizeChanger: false,
                            hideOnSinglePage: true,
                        }}
                        grid={{
                            gutter: [20, 4],
                            xs: 1,
                            sm: 2,
                            md: 2,
                            lg: 4,
                            xl: 4,
                            xxl: 4,
                        }}
                        loading={isFetching}
                        dataSource={news.items}
                        locale={{ emptyText: 'Không có dữ liệu' }}
                        className={'templateListContainer'}
                        renderItem={(item) => {
                            return (
                                <List.Item className={'jobItemWrapper jobItemHorizontal'}>
                                    <NewsItem data={item} />
                                </List.Item>
                            );
                        }}
                    />
                </div>
            </section>
        </RootLayout>
    );
}

export default NewsListScreen;
