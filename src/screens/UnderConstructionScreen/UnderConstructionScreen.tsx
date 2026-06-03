
/* eslint-disable import/no-unused-modules */
import React from 'react';
import RootLayout from '@/src/layouts/RootLayout';
import Head from 'next/head';
import { Typography } from 'antd';

function UnderConstructionScreen(props: any) {
    return (
        <RootLayout>
            <Head>
                <title>Chức năng đang phát triển...</title>
            </Head>

            <section className={'sectionContainer '}>
                <div className="contentWrapper">
                    <Typography.Title className={'nm-typo'}>Chức năng đang phát triển...</Typography.Title>
                    <Typography.Paragraph type={'secondary'}>Vui lòng quay lại sau...</Typography.Paragraph>
                </div>
            </section>
        </RootLayout>
    );
}

export default UnderConstructionScreen;
