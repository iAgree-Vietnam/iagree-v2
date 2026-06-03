import React, { useEffect, useRef, useState } from 'react';
import { Affix, Tabs } from 'antd';

import CommentsTab from './CommentsTab';
import Constants from '@/src/constants/Constants';
import CommentReplyInput, {
    CommentReplyInputHelperVisible,
} from './CommentReplyInput';

interface SideRightProps {
    documentId: number;
}

export default function SideRight({ documentId }: SideRightProps) {
    const [replyingId, setReplyingId] = useState<number | null>(null);

    const sideRightRef = useRef<HTMLDivElement>(null);
    const commentReplyInputRef = useRef<CommentReplyInputHelperVisible>(null);

    useEffect(() => {
        // Handler to call on window scroll
        function handleScroll() {
            if (sideRightRef.current) {
                const top = sideRightRef.current.getBoundingClientRect().top;
                if (top >= Constants.HEADER.HEIGHT) {
                    sideRightRef.current.style.height = `calc(100vh - ${top}px)`;
                }
            }
        }
        // Add event listener
        window.addEventListener('scroll', handleScroll);
        // Call handler right away with initial
        handleScroll();
        // Remove event listener on cleanup
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <Affix
            offsetTop={Constants.HEADER.HEIGHT}
            style={{ position: 'relative', zIndex: replyingId ? 2000000001 : 100 }}
        >
            <div className={'sideRight'} ref={sideRightRef}>
                <Tabs
                    defaultActiveKey={'1'}
                    items={[
                        {
                            key: '1',
                            label: 'Bình luận',
                            children: (
                                <CommentsTab
                                    documentId={documentId}
                                    commentReplyInputRef={commentReplyInputRef as any}
                                    replyingId={replyingId}
                                />
                            ),
                        },
                        // {
                        //     key: '2',
                        //     label: 'Lịch sử chỉnh sửa',
                        //     children: 'Lịch sử trống',
                        // },
                    ]}
                    onChange={() => {
                        commentReplyInputRef.current?.cancel();
                    }}
                />
                <CommentReplyInput
                    ref={commentReplyInputRef}
                    setReplyingId={setReplyingId}
                />
            </div>
        </Affix>
    );
}
