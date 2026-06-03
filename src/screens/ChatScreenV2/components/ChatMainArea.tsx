import type React from "react";
import { useRef, useEffect, useState } from "react";
import { Col, Typography } from "antd";
import {
  MessagesContainer,
  type MessagesContainerRef,
} from "./MessagesContainer";
import { MessageInput } from "./MessageInput";
import { ChatHeader } from "./ChatHeader";
import { ReplyInfo } from "./ReplyInfo";
import {
  ChatRoomInfoResource,
  MessageItemsResource,
  ReplyMessageResource,
} from "@/src/data/message/models/message.types";
import { RcFile } from "antd/es/upload";
import { FullProfileResource } from "@/src/data/auth/models/types";

export type ArrivalMeta = {
  id: string | number;
  senderId: number;
  roomId?: string;
  at: number;
};

interface ChatMainAreaProps {
  selectedChat: ChatRoomInfoResource | undefined;
  currentUserId: number;
  messageText: string;
  onMessageTextChange: (text: string) => void;
  onSendMessage: (files?: RcFile[]) => any;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onReplyMessage?: (messageId: string) => Promise<void>;
  onChatUpdate?: (updatedChat: ChatRoomInfoResource) => void;
  isLoading?: boolean;
  isPartner?: boolean;
  files: RcFile[];
  setFiles: (files: RcFile[]) => void;
  incomingArrival?: ArrivalMeta;
  getDetailReply: (messId: string, roomId: string) => void;
  fullProfileResource?: FullProfileResource;
  selectedChatFromList: any;
  isPopup?: boolean;
}

export const ChatMainArea: React.FC<ChatMainAreaProps> = ({
  selectedChat,
  currentUserId,
  messageText,
  onMessageTextChange,
  onSendMessage,
  onKeyPress,
  onReplyMessage,
  onChatUpdate,
  isLoading = false,
  isPartner,
  files,
  setFiles,
  incomingArrival,
  getDetailReply,
  fullProfileResource,
  selectedChatFromList,
  isPopup,
}) => {
  const messagesContainerRef = useRef<MessagesContainerRef>(null);

  const [attachmentDropdownOpen, setAttachmentDropdownOpen] = useState(false);
  const [localChat, setLocalChat] = useState<ChatRoomInfoResource | undefined>(
    selectedChat
  );

  // Reply state
  const [replyingTo, setReplyingTo] = useState<ReplyMessageResource | null>(
    null
  );
  const [currentMessage, setCurrentMessage] =
    useState<MessageItemsResource | null>();

  // const [files, setFiles] = useState<RcFile[]>([]); // State để lưu trữ các tệp đã chọn

  useEffect(() => {
    setLocalChat(selectedChat);
    // Reset reply state when changing chats
    setReplyingTo(null);
  }, [selectedChat]);

  const addMessageToChat = (message: MessageItemsResource | null) => {
    if (!localChat) return;
    if (!message) return;

    const updatedChat: ChatRoomInfoResource = {
      ...localChat,
      items: [...localChat?.items, message],
    };

    setLocalChat(updatedChat);
    if (onChatUpdate) {
      onChatUpdate(updatedChat);
    }
  };

  const handleSendMessage = async (filesList: RcFile[]) => {
    if (messageText.trim()) {
      addMessageToChat(currentMessage!);
    }

    onMessageTextChange("");
    setReplyingTo(null);

    await onSendMessage(files);
    handleCancelReply();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      handleSendMessage(files);
    }
    if (e.key === "Escape" && replyingTo) {
      setReplyingTo(null);
    }
    onKeyPress(e);
  };

  const handleReply = async (message: MessageItemsResource) => {
    setReplyingTo(message.replyMessage);
    setCurrentMessage(message);

    if (onReplyMessage) {
      await onReplyMessage(message?.id);
    }
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setCurrentMessage(null);
  };

  if (!localChat) {
    return (
      <Col
        xs={24}
        sm={24}
        md={24}
        lg={24}
        xl={isPopup ? 24 : 12} // ✅ Desktop lớn: chia nửa
        xxl={isPopup ? 24 : 12} // ✅ Ultra-wide: chia nửa
        span={isPopup ? 24 : 12}
        style={{
          height: "100%",
          display: "flex",
          border: "1px solid #f0f0f0",
          borderRadius: 8,
          flexDirection: "column",
          boxSizing: "border-box",
          paddingLeft: "0 !important",
          paddingRight: "0 !important",
          margin: 0,
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Typography.Text style={{ color: "#8c8c8c", fontSize: "16px" }}>
          Chọn một cuộc trò chuyện để bắt đầu
        </Typography.Text>
      </Col>
    );
  }

  const receiverName =
    fullProfileResource?.userId === localChat?.infoDetail?.partnerId
      ? selectedChatFromList?.infoDetail?.clientName
      : selectedChatFromList?.infoDetail?.partnerName;

  return (
    <>
      <Col
        xs={24} // ✅ Mobile: full width
        sm={24} // ✅ Small tablet: full width
        md={24} // ✅ Medium tablet: full width
        lg={24} // ✅ Desktop nhỏ: full width
        xl={isPopup ? 24 : 12} // ✅ Desktop lớn: chia nửa
        xxl={isPopup ? 24 : 12} // ✅ Ultra-wide: chia nửa
        span={isPopup ? 24 : 12}
        style={{
          height: "100%",
          display: "flex",
          border: "1px solid #f0f0f0",
          borderRadius: 8,
          flexDirection: "column",
          boxSizing: "border-box",
          paddingLeft: "0 !important",
          paddingRight: "0 !important",
          margin: 0,
        }}
      >
        {localChat && (
          <>
            <ChatHeader
              selectedChatFromList={selectedChatFromList}
              isPartner={isPartner}
              chat={localChat}
              fullProfileResource={fullProfileResource}
            />

            {/* Messages Container*/}
            <MessagesContainer
              ref={messagesContainerRef}
              chat={localChat}
              currentUserId={currentUserId}
              onImageClick={() => {}}
              onVideoClick={() => {}}
              onFileClick={() => {}}
              onReply={handleReply}
              room_id={selectedChat?.roomId || ""}
              newArrival={incomingArrival}
              getDetailReply={(messId) => {
                if (getDetailReply) {
                  getDetailReply(messId, localChat.roomId);
                }
              }}
              selectedChatFromList={selectedChatFromList}
              isLoadingMore={isLoading}
            />

            {/* Reply Info */}
            <ReplyInfo
              message={currentMessage!}
              onCancelReply={handleCancelReply}
              currentUserId={currentUserId}
            />

            <MessageInput
              files={files}
              setFiles={setFiles}
              messageText={messageText}
              onMessageTextChange={onMessageTextChange}
              onSendMessage={() => handleSendMessage(files)}
              onKeyPress={handleKeyPress}
              partnerName={receiverName || ""}
              attachmentDropdownOpen={attachmentDropdownOpen}
              setAttachmentDropdownOpen={setAttachmentDropdownOpen}
            />
          </>
        )}
      </Col>
    </>
  );
};
