"use client";

import type React from "react";
import { Modal } from "antd";

interface ConnectingPotentialCustomersModalProps {
  isVisible: boolean;
  onClose: () => void;
  onRegister: () => void;
  imageSrc?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageAlt?: string;
}

export const ConnectingPotentialCustomersModal: React.FC<
  ConnectingPotentialCustomersModalProps
> = ({
  isVisible,
  onClose,
  onRegister,
  imageSrc = "/assets/img/partners/popup_50_partners_first.png",
  imageWidth = 500,
  imageHeight = 600,
  imageAlt = "Đăng ký trở thành Đối tác",
}) => {
  const handleImageClick = () => {
    onClose();
    onRegister();
  };

  const handleMaskClick = () => {
    onClose();
  };

  return (
    <Modal
      open={isVisible}
      onCancel={handleMaskClick}
      footer={null}
      centered
      width={imageWidth + 40}
      styles={{
        mask: {
          backgroundColor: "rgba(40, 38, 38, 0.8)",
        },
        content: {
          padding: 0,
          backgroundColor: "transparent",
          boxShadow: "none",
        },
      } as any}
    >
      <div
        style={{
          width: "100%",
          textAlign: "center",
          padding: 20,
        }}
      >
        <img
          src={imageSrc}
          alt={imageAlt}
          width={imageWidth}
          height={imageHeight}
          onClick={handleImageClick}
          style={{
            cursor: "pointer",
            borderRadius: 12,
            boxShadow: "none",
            transition: "transform 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.02)";
            e.currentTarget.style.boxShadow = "none";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
      </div>
    </Modal>
  );
};
