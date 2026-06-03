import React, {
    Dispatch,
    SetStateAction,
    forwardRef,
    useCallback,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import { Button, Col, Input, Row, Image, InputRef } from 'antd';
import { SendOutlined } from '@ant-design/icons';

import Images from '@/src/constants/Images';
import { useAccountContext } from '@/src/contexts/AccountContext';
import useCreateComment from '@/src/screens/DocumentScreen/DocumentSharedDetailsScreen/hooks/useCreateComment';
import { DocumentCommentResource } from '@/src/data/document/models/document.types';

interface ReplyState {
    post: DocumentCommentResource | null;
    show: boolean;
}
interface CommentReplyInputProps {
    setReplyingId: Dispatch<SetStateAction<number | null>>;
}

export type CommentReplyInputHelperVisible = {
    show: (post: DocumentCommentResource) => void;
    cancel: () => void;
};

const CommentReplyInput = forwardRef(
    ({ setReplyingId }: CommentReplyInputProps, ref) => {
        const [reply, setReply] = useState<ReplyState>({
            post: null,
            show: false,
        });
        const [comment, setComment] = useState<string>('');

        const inputRef = useRef<InputRef>(null);

        const accountContext = useAccountContext();
        const fullProfileResource = accountContext.auth;

        const createCommentMutation = useCreateComment({
            onSuccess: () => {
                cancel();
            },
        });

        const show = useCallback(
            (post: DocumentCommentResource) => {
                setReply({ post, show: true });
                setReplyingId(post.id);
                setTimeout(() => inputRef.current?.focus(), 0);
            },
            [setReplyingId]
        );
        const cancel = useCallback(() => {
            setReply({ post: null, show: false });
            setReplyingId(null);
            setComment('');
        }, [setReplyingId]);

        const handleSubmitReply = useCallback(() => {
            if (reply.post && comment.trim()) {
                createCommentMutation.mutate({
                    documentId: reply.post.documentId,
                    comment,
                    commentId: reply.post.parentId || reply.post.id,
                });
            }
        }, [comment, reply, createCommentMutation]);

        useImperativeHandle(
            ref,
            useCallback(() => ({ show, cancel }), [show, cancel])
        );

        return (
            <Row
                gutter={12}
                wrap={false}
                style={{
                    display: reply.show ? 'flex' : 'none',
                }}
                className={'replyInputWrapper'}
            >
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
                    <Input
                        ref={inputRef}
                        suffix={
                            <Button
                                shape="circle"
                                icon={<SendOutlined />}
                                size={'middle'}
                                type={'primary'}
                                onClick={handleSubmitReply}
                                loading={createCommentMutation.isLoading}
                                disabled={!comment.trim() || createCommentMutation.isLoading}
                            />
                        }
                        size={'large'}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder={'Trả lời ...'}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.keyCode === 13) {
                                e.preventDefault();
                                handleSubmitReply();
                            }
                        }}
                        style={{ padding: '5px', paddingLeft: '12px', paddingRight: '5px', borderRadius: '25px' }}
                    />
                </Col>
            </Row>
        );
    }
);

CommentReplyInput.displayName = 'CommentReplyInput';

export default CommentReplyInput;
