import React from 'react';
import RootLayout from '../../layouts/RootLayout';
import Head from 'next/head';
import { Breadcrumb, Col, Row } from 'antd';
import { useAccountContext } from '@/src/contexts/AccountContext';
import { IconSvgLocal } from '@/src/components/icon-svg-local';

function RefundPolicyScreen(props: any) {
  const accountContext = useAccountContext();
  const { setting } = accountContext;
 
  return (
    <RootLayout>
      <Head>
        <title>Chính sách hoàn trả</title>
      </Head>

      <section className={'pageHeaderWrapper'}>
        <div className="contentWrapper">
          <div className={'pageHeaderContainer serviceHeaderContainer'}>
            <h1 className={'pageHeaderTitle nm-typo'}>Chính sách hoàn trả</h1>
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
              { title: 'Chính sách hoàn trả' },
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
                dangerouslySetInnerHTML={{ __html: setting?.refundPolicy || ''}}
              />
            </Col>
          </Row>
        </div>
      </section>
    </RootLayout>
  );
}

export default RefundPolicyScreen;
