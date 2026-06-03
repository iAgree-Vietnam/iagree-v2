import React from 'react';
import Head from 'next/head';
import { Breadcrumb,  } from 'antd';
import Link from 'next/link';

import RootLayout from '@/src/layouts/RootLayout';
import { useAccountContext } from "@/src/contexts/AccountContext";
import { PartnerDetailResource } from '@/src/data/partner/models/partner.types';
import { PartnerDetailsContent } from '@/src/screens/PartnerScreen/components/PartnerDetailsContent';
import { PartnerRouteUtils } from '@/src/data/partner/utils/PartnerRouteUtils';
import { IconSvgLocal } from '@/src/components/icon-svg-local';

function PartnerDetailScreen(props: any) {

    // const { auth: userInfo } = useAccountContext();

    const partnerDetailInitResource: PartnerDetailResource = props.data;

    return (
        <RootLayout>
            {/* <Head>
                <title>Chi tiết Đối tác</title>
                <link rel={'stylesheet'} type={'text/css'} charSet={'UTF-8'} href={'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css'} />
                <link rel={'stylesheet'} type={'text/css'} href={'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css'} />
            </Head> */}

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
                            { title: (<Link href={PartnerRouteUtils.toPartnersSearchScreen()}>Đối tác</Link>) },
                            { title: partnerDetailInitResource?.partner?.user?.fullName },
                        ]}
                    />
                </div>
            </section>

            <section className={'sectionContainer'} style={{ paddingBottom: '80px' }}>
                <div className={'contentWrapper'}>
                    <PartnerDetailsContent partnerDetails={partnerDetailInitResource} />
                </div>
            </section>

        </RootLayout>
    );
}

export default PartnerDetailScreen;
