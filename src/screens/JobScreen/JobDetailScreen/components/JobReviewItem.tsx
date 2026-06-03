import React from 'react';
import { Space, Typography, Rate, Image, Row, Col, Divider } from 'antd';

import datetimeUtils from '@/src/utils/DatetimeUtils';
import { ReviewResource } from '@/src/data/partner/models/partner.types';
import Images from '@/src/constants/Images';
import NumberUtils from '@/src/utils/NumberUtils';
import { JobReviews } from '@/src/data/job/models/job.types';
import Constants from '@/src/constants/Constants';

export interface ReviewItemProps {
  reviewData: JobReviews | undefined;
}

export function JobReviewItem({ reviewData }: ReviewItemProps) {
  const displayName =
    reviewData?.type === Constants.JOB.REVIEW.TYPE.PARTNER
      ? reviewData?.partnerUser?.name
      : reviewData?.user?.name;

  const displayAvatar =
    reviewData?.type === Constants.JOB.REVIEW.TYPE.PARTNER
      ? reviewData?.partnerUser?.avatarUrl
      : reviewData?.user?.avatarUrl;
      
  return (
    <Row gutter={30} align={'top'}>
      <Col>
        <Image
          preview={false}
          width={64}
          height={64}
          src={displayAvatar?.toString()}
          fallback={Images.ACCOUNT_DEFAULT}
          alt="User review avatar"
          className="partnerAvatar"
        />
      </Col>
      <Col flex="auto">
        <Space direction="vertical" size={12} className="full-width">
          <Space direction='vertical' size={6} className='full-width'>
            <Typography.Title level={5} className={'fullName nm-typo'}>
              {displayName}
            </Typography.Title>
            <Space size={0}>
              <Rate style={{ fontSize: '16px',marginRight:0 }} disabled={true} value={reviewData?.rate} />
              <Typography.Paragraph style={{
                marginLeft: 4
              }} className={'rateNumber nm-typo'}>
                {NumberUtils.display(reviewData?.rate)}
              </Typography.Paragraph>
              <Divider type={'vertical'} style={{ borderColor: '#D4D4D4' }} />
              <Typography.Paragraph className={'time nm-typo'}>
                {
                  reviewData?.createdAt 
                  ? datetimeUtils
                    .getMoment(reviewData.createdAt)
                    ?.format(datetimeUtils.LOCAL_DATE)
                  : null
                }
              </Typography.Paragraph>
            </Space>
          </Space>
          <Typography.Paragraph className={'description nm-typo'}>{reviewData?.decscription}</Typography.Paragraph>
        </Space>
      </Col>
    </Row>
  );
}
