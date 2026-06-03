import type React from "react";
import { useRef, useEffect, useState, useCallback } from "react";
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
import { filter, toUpper } from "lodash";
import { useDropzone } from "react-dropzone";

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
  fullProfileResource: Partial<FullProfileResource> | null;
  selectedChatFromList: any;
  isPopup?: boolean;
  disabled?: boolean;
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
  disabled = false,
}) => {
  const messagesContainerRef = useRef<MessagesContainerRef>(null);

  const [attachmentDropdownOpen, setAttachmentDropdownOpen] = useState(false);
  const [localChat, setLocalChat] = useState<ChatRoomInfoResource | undefined>(
    selectedChat
  );

  const [replyingTo, setReplyingTo] = useState<ReplyMessageResource | null>(
    null
  );
  const [currentMessage, setCurrentMessage] =
    useState<MessageItemsResource | null>();

  // Khi đổi phòng chat → reset reply
  useEffect(() => {
    setLocalChat(selectedChat);
    setReplyingTo(null);
  }, [selectedChat]);

  // ⚡ Xử lý kéo & thả file
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const rcFiles = acceptedFiles as unknown as RcFile[];
      setFiles([...files, ...rcFiles]);
    },
    [setFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    noClick: true, // Ngăn click mở input file
  });

  // ⚡ Xử lý Ctrl + V / Cmd + V dán ảnh
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePaste = (event: Event) => {
      const e = event as ClipboardEvent; // ✅ ép kiểu an toàn
      if (!e.clipboardData) return;

      const items = e.clipboardData.items;
      const pastedFiles: RcFile[] = [];

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            pastedFiles.push(file as unknown as RcFile);
          }
        }
      }

      if (pastedFiles.length > 0) {
        e.preventDefault();
        setFiles([...files, ...pastedFiles]);
      }
    };

    window.addEventListener("paste", handlePaste as EventListener); // ✅ ép kiểu
    return () => {
      window.removeEventListener("paste", handlePaste as EventListener);
    };
  }, [setFiles]);

  // ⚡ Xử lý chuột phải → Dán ảnh (Right Click Paste)
  const handleRightClickPaste = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const clipboardItems = await navigator.clipboard.read();
      const pastedFiles: RcFile[] = [];

      for (const item of clipboardItems) {
        for (const type of item.types) {
          if (type.startsWith("image/")) {
            const blob = await item.getType(type);
            const file = new File([blob], `pasted-${Date.now()}.png`, { type });
            pastedFiles.push(file as unknown as RcFile);
          }
        }
      }

      if (pastedFiles.length > 0) {
        setFiles([...files, ...pastedFiles]);
      }
    } catch (err) {
      console.warn("⚠️ Không thể đọc clipboard:", err);
    }
  };

  // Cập nhật tin nhắn mới vào danh sách
  const addMessageToChat = (message: MessageItemsResource | null) => {
    if (!localChat || !message) return;

    const updatedChat: ChatRoomInfoResource = {
      ...localChat,
      items: [...localChat.items, message],
    };

    setLocalChat(updatedChat);
    onChatUpdate?.(updatedChat);
  };

  const handleSendMessage = async (filesList: RcFile[]) => {
    if (messageText.trim()) addMessageToChat(currentMessage!);

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
    await onReplyMessage?.(message.id);
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
        xl={isPopup ? 24 : 12}
        xxl={isPopup ? 24 : 12}
        style={{
          height: "100%",
          display: "flex",
          border: "1px solid #f0f0f0",
          borderRadius: 8,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography.Text style={{ color: "#8c8c8c", fontSize: 16 }}>
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
    <Col
      xs={24}
      sm={24}
      md={24}
      lg={24}
      xl={isPopup ? 24 : 12}
      xxl={isPopup ? 24 : 12}
      style={{
        height: "100%",
        display: "flex",
        border: "1px solid #f0f0f0",
        borderRadius: 8,
        flexDirection: "column",
      }}
    >
      <ChatHeader
        selectedChatFromList={selectedChatFromList}
        isPartner={isPartner}
        chat={localChat}
        fullProfileResource={fullProfileResource || undefined}
      />

      <MessagesContainer
        ref={messagesContainerRef}
        chat={{
          ...localChat,
          items: filter(localChat.items, (it) => {
            return it?.chatRoomId === localChat?.items?.[0]?.chatRoomId;
          }),
        }}
        currentUserId={currentUserId}
        onImageClick={() => {}}
        onVideoClick={() => {}}
        onFileClick={() => {}}
        onReply={handleReply}
        room_id={selectedChat?.roomId || ""}
        newArrival={incomingArrival}
        getDetailReply={(messId) => getDetailReply(messId, localChat.roomId)}
        selectedChatFromList={selectedChatFromList}
        isLoadingMore={isLoading}
      />

      <ReplyInfo
        message={currentMessage!}
        onCancelReply={handleCancelReply}
        currentUserId={currentUserId}
      />

      {/* Input + Drag + Right click paste */}
      <div
        {...getRootProps()}
        onContextMenu={handleRightClickPaste}
        style={{
          // border: isDragActive
          //   ? "2px dashed #1890ff"
          //   : "2px dashed transparent",
          padding: 0,
          borderRadius: 4,
          transition: "border-color 0.2s",
        }}
      >
        <input {...getInputProps()} />
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
          disabled={toUpper(localChat?.status) === "INACTIVE" || disabled}
        />
      </div>
    </Col>
  );
};
