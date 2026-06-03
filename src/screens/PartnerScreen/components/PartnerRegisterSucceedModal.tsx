"use client";

import type React from "react";
import { Modal } from "antd";
import useDetectDevice from "@/src/hooks/useDetectDevice";

interface PartnerRegisterSucceedModalProps {
  isVisible: boolean;
  onClose: () => void;
  onJobApply: () => void;
  imageSrc?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageAlt?: string;
}

export const PartnerRegisterSucceedModal: React.FC<
  PartnerRegisterSucceedModalProps
> = ({
  isVisible,
  onClose,
  onJobApply,
  imageSrc = "/assets/img/partners/popup_register_partner_succeed.png",
  imageWidth = 600,
  imageHeight = 600,
  imageAlt = "Đăng ký trở thành Đối tác",
}) => {
  const handleImageClick = () => {
    onClose();
    onJobApply();
  };
  const isMobile = useDetectDevice().isMobile();

  const handleMaskClick = () => {
    onClose();
  };

  return (
    <Modal
      open={isVisible}
      onCancel={handleMaskClick}
      footer={null}
      centered
      width={isMobile ? "100%" : imageWidth + 40}
      styles={
        {
          mask: {
            backgroundColor: "rgba(40, 38, 38, 0.8)",
          },
          content: {
            padding: 0,
            backgroundColor: "transparent",
            boxShadow: "none",
          },
          background: "transparent",
        } as any
      }
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
          width={isMobile ? "100%" : imageWidth}
          height={isMobile ? "100%" : imageHeight}
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
