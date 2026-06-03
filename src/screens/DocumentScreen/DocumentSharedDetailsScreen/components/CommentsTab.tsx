import React, { RefObject } from 'react';
import { Space, Divider, Typography, List } from 'antd';
import useComments from '@/src/screens/DocumentScreen/DocumentSharedDetailsScreen/hooks/useComments';

import CommentInput from './CommentInput';
import CommentGroup from './CommentGroup';
import { CommentReplyInputHelperVisible } from './CommentReplyInput';

interface CommentsTabProps {
    documentId: number;
    commentReplyInputRef?: RefObject<CommentReplyInputHelperVisible>;
    replyingId: number | null;
}

export default function CommentsTab({
    documentId,
    commentReplyInputRef,
    replyingId,
}: CommentsTabProps) {
    const commentsQuery = useComments(documentId);

    return (
        <>
            <CommentInput documentId={documentId} />
            <Divider />

            <Space direction={'vertical'} className={'d-flex'} size={'middle'}>
                {commentsQuery.data.length > 0 && (
                    <Typography.Title level={5}>Tất cả bình luận</Typography.Title>
                )}

                <List
                    grid={{ column: 1 }}
                    loading={commentsQuery.isFetching}
                    dataSource={commentsQuery.data}
                    locale={{ emptyText: 'Không có dữ liệu' }}
                    renderItem={(comment) => {
                        return (
                            <List.Item>
                                <CommentGroup
                                    comment={comment}
                                    commentReplyInputRef={commentReplyInputRef}
                                    replyingId={replyingId}
                                />
                            </List.Item>
                        );
                    }}
                />
            </Space>
            <div style={{ display: replyingId ? 'block' : 'none', height: '88px' }} />
        </>
    );
}
