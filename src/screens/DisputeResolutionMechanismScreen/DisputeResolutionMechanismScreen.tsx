import React from 'react';
import RootLayout from '../../layouts/RootLayout';
import Head from 'next/head';
import { Breadcrumb, Col, Row, Typography } from 'antd';
import { useAccountContext } from '@/src/contexts/AccountContext';
import { IconSvgLocal } from '@/src/components/icon-svg-local';

function DisputeResolutionMechanismScreen(props: any) {
  const accountContext = useAccountContext();
  const { setting } = accountContext;

  return (
    <RootLayout>
      {/* <Head>
        <title>Cơ chế giải quyết tranh chấp</title>
      </Head> */}

      <section className={'pageHeaderWrapper'}>
        <div className="contentWrapper">
          <div className={'pageHeaderContainer serviceHeaderContainer'}>
            <h1 className={'pageHeaderTitle nm-typo'}>Cơ chế giải quyết tranh chấp</h1>
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
              { title: 'Cơ chế giải quyết tranh chấp' },
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
                dangerouslySetInnerHTML={{ __html: setting?.disputeResolutionMechanism || ''}}
              />
            </Col>
          </Row>
        </div>
      </section>
    </RootLayout>
  );
}

export default DisputeResolutionMechanismScreen;
