import Images from "@/src/constants/Images";
import { FullProfileResource } from "@/src/data/auth/models/types";
import { ChatRoomInfoResource } from "@/src/data/message/models/message.types";
import { Avatar, Space, Typography } from "antd";
import { memo } from "react";

export const ChatHeader: React.FC<{
  chat: ChatRoomInfoResource;
  isPartner?: boolean;
  fullProfileResource?:Partial<FullProfileResource>;
  selectedChatFromList: any;
}> = memo(({ chat, isPartner, fullProfileResource, selectedChatFromList }) => {
  const avat =
    fullProfileResource?.userId == chat?.infoDetail?.partnerId
      ? selectedChatFromList?.infoDetail?.clientAvatar
      : selectedChatFromList?.infoDetail?.partnerAvatar;
  const name =
    fullProfileResource?.userId === chat?.infoDetail?.partnerId
      ? selectedChatFromList?.infoDetail?.clientName
      : selectedChatFromList?.infoDetail?.partnerName;

  return (
    <div
      style={{
        padding: "16px",
        borderBottom: "1px solid #f0f0f0",
        backgroundColor: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ position: "relative" }}>
            <Avatar
              src={avat || Images.ACCOUNT_DEFAULT}
              size={32}
              style={{
                backgroundColor: "#f0f0f0",
                color: "#666",
                flexShrink: 0,
                fontWeight: "bold",
              }}
            >
              {fullProfileResource?.userId === chat?.infoDetail?.partnerId
                ? selectedChatFromList?.infoDetail?.clientName
                : selectedChatFromList?.infoDetail?.partnerName}
            </Avatar>
            {/* Online status indicator */}
            <div
              style={{
                position: "absolute",
                bottom: "-2px",
                right: "-1px",
                width: "10px",
                height: "10px",
                backgroundColor: chat?.items?.map(
                  (item) => item?.sender?.isOnline
                )
                  ? "#52c41a"
                  : "#d9d9d9",
                borderRadius: "50%",
                border: "2px solid #fff",
              }}
            />
          </div>
          <div>
            <Typography.Title level={5} style={{ margin: 0, fontSize: "16px" }}>
              {fullProfileResource?.userId == chat?.infoDetail?.partnerId
                ? selectedChatFromList?.infoDetail?.clientName
                : selectedChatFromList?.infoDetail?.partnerName}
              <span style={{ color: "#8c8c8c", fontWeight: "normal" }}>
                {/* @
                {chat?.infoDetail?.partnerName
                  ? chat?.infoDetail?.partnerName?.toLowerCase()
                  : chat?.infoDetail?.clientName} */}
              </span>
            </Typography.Title>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "13px",
                color: "#8c8c8c",
              }}
            >
              <Typography.Text
                strong
                style={{
                  margin: 0,
                  fontSize: "15px",
                  fontWeight: "bold",
                  color: "#09993E",
                }}
              >
                {chat?.infoDetail?.partnerId == fullProfileResource?.userId
                  ? "Đối tác"
                  : "Khách hàng"}
              </Typography.Text>
            </div>
          </div>
        </div>
        <Space>
          {/* <Star size={20} style={{ color: "#8c8c8c", cursor: "pointer" }} /> */}
          {/* <MoreHorizontal size={20} style={{ color: "#8c8c8c", cursor: "pointer" }} /> */}
        </Space>
      </div>
    </div>
  );
});
