import React from 'react';
import { Row, Col, Image, Typography } from 'antd';

import Images from '@/src/constants/Images';
import { DocumentCommentResource } from '@/src/data/document/models/document.types';
import DatetimeUtils from '@/src/utils/DatetimeUtils';
import datetimeUtils from '@/src/utils/DatetimeUtils';
import { isMoment } from 'moment';

export interface CommentItemNewProps {
    comment: DocumentCommentResource;
}

export default function CommentItemNew({ comment }: CommentItemNewProps) {
    const createdDate = DatetimeUtils.getMoment(
        comment.createdDate,
        datetimeUtils.LOCAL_DATE_TIME
    );

    return (
        <Row gutter={30} style={{ marginTop: '16px' }}>
            <Col>
                <Image
                    preview={false}
                    src={comment.user?.avatarUrl}
                    fallback={Images.ACCOUNT_DEFAULT}
                    alt={'avatar'}
                    width={64}
                    height={64}
                    style={{ borderRadius: '50%' }}
                />
            </Col>
            <Col flex={1}>
                <Typography.Title level={4} style={{ marginBottom: '6px' }}>
                    {comment.user?.fullName}
                </Typography.Title>
                <Typography.Paragraph type={'secondary'} className={'nm-typo'}>
                    {isMoment(createdDate) ? createdDate.fromNow() : null}
                </Typography.Paragraph>
                <Typography.Title
                    level={5}
                    style={{ marginTop: '12px', fontWeight: 400 }}
                >
                    {comment.comment}
                </Typography.Title>
            </Col>
        </Row>
    );
}
