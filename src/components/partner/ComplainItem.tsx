import React from 'react';
import { Space, Typography, Rate, Row, Col, Divider } from 'antd';

import datetimeUtils from '@/src/utils/DatetimeUtils';
import { ComplainResource } from '@/src/data/partner/models/partner.types';
import NumberUtils from '@/src/utils/NumberUtils';

export interface ComplainItemProps {
  complainData: ComplainResource;
}

export function ComplainItem({ complainData }: ComplainItemProps) {
  return (
    <Row gutter={30} align={'top'}>
      <Col flex="auto">
        <Space direction="vertical" size={12} className="full-width">
          <Space direction="vertical" size={6} className="full-width">
            <Space size={0}>
              <Typography.Title level={5} className={'fullName nm-typo'}>
                {complainData.name}
              </Typography.Title>
              <Divider type={'vertical'} style={{ borderColor: '#D4D4D4' }} />
              <Typography.Paragraph className={'time nm-typo'}>
                {datetimeUtils
                  .getMoment(complainData.createdAt)
                  ?.format(datetimeUtils.LOCAL_DATE)}
              </Typography.Paragraph>
            </Space>
          </Space>
          <Typography.Paragraph className={'description nm-typo'}>
            {complainData.subject}
          </Typography.Paragraph>
          <Typography.Paragraph className={'complainBody nm-typo'}>
            {complainData.body}
          </Typography.Paragraph>
        </Space>
      </Col>
    </Row>
  );
}
