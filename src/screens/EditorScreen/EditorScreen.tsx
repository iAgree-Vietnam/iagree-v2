import React from 'react';
import RootLayout from '@/src/layouts/RootLayout';
import Head from 'next/head';
import { Breadcrumb, Button, Col, Dropdown, Row, Space, Typography } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import dynamic from 'next/dynamic';
import { IconSvgLocal } from '@/src/components/icon-svg-local';

const TextEditor = dynamic(() => import('@/src/screens/EditorScreen/TextEditor'), { ssr: false });

function EditorScreen() {

    return (
        <RootLayout>
            <Head>
                <title>Chỉnh sửa văn bản</title>
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
                            { title: 'Template & Văn bản' },
                        ] as any}
                    />
                </div>
            </section>

            <section className={'sectionContainer editorTitleWrapper'}>
                <div className="">
                    <div className="contentWrapper">
                        <Row gutter={[10, 0]}>
                            <Col xs={24} sm={24} md={24} lg={14} xl={14} xxl={14}>
                                <Typography.Title className={'title'} level={1}>
                                    Hello World lần thứ 101/29
                                </Typography.Title>
                            </Col>

                            <Col xs={24} sm={24} md={24} lg={10} xl={10} xxl={10}>
                                <div className={'editorTitleExtraContainer gridColToEnd'}>
                                    <Space size={'middle'}>
                                        <Button size={'large'} type={'default'}>Xem trước</Button>
                                        <Button size={'large'} type={'primary'}>Lưu thành văn bản</Button>

                                        <Dropdown
                                            trigger={['click']}
                                            menu={{
                                                items: [
                                                    {
                                                        label: 'Tải xuống',
                                                        key: 'download',
                                                        icon: (<UserOutlined />),
                                                    },
                                                    {
                                                        label: 'Lưu thành Template',
                                                        key: 'saveAsTemplate',
                                                        icon: (<UserOutlined />),
                                                    },
                                                ],
                                            }}
                                        >
                                            <Button
                                                size={'large'}
                                                icon={(<DownOutlined />)}
                                            />
                                        </Dropdown>
                                    </Space>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </section>

            <section className={'sectionContainer editorWrapper'}>
                <div className={'contentWrapper'}>
                    <TextEditor />
                </div>
            </section>
        </RootLayout>
    );
}

export default EditorScreen;
