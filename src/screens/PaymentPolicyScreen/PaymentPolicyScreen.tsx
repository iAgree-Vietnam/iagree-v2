import React from 'react';
import RootLayout from '../../layouts/RootLayout';
import Head from 'next/head';
import { Breadcrumb, Col, Row } from 'antd';
import { useAccountContext } from '@/src/contexts/AccountContext';
import { IconSvgLocal } from '@/src/components/icon-svg-local';
import { PolicyService } from '../HomeScreen/hooks/useGetDataHome';
import Constants from '@/src/constants/Constants';
import useSWR from 'swr';
import { SettingParserUtils } from '@/src/data/setting/utils/SettingParserUtils';

function PaymentPolicyScreen(props: any) {
  const { data } = useSWR(["query"], () =>
    new PolicyService().getSettingsPage(
      Constants.SETTING.PAYMENT_POLICY
    )
  );

  return (
    <RootLayout>
      <Head>
        <title>Thanh toán, hoàn tiền và phí nền tảng</title>
      </Head>

      <section className={'pageHeaderWrapper'}>
        <div className="contentWrapper">
          <div className={'pageHeaderContainer serviceHeaderContainer'}>
            <h1 className={'pageHeaderTitle nm-typo'}>Thanh toán, hoàn tiền và phí nền tảng</h1>
          </div>
        </div>
      </section>

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
              { title: 'Thanh toán, hoàn tiền và phí nền tảng' },
            ]}
          />
        </div>
      </section>

      <section className={'sectionContainer'}>
        <div className={'contentWrapper'}>
          <Row gutter={[24, 80]}>
            <Col xs={24}>
              <div
                className={'policyInfo'}
                dangerouslySetInnerHTML={{ __html: SettingParserUtils.htmlBeautify(data?.[0]?.value)|| ''}}
              />
            </Col>
          </Row>
        </div>
      </section>
    </RootLayout>
  );
}

export default PaymentPolicyScreen;
