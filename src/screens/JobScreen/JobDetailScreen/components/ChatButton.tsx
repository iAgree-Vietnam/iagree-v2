import { MouseEvent, useState } from "react";
import { Button } from "antd";
import { useRouter } from "next/router"; // Khai báo useRouter
import {
  FullJobResource,
  UserProjectBidResource,
} from "@/src/data/job/models/job.types";
import MessageServices from "@/src/data/message/services/MessageServices";
import useDetectDevice from "@/src/hooks/useDetectDevice";
import { MessageOutlined } from "@ant-design/icons"; // Import icon MessageOutlined

const ChatButton = ({
  partnerApplyInfo,
  fullJobResource,
}: {
  partnerApplyInfo: UserProjectBidResource;
  fullJobResource: FullJobResource;
}) => {
  const [roomId, setRoomId] = useState<string | number | null>(null); // State to store the roomId
  const { isMobile } = useDetectDevice();
  const router = useRouter(); // Khai báo useRouter

  const handleClick = async (e: MouseEvent<HTMLButtonElement>) => {
    try {
      // Gọi API để tạo phòng chat
      e.stopPropagation();
      const result = await new MessageServices().createRoomChat(
        partnerApplyInfo.userId,
        fullJobResource?.jobId || 0
      );

      // Khi API trả về thành công, lưu roomId vào state
      setRoomId(result.roomId);

      // Kiểm tra và điều hướng bằng router.push nếu là thiết bị di động
      const url = `/chat?chat_room=${result.roomId}`;
      router.push(url); // Sử dụng router.push để điều hướng trang
    } catch (error) {
      // Handle error if needed
      console.error("Error creating chat room:", error);
    }
  };

  // Cũ: Phần code dùng icon để tạo nút chat
  // const buttonChat = (
  //   <Button
  //     type="text"
  //     icon={
  //       <MessageOutlined
  //         style={{
  //           fontSize: 24,
  //           color: "#09993E",
  //           marginLeft: 8,
  //         }}
  //       />
  //     }
  //     onClick={handleClick}
  //     style={{
  //       padding: 0,
  //       background: "transparent",
  //       border: "none",
  //     }}
  //   />
  // );

  // Mới: Thay đổi để dùng nút "Nhắn tin" thay vì icon
  const buttonChat = (
    <Button
      onClick={handleClick}
      type="primary" // Thêm kiểu button primary để nổi bật
      icon={<MessageOutlined />} // Thêm icon MessageOutlined vào nút

      style={{
        fontSize: 16, // Thay đổi kích thước chữ
        backgroundColor: "#09993E", // Màu nền xanh
        color: "#fff", // Màu chữ trắng
        border: "none", // Không có viền
        padding: "10px 20px", // Cải thiện padding để nút đẹp hơn
        borderRadius: "5px", // Bo góc cho nút
        width: 255
      }}
    >
      Nhắn tin
    </Button>
  );

  // Trả về nút Chat
  return buttonChat;
};

export default ChatButton;
