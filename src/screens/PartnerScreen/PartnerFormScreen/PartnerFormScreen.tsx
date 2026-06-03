import React from 'react';
import Head from 'next/head';
import { Breadcrumb, Button, Row, Image, Spin, Space, Typography } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';

import RootLayout from '@/src/layouts/RootLayout';
import { PartnerRouteUtils } from '@/src/data/partner/utils/PartnerRouteUtils';
import { useAccountContext } from '@/src/contexts/AccountContext';
import { useFetchPartnerDetails } from '@/src/screens/PartnerScreen/hooks/useFetchPartnerDetails';
import Constants from '@/src/constants/Constants';
import { IconSvgLocal } from '@/src/components/icon-svg-local';
import { PartnerProfileForm } from '../components/PartnerProfileForm';

function PartnerFormScreen() {
  const router = useRouter();

  const { auth: userInfo } = useAccountContext();

  const { data: partnerDetails, isFetching } = useFetchPartnerDetails(
    userInfo?.partner?.id || 0
  );

  return (
    <RootLayout>
      <Head>
        <title>Thông tin của tôi</title>
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
              { title: <Link href={PartnerRouteUtils.toPartnersSearchScreen()}>Đối tác</Link> },
              { title: 'Thông tin của tôi' },
            ]}
          />
        </div>
      </section>

      <section className={'sectionContainer'} style={{ paddingBottom: '80px' }}>
        <div className={'contentWrapper'}>
          {userInfo &&
            (userInfo.partner && userInfo.partner.status !== Constants.PARTNER.TU_CHOI ? (
              isFetching ? (
                <Row align={'middle'} justify={'center'} style={{ marginTop: 64 }}>
                  <Spin size={'large'} />
                </Row>
              ) : (
                partnerDetails && (
                  <PartnerProfileForm
                    partnerDetails={partnerDetails}
                  />
                )
              )
            ) : (
              <Space size={40} direction={'vertical'} className={'bgPartnerRegister d-flex'} align={'center'}>
                <Image
                  preview={false}
                  src={'/assets/img/about-us/ic_handshake.svg'}
                  alt={'iAgree'}
                  width={100}
                  height={100}
                />
                <div>
                  <Typography.Title className={'notRegisteredTitle text-center'} level={3}>
                    Bạn chưa đăng ký trở thành đối tác của iAgree
                  </Typography.Title>
                  <Typography.Paragraph className={'notRegisteredSubtitle text-center'}>
                    Đăng ký trở thành đối tác của iAgree để hồ sơ của bạn toả sáng và không bỏ lỡ cơ hội công việc phù hợp nhất
                  </Typography.Paragraph>
                </div>
                <Button
                  type="primary"
                  size="large"
                  onClick={() => router.push(PartnerRouteUtils.toPartnerRegisterGetStart())}
                  className="btnPartnerRegister"
                >
                  Trở thành đối tác của iAgree
                </Button>
              </Space>
            ))}
        </div>
      </section>
    </RootLayout>
  );
}

export default PartnerFormScreen;
