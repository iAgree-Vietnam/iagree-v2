import React, { useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Breadcrumb, Col, Row, Typography, Button } from 'antd';

import RootLayout from '@/src/layouts/RootLayout';
import { ProfileContainer } from '@/src/components/ProfileContainer';
import { useAccountContext } from '@/src/contexts/AccountContext';
import PricingRouteUtils from '@/src/data/pricing/utils/PricingRouteUtils';
import {
  PackageItem,
  // PricingItem,
} from '@/src/data/pricing/models/pricing.types';
import Constants from '@/src/constants/Constants';
// import { PricingParseUtils } from '@/src/data/pricing/utils/PricingParseUtil';
// import AllUserSuspendModal from './modals/AllUserSuspendModal';
// import { ModalizeHelperVisible } from '@/src/data/base/models/base.types';
// import moment from 'moment';
// import datetimeUtils from '@/src/utils/DatetimeUtils';
import { IconSvgLocal } from '@/src/components/icon-svg-local';
import { withThemeRevert } from '@/theme';
import { useBreakpoint } from '@/src/hooks/useBreakpoint';

export function SubscriptionScreen(props: any) {
  const router = useRouter();
  const { isDesktop } = useBreakpoint();
  const { auth: userInfo } = useAccountContext();

  // const allUserSuspendModalRef = useRef<ModalizeHelperVisible>(null);

  // const userServicesResource: PricingItem = props.userServices;
  const eSignPackageData: PackageItem[] = props.eSignPackageData;

  // const currentUserServiceIndex = userServicesResource.allPackages.findIndex(
  //   (item) => item.name === userInfo?.levelDisplay
  // );

  // const allServicesMapped = userServicesResource.services.map((item) => ({
  //   name: item.name,
  //   serviceId: item.serviceId,
  //   ...item?.packages?.reduce(
  //     (prev, current) => ({ ...prev, [current?.pivot?.packageId]: true }),
  //     {}
  //   ),
  // }));

  // const allCurrentServices = allServicesMapped.filter(
  //   (item) =>
  //     //@ts-ignore
  //     item[userServicesResource.allPackages[currentUserServiceIndex].packageId]
  // );

  // const allUserPackage = userInfo?.userPackages?.find(
  //   (item) => item.type === Constants.PAYMENT.TYPE_TEXT.ACCOUNT_SERVICE
  // );
  //@ts-ignore
  const eSignPackage =
    userInfo?.userPackages?.filter(
      (item) =>
        item.type === Constants.PAYMENT.TYPE_TEXT.E_SIGNATURE &&
        item.keyName !== Constants.E_SIGNATURE_PACKAGE.E_SIGNATURE_BY_ONCE
    ) || [];

  // const showDateRange = useCallback((start: string, end: string) => {
  //   if (end) return `${start} - ${end}`;
  //   else return start;
  // }, []);

  // const calcRemainingDate = useCallback((end: string) => {
  //   const endDate = moment(end, datetimeUtils.LOCAL_DATE);
  //   const toDay = moment();
  //   return endDate.diff(toDay, 'days');
  // }, []);

  // const oldShowSignNum = useCallback(()=>{
  //   //@ts-ignore
  //   const eSignByOnce = userInfo?.userServices?.findLast(item => item.serviceKey === Constants.E_SIGNATURE_PACKAGE.E_SIGNATURE_BY_ALL_USER);
  //   return Number.isInteger(Number(eSignByOnce?.serviceValue)) ? `(${eSignByOnce?.serviceValue} lượt)` : eSignPackage?.beginDate;
  // },[userInfo, eSignPackage]);

  const showSignNum = useCallback(() => {
    //@ts-ignore
    let eSignByOnce = userInfo?.userServices?.reduce((result: number, item) => {
      if (
        item.serviceKey === Constants.E_SIGNATURE_PACKAGE.E_SIGNATURE_BY_ONCE &&
        Number.isInteger(Number(item?.serviceValue))
      )
        return result + Number(item?.serviceValue);
      return result;
    }, 0);
    if (!eSignByOnce) eSignByOnce = 0;
    return `${eSignByOnce} lượt`;
  }, [userInfo]);

  const isRegisterCombo = eSignPackage.length > 0;

  return (
    <RootLayout>
      <Head>
        <title>Gói dịch vụ của tôi</title>
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
              { title: 'Gói dịch vụ của tôi' },
            ]}
          />
        </div>
      </section>
      <ProfileContainer>
        <h1 className={'pageHeaderTitle'}>Gói dịch vụ của tôi</h1>
        <div className={'contentWrapper subscriptionContainer'}>
          <Row gutter={[32, 20]}>
            <Col xs={24}>
              <Row className={'eSignature'} align={'middle'}>
                <Col {...(!isDesktop ? { span: 24 } : { flex: '200px' })}>
                  <Row justify={'space-between'}>
                    <Typography.Title
                      level={5}
                      className={'paymentSectionTitle nm-typo'}
                    >
                      Lượt ký lẻ
                    </Typography.Title>
                    <Typography.Title
                      level={5}
                      className={'paymentSectionTitle show-mb-flex'}
                      style={{
                        display: 'none',
                        marginTop: 0,
                        marginBottom: '20px',
                      }}
                    >
                      {showSignNum()}
                    </Typography.Title>
                  </Row>
                </Col>
                <Col flex={'auto'}>
                  <Row justify={'space-between'} align={'middle'}>
                    <Typography.Title
                      level={5}
                      className={'paymentSectionTitle nm-typo hidden-mb'}
                    >
                      {showSignNum()}
                    </Typography.Title>

                    {withThemeRevert(
                      <Button
                        type={'primary'}
                        size={'middle'}
                        onClick={() => {
                          const oncePackage = eSignPackageData.find(
                            (item) =>
                              item.packageKeyName ===
                              Constants.E_SIGNATURE_PACKAGE.E_SIGNATURE_BY_ONCE
                          );
                          if (oncePackage) {
                            router.push(
                              PricingRouteUtils.toPaymentESignatureUrl(
                                oncePackage
                              )
                            );
                          } else {
                            router.push(PricingRouteUtils.toScreen());
                          }
                        }}
                        style={{ width: !isDesktop ? '100%' : '160px' }}
                      >
                        Đăng ký thêm
                      </Button>
                    )}
                  </Row>
                </Col>
              </Row>
            </Col>

            {eSignPackage.map((eSignItem) => (
              <Col xs={24} key={eSignItem.keyName}>
                <Row
                  className={'eSignature'}
                  align={isRegisterCombo ? 'top' : 'middle'}
                >
                  <Col {...(!isDesktop ? { span: 24 } : { flex: '200px' })}>
                    <Row justify={'space-between'}>
                      <Typography.Title
                        level={5}
                        className={'paymentSectionTitle nm-typo'}
                      >
                        Ký theo gói
                      </Typography.Title>
                      <div
                        style={{ display: 'none', marginBottom: '20px' }}
                        className={'show-mb-block'}
                      >
                        {isRegisterCombo ? (
                          <div>
                            <Typography.Title
                              level={5}
                              className={'paymentSectionTitle nm-typo'}
                            >
                              {eSignItem?.name}
                            </Typography.Title>
                            <Typography.Title
                              level={5}
                              className={'paymentSectionTitle nm-typo'}
                              style={{ fontWeight: 400, marginTop: '8px' }}
                            >
                              Còn lại{' '}
                              <span>
                                {
                                  userInfo?.userServices?.find(
                                    (item) =>
                                      item.serviceKey === eSignItem.keyName
                                  )?.serviceValue
                                }
                                {' lượt'}
                              </span>
                            </Typography.Title>
                          </div>
                        ) : (
                          <Typography.Title
                            level={5}
                            className={'paymentSectionTitle nm-typo'}
                          >
                            Chưa đăng ký
                          </Typography.Title>
                        )}
                      </div>
                    </Row>
                  </Col>
                  <Col flex={'auto'}>
                    <Row
                      justify={'space-between'}
                      align={isRegisterCombo ? 'top' : 'middle'}
                    >
                      <div className={'hidden-mb'}>
                        {isRegisterCombo ? (
                          <div>
                            <Typography.Title
                              level={5}
                              className={'paymentSectionTitle nm-typo'}
                            >
                              {eSignItem?.name}
                            </Typography.Title>
                            <Typography.Title
                              level={5}
                              className={'paymentSectionTitle nm-typo'}
                              style={{ fontWeight: 400, marginTop: '8px' }}
                            >
                              Còn lại{' '}
                              <span>
                                {
                                  userInfo?.userServices?.find(
                                    (item) =>
                                      item.serviceKey === eSignItem.keyName
                                  )?.serviceValue
                                }
                                {' lượt'}
                              </span>
                            </Typography.Title>
                          </div>
                        ) : (
                          <Typography.Title
                            level={5}
                            className={'paymentSectionTitle nm-typo'}
                          >
                            Chưa đăng ký
                          </Typography.Title>
                        )}
                      </div>

                      {withThemeRevert(
                        <Button
                          type={'primary'}
                          size={'middle'}
                          onClick={() => {
                            const item = eSignPackageData.find(
                              (item) =>
                                item.packageKeyName === eSignItem.keyName
                            );
                            if (item) {
                              router.push(
                                PricingRouteUtils.toPaymentESignatureUrl(item)
                              );
                            } else {
                              router.push(PricingRouteUtils.toScreen());
                            }
                          }}
                          style={{ width: !isDesktop ? '100%' : '160px' }}
                        >
                          Đăng ký thêm
                        </Button>
                      )}
                    </Row>
                  </Col>
                </Row>
              </Col>
            ))}
          </Row>
        </div>
      </ProfileContainer>
    </RootLayout>
  );
}
