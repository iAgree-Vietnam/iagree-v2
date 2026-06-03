import React, { RefObject, useCallback } from "react";
import { Space, Row, Col, Image, Typography, Button, Divider } from "antd";

import Images from "@/src/constants/Images";
import { DocumentCommentResource } from "@/src/data/document/models/document.types";
import { CommentReplyInputHelperVisible } from "./CommentReplyInput";

export interface CommentItemProps {
  comment: DocumentCommentResource;
  commentReplyInputRef: RefObject<CommentReplyInputHelperVisible>;
  replyingId: number | null;
}

export default function CommentItem({
  comment,
  commentReplyInputRef,
  replyingId,
}: CommentItemProps) {
  const handleShowReply = useCallback(() => {
    if (commentReplyInputRef.current)
      commentReplyInputRef.current?.show(comment);
  }, [comment, commentReplyInputRef]);

  const handleCancelReply = useCallback(() => {
    if (commentReplyInputRef.current) commentReplyInputRef.current?.cancel();
  }, [commentReplyInputRef]);

  return (
    <>
      <Space direction={"vertical"} size={"middle"} className={"d-flex"}>
        <Row gutter={12}>
          <Col>
            <Image
              preview={false}
              src={comment.user?.avatarUrl}
              fallback={Images.ACCOUNT_DEFAULT}
              alt={"avatar"}
              width={48}
              height={48}
              style={{ borderRadius: "50%" }}
            />
          </Col>
          <Col flex={1}>
            <Typography>{comment.user?.fullName}</Typography>
            <Typography.Paragraph
              type={"secondary"}
              style={{ marginBottom: 0 }}
            >
              {comment.createdDate}
            </Typography.Paragraph>
          </Col>
        </Row>
        <Typography>{comment.comment}</Typography>
        <Row justify={"end"} align={"middle"}>
          <Button
            type="link"
            onClick={
              replyingId === comment.id ? handleCancelReply : handleShowReply
            }
          >
            {replyingId === comment.id ? "Hủy" : "Trả lời"}
          </Button>
        </Row>
      </Space>
      <Divider style={{ margin: 0 }} />
    </>
  );
}
