import React, { useMemo } from 'react';
import Head from 'next/head';
import { Breadcrumb, Space, Col, Row, Typography, Spin, Rate } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';

import RootLayout from '@/src/layouts/RootLayout';
import { PartnerRouteUtils } from '@/src/data/partner/utils/PartnerRouteUtils';
import { PartnerSideMenu } from '@/src/screens/PartnerScreen/components/PartnerSideMenu';
import { useAccountContext } from '@/src/contexts/AccountContext';
import { useFetchPartnerDetails } from '@/src/screens/PartnerScreen/hooks/useFetchPartnerDetails';
import { PartnerReviews } from '@/src/screens/PartnerScreen/components/PartnerReviews';
import Constants from '@/src/constants/Constants';
import { IconSvgLocal } from '@/src/components/icon-svg-local';
import { size } from 'lodash';

function PartnerProfileReviewsScreen() {
  const router = useRouter();

  const { auth: userInfo } = useAccountContext();

  const { data: partnerDetails, isFetching } = useFetchPartnerDetails(
    userInfo?.partner?.id || 0
  );

  const isPartner = useMemo(() => {
    return userInfo?.partner?.status === Constants.PARTNER.DA_DUYET;
  }, [userInfo]);

  if (!isPartner && userInfo) {
    if (router.isReady) router.replace(PartnerRouteUtils.toProfileUrl());
    return;
  }

  return (
    <RootLayout>
      <Head>
        <title>Đánh giá của tôi</title>
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
              { title: <Link href={'/'}>Đối tác</Link> },
              { title: 'Đánh giá của tôi' },
            ]}
          />
        </div>
      </section>

      <section className={'sectionContainer'} style={{ paddingTop: 16 }}>
        <div className={'contentWrapper'}>
          <Row gutter={[40, 24]}>
            <Col xs={24} sm={24} md={24} lg={6} xl={6} xxl={6}>
              <div className={'desktopFilterContainer'}>
                {userInfo && <PartnerSideMenu />}
              </div>
            </Col>

            <Col xs={24} sm={24} md={24} lg={18} xl={18} xxl={18}>
              {isPartner && isFetching ? (
                <Row
                  align={'middle'}
                  justify={'center'}
                  style={{ marginTop: 64 }}
                >
                  <Spin size={'large'} />
                </Row>
              ) : (
                <div className={'partnerDetailContentContainer'}>
                  <div className={'partnerDetailHeaderContainer'}>
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                        <Row gutter={[12, 12]}>
                          <Col flex={1}>
                            <Typography.Title
                              className={'partnerFullName nm-typo'}
                            >
                              Đánh giá của bạn
                            </Typography.Title>
                            <Space direction={'vertical'}>
                              <Space size={'middle'} align={'end'}>
                                <Space size={'small'}>
                                  <Typography.Text className={'nm-typo'}>
                                    Đánh giá:{' '}
                                  </Typography.Text>
                                  <Typography.Text className={'nm-typo'}>
                                    {userInfo?.partner?.rate}/5
                                  </Typography.Text>
                                </Space>

                                <Rate
                                  disabled={true}
                                  value={userInfo?.partner?.rate}
                                />
                              </Space>

                              <Space size={'small'}>
                                <Typography.Text className={'nm-typo'}>
                                  Tổng số:{' '}
                                </Typography.Text>
                                <Typography.Text className={'nm-typo'}>
                                  {size(partnerDetails?.reviews)}
                                </Typography.Text>
                              </Space>
                            </Space>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </div>
                  {userInfo && partnerDetails && (
                    <PartnerReviews
                      partnerId={userInfo.partner?.id || 0}
                      // initData={partnerDetails.reviews}
                      isProfileDetails
                    />
                  )}
                </div>
              )}
            </Col>
          </Row>
        </div>
      </section>
    </RootLayout>
  );
}

export default PartnerProfileReviewsScreen;
