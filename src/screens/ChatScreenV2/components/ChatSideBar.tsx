"use client";


import { Search } from "lucide-react";
import { Avatar, Input, Typography, Col, Badge, Empty, Tabs } from "antd";
import type { TabsProps } from "antd";
import { ListRoomChatOfUser } from "@/src/data/message/models/message.types";
import { FullProfileResource } from "@/src/data/auth/models/types";
import {
  includes,
  isEmpty,
  last,
  map,
  toNumber,
  truncate,
  upperCase,
} from "lodash";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import Images from "@/src/constants/Images";
import { WalletAccountType } from "@/src/data/wallet/wallet.service";
import { motion, AnimatePresence } from "framer-motion";
import datetimeUtils from "@/src/utils/DatetimeUtils";
import Fuse from "fuse.js";
import { useMemo } from "react";

/* ===================== Types ===================== */
interface ChatSidebarProps {
  chats: ListRoomChatOfUser[];
  selectedChatId: string;
  searchQuery: string;
  onChatSelect: (chatId: string) => void;
  onSearchChange: (query: string) => void;
  isPartner?: boolean;
  fullProfileResource: Partial<FullProfileResource> | null;
}

/* ===================== Helpers ===================== */
// highlight search text
const highlightText = (
  text: string | undefined,
  searchQuery: string
): React.ReactNode => {
  if (!searchQuery.trim()) return text;
  const parts = text?.split(
    new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
  );
  return map(parts, (part, index) =>
    part.toLowerCase() === searchQuery.toLowerCase() ? (
      <span
        key={index}
        style={{
          backgroundColor: "#fff2b8",
          fontWeight: 600,
          borderRadius: 4,
          padding: "0 2px",
        }}
      >
        {part}
      </span>
    ) : (
      part
    )
  );
};

// xác định phía đối tác/khách hàng dựa trên hồ sơ hiện tại
const isApply = (full: Partial<FullProfileResource> | null, id?: number) =>
  toNumber(full?.userId) !== toNumber(id);

const isHost = (full: Partial<FullProfileResource> | null, id?: number) =>
  toNumber(full?.userId) == toNumber(id);

/* ===================== Component ===================== */
export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chats,
  selectedChatId,
  searchQuery,
  onChatSelect,
  onSearchChange,
  isPartner,
  fullProfileResource,
}) => {
  // lọc theo search
  // const filteredChats = React.useMemo(() => {
  //   if (!searchQuery.trim()) return chats;
  //   const query = searchQuery.toLowerCase();
  //   return chats.filter((chat) => {
  //     if (chat.chatRoom?.message?.sender?.name?.toLowerCase().includes(query))
  //       return true;
  //     if (chat?.chatRoom?.project?.name?.toLowerCase().includes(query))
  //       return true;
  //     if (chat.chatRoom?.message?.content?.toLowerCase().includes(query))
  //       return true;
  //     return false;
  //   });
  // }, [chats, searchQuery]);
// console.log("chats", chats);

  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return chats;

    // Cấu hình các "phím" (trường dữ liệu) muốn tìm kiếm và độ ưu tiên
    const options = {
      keys: [
        "infoDetail.clientName",
        "infoDetail.partnerName",
        "infoDetail.projectName",
        "infoDetail.projectDes",
        "latestMessage.content",
        "latestMessage.status"
      ],
      threshold: 0.6, // Càng nhỏ càng khắt khe (0.0 là khớp tuyệt đối, 1.0 là khớp mọi thứ)
      distance: 100, // Khoảng cách sai số ký tự
      ignoreLocation: true, // Tìm kiếm mọi nơi trong chuỗi
    };

    const fuse = new Fuse(chats, options);

    // Thực hiện tìm kiếm
    const results = fuse.search(searchQuery);

    // Fuse.js trả về mảng dạng [{ item: chat, refIndex: 0 }, ...], ta cần map lại để lấy chat
    return results.map((result) => result.item);
  }, [chats, searchQuery]);

  // chỉ tính 2 nhóm khi là Partner
  const partnerChats = useMemo(
    () =>
      filteredChats.filter((c) =>
        isHost(fullProfileResource, c?.infoDetail?.projectCreatedByUserId)
      ),
    [filteredChats, fullProfileResource, isPartner]
  );

  const customerChats = useMemo(
    () =>
      filteredChats.filter((c) =>
        isApply(fullProfileResource, c?.infoDetail?.projectCreatedByUserId)
      ),
    [filteredChats, fullProfileResource, isPartner]
  );

  // ✅ UI zin list (motion + time bên phải)
  const renderList2 = (list: ListRoomChatOfUser[]) => {
    if (!list?.length) {
      return (
        <div style={{ padding: "40px 16px", textAlign: "center" }}>
          <Empty
            description={
              searchQuery
                ? "Không tìm thấy cuộc trò chuyện nào"
                : "Chưa có tin nhắn nào"
            }
            style={{ marginBottom: 0 }}
          />
        </div>
      );
    }

    return (
      <AnimatePresence>
        {list.map((chat) => {
          const key = chat.chatRoomId || chat.roomId;
          const isActive = selectedChatId === key;

          const avatarUrl =
            fullProfileResource?.userId === chat?.infoDetail?.partnerId
              ? chat?.infoDetail?.clientAvatar
              : chat?.infoDetail?.partnerAvatar;

          const displayName =
            fullProfileResource?.userId === chat.infoDetail.partnerId
              ? chat.infoDetail.clientName
              : chat.infoDetail.partnerName;

          const isLastSender =
            fullProfileResource?.userId == last(chat?.items)?.sender?.id;

          const lastMessages =
            last(chat?.items)?.content ||
            (chat as any)?.latestMessage ||
            (last(last(chat?.items)?.attachments) as any)?.file_name_original ||
            (last(last(chat?.items)?.attachments) as any)?.file_name ||
            "";

          // lastMessages có thể là object -> lấy content, còn string -> dùng luôn
          const lastText =
            typeof lastMessages === "string"
              ? lastMessages
              : (lastMessages as any)?.content || "";

          const lastMessage = !isEmpty(lastText)
            ? `${isLastSender ? "Bạn:" : ""} ${lastText}`
            : "";

          return (
            <motion.div
              key={key}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 4000, damping: 30 }}
              onClick={() => onChatSelect(key)}
              style={{
                padding: 14,
                borderBottom: "1px solid #f5f5f5",
                cursor: "pointer",
                backgroundColor: isActive
                  ? "rgba(9, 153, 62, 0.08)"
                  : "transparent",
                borderLeft: isActive
                  ? "4px solid #09993E"
                  : "4px solid transparent",
                transition: "all .2s ease",
                display: "flex",
                gap: 12,
              }}
              onMouseEnter={(e) => {
                if (!isActive)
                  e.currentTarget.style.backgroundColor = "#fafafa";
              }}
              onMouseLeave={(e) => {
                if (!isActive)
                  e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <div style={{ position: "relative", flexShrink: 0 }}>
                <Avatar
                  src={avatarUrl || Images.ACCOUNT_DEFAULT}
                  size={48}
                  style={{
                    backgroundColor: "#f0f0f0",
                    color: "#666",
                    fontWeight: 600,
                  }}
                />
              </div>

              {/* Nội dung */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <IconSvgLocal name={"IC_BAG"} width={20} height={20} />
                  <span
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      color: "#1f2937",
                      fontWeight: 600,
                    }}
                    title={chat?.infoDetail?.projectName}
                  >
                    {truncate(upperCase(chat?.infoDetail?.projectName || ""), {
                      length: 40,
                      omission: "...",
                    })}
                  </span>
                </div>

                <Typography.Text
                  style={{
                    fontSize: 15,
                    color: "#262626",
                    fontWeight: 700,
                    display: "block",
                    marginBottom: 4,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={displayName}
                >
                  {displayName}
                </Typography.Text>

                <Typography.Text
                  style={{
                    fontSize: 14,
                    color: "#09993E",
                    display: "flex",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontWeight: 500,
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                  title={lastMessage}
                >
                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      flex: 1,
                    }}
                  >
                    {!isEmpty(lastMessage)
                      ? highlightText(lastMessage, searchQuery)
                      : "Chưa có tin nhắn"}
                  </span>

                  {(chat as any)?.latestMessage?.sending_at && (
                    <span
                      style={{
                        color: "#8c8c8c",
                        flexShrink: 0,
                        fontSize: 14,
                      }}
                    >
                      {datetimeUtils.getDateFromNow(
                        new Date(
                          (chat as any)?.latestMessage?.sending_at
                        ).getTime()
                      )}
                    </span>
                  )}
                </Typography.Text>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    );
  };

  // Tabs cho Partner
  const items: TabsProps["items"] = [
    {
      key: WalletAccountType.PARTNER,
      label: (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          CV Đăng tuyển
          <Badge
            count={partnerChats.length}
            style={{ backgroundColor: "#1677ff" }}
          />
        </span>
      ),
      children: (
        <div
          style={{ flex: 1, overflowY: "auto", overscrollBehavior: "contain" }}
        >
          {renderList2(partnerChats)}
        </div>
      ),
    },
    {
      key: WalletAccountType.CUSTOMER,
      label: (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          CV Ứng tuyển
          <Badge
            count={customerChats.length}
            style={{ backgroundColor: "#09993E" }}
          />
        </span>
      ),
      children: (
        <div
          style={{ flex: 1, overflowY: "auto", overscrollBehavior: "contain" }}
        >
          {renderList2(customerChats)}
        </div>
      ),
    },
  ];

  return (
    <Col
      xs={24}
      sm={24}
      md={24}
      lg={24}
      xl={5}
      xxl={5}
      span={5}
      style={{
        height: "100%",
        width: "100%",
        border: "1px solid #f0f0f0",
        borderRadius: 8,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
        overflow: "hidden",
      }}
    >
      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div
          style={{
            padding: 16,
            borderBottom: "1px solid #f0f0f0",
            background:
              "linear-gradient(180deg, rgba(249,250,251,1) 0%, rgba(255,255,255,1) 100%)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <Typography.Title
              level={5}
              style={{
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              Tất cả tin nhắn
              <Badge
                count={filteredChats.length}
                style={{ backgroundColor: "#09993E" }}
                showZero
              />
            </Typography.Title>
            <Search size={20} style={{ color: "#8c8c8c" }} />
          </div>

          <Input
            placeholder="Tìm kiếm theo tên, tin nhắn, địa điểm..."
            prefix={<Search size={16} style={{ color: "#8c8c8c" }} />}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{ borderRadius: 8 }}
            allowClear
          />

          {searchQuery && (
            <Typography.Text
              style={{
                fontSize: 12,
                color: "#8c8c8c",
                marginTop: 8,
                display: "block",
              }}
            >
              Tìm thấy {filteredChats.length} kết quả
            </Typography.Text>
          )}
        </div>

        {/* Nội dung */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: 0,
          }}
        >
          {isPartner ? (
            // Partner: có Tabs
            <Tabs
              defaultActiveKey={
                includes(map(customerChats, "chatRoomId"), selectedChatId)
                  ? WalletAccountType.CUSTOMER
                  : WalletAccountType.PARTNER
              }
              items={items}
              tabBarGutter={16}
              style={{
                padding: "8px 8px 0 8px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
              tabBarStyle={{
                margin: 0,
                paddingInline: 8,
                fontWeight: 600,
                flexShrink: 0,
              }}
              className="chat-sidebar-tabs"
              moreIcon={null}
            />
          ) : (
            // Không phải Partner: không tách Tab, render tất cả
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                overscrollBehavior: "contain",
                padding: "8px 8px 0 8px",
              }}
            >
              {renderList2(filteredChats)}
            </div>
          )}
        </div>
      </div>

      {/* CSS Global for Tabs scroll */}
      <style jsx global>{`
        .chat-sidebar-tabs {
          height: 100% !important;
        }

        .chat-sidebar-tabs .ant-tabs-content-holder {
          flex: 1;
          overflow: hidden;
          height: 0; /* Force flex child to shrink */
        }

        .chat-sidebar-tabs .ant-tabs-content {
          height: 100%;
          overflow: hidden;
        }

        .chat-sidebar-tabs .ant-tabs-tabpane {
          height: 100%;
          overflow: hidden;
          padding: 0;
        }

        .chat-sidebar-tabs .ant-tabs-tabpane-active {
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </Col>
  );
};
