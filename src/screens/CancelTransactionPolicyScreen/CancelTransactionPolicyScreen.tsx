import React from 'react';
import RootLayout from '../../layouts/RootLayout';
import Head from 'next/head';
import { Breadcrumb, Col, Row, Typography } from 'antd';
import { useAccountContext } from '@/src/contexts/AccountContext';
import { IconSvgLocal } from '@/src/components/icon-svg-local';

function CancelTransactionPolicyScreen(props: any) {
  const accountContext = useAccountContext();
  const { setting } = accountContext;

  return (
    <RootLayout>
      {/* <Head>
        <title>Chính sách hủy giao dịch & hoàn tiền</title>
      </Head> */}

      <section className={'pageHeaderWrapper'}>
        <div className="contentWrapper">
          <div className={'pageHeaderContainer serviceHeaderContainer'}>
            <h1 className={'pageHeaderTitle nm-typo'}>Chính sách hủy giao dịch & hoàn tiền</h1>
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
              { title: 'Chính sách hủy giao dịch & hoàn tiền' },
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
                dangerouslySetInnerHTML={{ __html: setting?.cancelTransactionPolicy || ''}}
              />
            </Col>
          </Row>
        </div>
      </section>
    </RootLayout>
  );
}

export default CancelTransactionPolicyScreen;
