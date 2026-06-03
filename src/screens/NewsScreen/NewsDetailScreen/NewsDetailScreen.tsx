import React, { useMemo } from 'react';
import Head from 'next/head';
import { Breadcrumb, Col, Image, List, Row, Typography } from 'antd';
import Link from 'next/link';

import NewsSidebarItem, { NewsSidebarItemResource } from '@/src/components/news/NewsSidebarItem';
import RootLayout from '@/src/layouts/RootLayout';
import { PostDetailsResource } from '@/src/data/post/models/post.types';
import datetimeUtils from '@/src/utils/DatetimeUtils';
import PostRouteUtils from '@/src/data/post/utils/PostRouteUtils';
import { IconSvgLocal } from '@/src/components/icon-svg-local';
import Images from '@/src/constants/Images';
import BackButton from '@/src/components/BackButton';

function NewsDetailScreen(props: any) {

    const { post, top }: PostDetailsResource = props.data;

    const newsSidebarItems: NewsSidebarItemResource[] = useMemo(() => {
        return top.slice(1).map((item) => ({
            imageUrl: item?.photo,
            title: item?.title,
            publishDate: datetimeUtils.getMoment(item?.createdDate, datetimeUtils.LOCAL_DATE_TIME)?.format(datetimeUtils.LOCAL_DATE_WITH_DAY_NAME),
            postResource: item,
        }))
    }, [top])

    return (
        <RootLayout>
            <Head>
                <title>Chi tiết tin tức</title>
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
                            { title: (<Link href={PostRouteUtils.toScreen()}>Tin tức</Link>) },
                            { title: post.title },
                        ]}
                    />
                </div>
            </section>

            <section className={'sectionContainer newsDetailContainer'}>
                <div className="contentWrapper">
                    <BackButton />
                    <Row gutter={[56, 24]}>
                        <Col xs={24} sm={24} md={24}>
                            <div className={'jobFormSectionContainer hasBack'}>
                                <div className={'newsContentContainer'}>
                                    <Typography.Paragraph className={'newsDateText'}>
                                        {datetimeUtils.getMoment(post.createdDate, datetimeUtils.LOCAL_DATE_TIME)?.format(datetimeUtils.LOCAL_DATE)}
                                    </Typography.Paragraph>

                                    <Typography.Title level={1} className={'newsTitle'}>
                                        {post.title}
                                    </Typography.Title>

                                    <div className={'socialContainer'}>
                                        <Image
                                            preview={false}
                                            src={post.photo}
                                            fallback={Images.NEWS_DEFAULT}
                                            alt={post.title}
                                            className={'newsImg'}
                                            width={'100%'}
                                        />
                                    </div>

                                    <article className={'newsArticleContainer'}>
                                        <div dangerouslySetInnerHTML={{ __html: post.description }} />
                                    </article>

                                </div>
                            </div>
                        </Col>

                        {/* <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
                            <Typography.Paragraph className={'newsSidebarTitle'}>Mới cập nhật</Typography.Paragraph>

                            <Link href={PostRouteUtils.toDetailUrl(top?.[0])} className={'specialNewsSidebarItem'}>
                                <div className={'imageContainer'}>
                                    <Image
                                        preview={false}
                                        src={top?.[0]?.photo}
                                        width={'100%'}
                                        alt={top?.[0]?.title}
                                    />
                                </div>

                                <div className={'descContainer'}>
                                    <Typography.Title level={3} ellipsis={{ rows: 3 }}>
                                        <div className={'newsTitle'} dangerouslySetInnerHTML={{ __html: top?.[0]?.title }} />
                                    </Typography.Title>
                                    <Typography.Paragraph type={'secondary'} className={'newsDateTextSidebar'}>
                                        {datetimeUtils.getMoment(top?.[0]?.createdDate, datetimeUtils.LOCAL_DATE_TIME)?.format(datetimeUtils.LOCAL_DATE_WITH_DAY_NAME)}
                                    </Typography.Paragraph>
                                </div>
                            </Link>

                            <List
                                dataSource={newsSidebarItems}
                                locale={{ emptyText: 'Không có dữ liệu' }}
                                renderItem={(item) => {
                                    return (
                                        <List.Item className={'newsSidebarItemWrapper'}>
                                            <NewsSidebarItem data={item} />
                                        </List.Item>
                                    );
                                }}
                            />
                        </Col> */}
                    </Row>
                </div>
            </section>
        </RootLayout>
    );

}

export default NewsDetailScreen;
