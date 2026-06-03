import React from "react"
import { X } from "lucide-react"
import { Button } from "antd"
import { MessageItemsResource, ReplyMessageResource } from "@/src/data/message/models/message.types"

interface MessageAttachment {
  id: string
  name: string
  size: number
  type: string
  url: string
}

interface ReplyInfoProps {
  message: MessageItemsResource | null
  onCancelReply: () => void
  currentUserId: number
}

export const ReplyInfo: React.FC<ReplyInfoProps> = ({ 
  message, 
  onCancelReply, 
  currentUserId 
}) => {
  if (!message) return null;
  const isReplyingToSelf = message?.senderId === currentUserId

  return (
    <div
      style={{
        backgroundColor: "#f8f9fa",
        border: "1px solid #e8e8e8",
        borderRadius: "6px 6px 0 0",
        padding: "12px 16px",
        position: "relative",
        borderLeft: "4px solid #09993E",
        margin: "0",
        marginBottom: "0",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "12px",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              color: "#000000",
              marginBottom: "4px",
            }}
          >
            {isReplyingToSelf ? "Đang trả lời chính mình" : `Đang trả lời ${message?.sender.name}`}
          </div>
          <div
            style={{
              fontSize: "13px",
              color: "#666",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "100%",
            }}
          >
            {message?.content || 
             (message?.attachments && message?.attachments.length > 0 
               ? `${message?.attachments.length} tệp đính kèm` 
               : "Tin nhắn")}
          </div>
        </div>
        
        <Button
          type="text"
          size="small"
          icon={<X size={16} />}
          onClick={onCancelReply}
          style={{
            minWidth: "auto",
            padding: "4px",
            borderRadius: "4px",
            backgroundColor: "transparent",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#666",
            flexShrink: 0,
          }}
        />
      </div>
    </div>
  )
}