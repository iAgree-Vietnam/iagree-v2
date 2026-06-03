import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Collapse, Menu } from 'antd';

import { PartnerRouteUtils } from '@/src/data/partner/utils/PartnerRouteUtils';

export function PartnerSideMenu() {
  const router = useRouter();

  return (
    <Collapse
      className={'filterCollapseContainer'}
      ghost={true}
      defaultActiveKey={['1']}
      expandIconPosition={'end'}
      items={[
        {
          key: '1',
          label: 'Quản lý Đối tác',
          children: (
            <div>
              <Menu
                selectedKeys={[router.pathname]}
                className={'filterMenuContainer'}
                items={[
                  {
                    key: PartnerRouteUtils.toPartnersSearchScreen().replace('?', ''),
                    label: <Link href={PartnerRouteUtils.toPartnersSearchScreen()}>Danh sách Đối tác</Link>,
                  },
                  {
                    key: PartnerRouteUtils.toProfileUrl(),
                    label: (
                      <Link href={PartnerRouteUtils.toProfileUrl()}>Thông tin của tôi</Link>
                    ),
                  },
                  {
                    key: PartnerRouteUtils.toProfileReviewsUrl(),
                    label: (
                      <Link href={PartnerRouteUtils.toProfileReviewsUrl()}>Đánh giá của tôi</Link>
                    ),
                  },
                ]}
              />
            </div>
          ),
        },
      ]}
    />
  );
}
