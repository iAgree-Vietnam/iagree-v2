import React, { useCallback, useState } from 'react';
import { Button, Col, Input, Row, Space, Image } from 'antd';

import Images from '@/src/constants/Images';
import { useAccountContext } from '@/src/contexts/AccountContext';
import useCreateComment from '@/src/screens/DocumentScreen/DocumentSharedDetailsScreen/hooks/useCreateComment';

interface CommentInputProps {
    documentId: number;
}

export default function CommentInput({ documentId }: CommentInputProps) {
    const [comment, setComment] = useState<string>('');

    const accountContext = useAccountContext();
    const fullProfileResource = accountContext.auth;

    const createCommentMutation = useCreateComment({
        onSuccess: () => setComment(''),
    });

    const handleSubmitComment = useCallback(() => {
        if (comment.trim()) {
            createCommentMutation.mutate({
                documentId: documentId,
                comment,
            });
        }
    }, [comment, createCommentMutation, documentId]);

    return (
        <Space direction={'vertical'} size={20} className={'d-flex'}>
            <Row gutter={12}>
                {/* <Col>
                    <Image
                        preview={false}
                        src={fullProfileResource?.avatarUrl}
                        fallback={Images.ACCOUNT_DEFAULT}
                        alt={'avatar'}
                        width={48}
                        height={48}
                        style={{ borderRadius: '50%' }}
                    />
                </Col> */}
                <Col flex={1}>
                    <Input.TextArea
                        size={'large'}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder={'Viết bình luận ...'}
                        rows={5}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.keyCode === 13) {
                                e.preventDefault();
                                handleSubmitComment();
                            }
                        }}
                    />
                </Col>
            </Row>
            <Button
                type={'primary'}
                onClick={handleSubmitComment}
                loading={createCommentMutation.isLoading}
                disabled={!comment.trim() || createCommentMutation.isLoading}
                block
            >
                Gửi
            </Button>
        </Space>
    );
}
