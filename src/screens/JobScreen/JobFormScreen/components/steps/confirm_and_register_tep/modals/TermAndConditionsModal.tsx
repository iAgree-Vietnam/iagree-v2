import React, { useRef, useState, useEffect } from "react";
import { Modal, Button, Spin } from "antd";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import dynamic from "next/dynamic";
import Constants from "@/src/constants/Constants";

const PDFViewer: React.FC<{
  fileUrl: string;
  onReachEnd: () => void;
}> = ({ fileUrl, onReachEnd }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const baseUrl = process.env.BASE_URL;

  const handleScroll = () => {
    const div = scrollRef.current;
    if (div) {
      const { scrollTop, scrollHeight, clientHeight } = div;
      if (scrollTop + clientHeight >= scrollHeight * 0.95 - 10) {
        onReachEnd();
      }
    }
  };

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className={"hide-scroll"}
      style={{
        height: "500px",
        overflowY: "auto",
        border: "1px solid #d9d9d9",
        padding: "8px",
      }}
    >
      <iframe
        src={`${baseUrl}/policy/confirmClient.html`}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          borderRadius: 8,
        }}
        title={"form-khach-hang"}
      />
    </div>
  );
};

interface TermAndConditionsModalProps {
  visible: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const TermAndConditionsModal: React.FC<TermAndConditionsModalProps> = ({
  visible,
  onClose,
  onAccept,
}) => {
  const [canAccept, setCanAccept] = useState(false);

  const baseUrl = process.env.BASE_URL;
  const pdfLink = `${baseUrl}/policy/confirmClient.html`;

  const handleAccept = () => {
    onAccept();
    onClose();
  };

  return (
    <Modal
      title="Điều khoản và Điều kiện"
      open={visible}
      onCancel={onClose}
      width={1000}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy bỏ
        </Button>,

        <Button
          key="accept"
          type="primary"
          onClick={handleAccept}
          // disabled={!canAccept}
        >
          Tôi đồng ý
        </Button>,
      ]}
    >
      <div style={{ padding: "20px 0" }}>
        <p style={{ marginBottom: "16px", fontSize: "16px" }}>
          Để tiếp tục sử dụng dịch vụ, bạn cần đọc và đồng ý với:
        </p>

        <PDFViewer fileUrl={pdfLink} onReachEnd={() => setCanAccept(true)} />

        <div
          style={{
            backgroundColor: "#f6ffed",
            border: "1px solid #b7eb8f",
            borderRadius: "6px",
            padding: "12px",
            marginTop: "20px",
          }}
        >
          <p style={{ margin: 0, color: "#389e0d" }}>
            Bằng cách nhấp vào "Tôi đồng ý", bạn xác nhận rằng đã đọc, hiểu và
            đồng ý tuân thủ tất cả các điều khoản và điều kiện trên.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default TermAndConditionsModal;
