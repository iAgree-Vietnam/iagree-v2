import React from 'react';
import RootLayout from '../../layouts/RootLayout';
import Head from 'next/head';
import { Breadcrumb, Col, Row } from 'antd';
import { IconSvgLocal } from '@/src/components/icon-svg-local';

function TermOfUseScreen(props: any) {
  return (
    <RootLayout>
      <Head>
        <title>Điều khoản dịch vụ</title>
      </Head>

      <section className={'pageHeaderWrapper'}>
        <div className="contentWrapper">
          <div className={'pageHeaderContainer serviceHeaderContainer'}>
            <h1 className={'pageHeaderTitle nm-typo'}>Điều khoản dịch vụ</h1>
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
              { title: 'Điều khoản dịch vụ' },
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
                dangerouslySetInnerHTML={{ __html: props?.data?.description }}
              />
            </Col>
          </Row>
        </div>
      </section>
    </RootLayout>
  );
}

export default TermOfUseScreen;
