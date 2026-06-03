// File: GuideToFindingPartnersSectionModal.tsx
"use client";

import React, { useEffect } from "react";
import { Modal } from "antd";

interface GuideToFindingPartnersSectionModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  arcadeIframeRef: React.MutableRefObject<HTMLIFrameElement | null>;
}

const GuideToFindingPartnersSectionModal: React.FC<
  GuideToFindingPartnersSectionModalProps
> = ({ open, title, onClose, arcadeIframeRef }) => {
  useEffect(() => {
    if (open && arcadeIframeRef.current) {
      arcadeIframeRef.current.style.position = "absolute";
      arcadeIframeRef.current.style.zIndex = "auto";
    }
  }, [open, arcadeIframeRef]);

  return (
    <Modal
      title={title}
      open={open}
      onCancel={onClose}
      footer={null}
      width={1000}
      centered
      destroyOnHidden={true}
    >
      <div
        style={{
          position: "relative",
          paddingBottom: "56.25%",
          height: 0,
          width: "100%",
        }}
      >
        <iframe
          src={arcadeIframeRef.current?.src}
          title="HƯỚNG DẪN TÌM KIẾM ĐỐI TÁC"
          frameBorder="0"
          loading="lazy"
          allowFullScreen
          allow="clipboard-write"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            colorScheme: "light",
          }}
        />
      </div>
    </Modal>
  );
};

export default GuideToFindingPartnersSectionModal;
