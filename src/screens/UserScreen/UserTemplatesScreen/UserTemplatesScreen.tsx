/* eslint-disable import/no-unused-modules */

import React from 'react';
import RootLayout from '@/src/layouts/RootLayout';
import Head from 'next/head';
import { Breadcrumb } from 'antd';
import Link from 'next/link';
import TemplateRouteUtils from '@/src/data/template/utils/TemplateRouteUtils';
import { IconSvgLocal } from '@/src/components/icon-svg-local';

function UserTemplatesScreen(props: any) {
    return (
        <RootLayout>
            <Head>
                <title>Template & Văn bản</title>
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
                            { title: (<Link href={TemplateRouteUtils.toScreen({})}>Template & Văn bản</Link>) },
                            { title: 'Template đã mua' },
                        ]}
                    />
                </div>
            </section>
        </RootLayout>
    );
}

export default UserTemplatesScreen;
