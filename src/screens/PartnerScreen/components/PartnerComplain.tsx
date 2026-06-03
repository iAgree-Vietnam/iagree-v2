/* eslint-disable import/no-unused-modules */
import React from 'react';
import { Typography, List } from 'antd';
import { ComplainResource } from '@/src/data/partner/models/partner.types';
import { ComplainItem } from '@/src/components/partner/ComplainItem';
import { size } from 'lodash';

export interface PartnerRatingProps {
  initData: ComplainResource[];
}

export function PartnerComplain({ initData }: PartnerRatingProps) {
  return (
    <div className={'partnerDetailPartContainer'}>
      <div className="partnerDetailPartTitleContainer">
        <Typography.Title
          className={'partnerDetailPartTitle nm-typo'}
          level={3}
        >
          {'Phản ánh từ Tổ chức xã hội'} ({size(initData)})
        </Typography.Title>
      </div>

      <div className={'partnerDetailPartContentContainer'}>
        <List
          pagination={{
            pageSize: 3,
            align: 'center',
            hideOnSinglePage: true,
            showSizeChanger: false,
          }}
          dataSource={initData || []}
          locale={{ emptyText: 'Không có phản ánh nào' }}
          grid={{
            gutter: 16,
            xs: 1,
            sm: 1,
            md: 1,
            lg: 1,
            xl: 1,
            xxl: 1,
          }}
          className={'reviewsListContainer'}
          renderItem={(item) => {
            return (
              <List.Item className={'reviewsItemWrapper'}>
                <ComplainItem complainData={item} />
              </List.Item>
            );
          }}
        />
      </div>
    </div>
  );
}
