import React, { RefObject } from "react";
import { Col, Row, Space } from "antd";

import { DocumentCommentResource } from "@/src/data/document/models/document.types";
import CommentItem from "./CommentItems";
import { CommentReplyInputHelperVisible } from "./CommentReplyInput";

interface CommentGroupProps {
  comment: DocumentCommentResource;
  commentReplyInputRef?: RefObject<CommentReplyInputHelperVisible>;
  replyingId: number | null;
}

export default function CommentGroup({
  comment,
  commentReplyInputRef,
  replyingId,
}: CommentGroupProps) {
  return (
    <>
      <CommentItem
        comment={comment}
        commentReplyInputRef={commentReplyInputRef as any}
        replyingId={replyingId}
      />
      {comment.replies.length > 0 && (
        <Row justify={"end"} style={{ paddingTop: "16px" }}>
          <Col flex={"48px"} />
          <Col flex={"auto"}>
            <Space direction={"vertical"} size={"middle"} className={"d-flex"}>
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  commentReplyInputRef={commentReplyInputRef as any}
                  replyingId={replyingId}
                />
              ))}
            </Space>
          </Col>
        </Row>
      )}
    </>
  );
}
