import React, { useRef, useState, useEffect } from "react";
import { Modal, Button, Spin } from "antd";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import dynamic from "next/dynamic";
import Constants from "@/src/constants/Constants";

const PDFViewer = dynamic(
  async () => {
    const { Document, Page, pdfjs } = await import("react-pdf");
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

    return function PDFViewerComponent({
      fileUrl,
      onReachEnd,
    }: {
      fileUrl: string;
      onReachEnd: () => void;
    }) {
      const [numPages, setNumPages] = useState(0);
      const [loading, setLoading] = useState(true);
      const scrollRef = useRef<HTMLDivElement>(null);

      const handleScroll = () => {
        const div = scrollRef.current;
        if (div) {
          const { scrollTop, scrollHeight, clientHeight } = div;
          if (scrollTop + clientHeight >= scrollHeight - 10) {
            onReachEnd();
          }
        }
      };

      return (
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          style={{
            height: "500px",
            overflowY: "auto",
            border: "1px solid #d9d9d9",
            padding: "8px",
          }}
        >
          {loading && (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <Spin />
            </div>
          )}
          <Document
            file={fileUrl}
            onLoadSuccess={({ numPages }) => {
              setNumPages(numPages);
              setLoading(false);
            }}
            loading=""
          >
            {Array.from(new Array(numPages), (_, index) => (
              <Page key={`page_${index + 1}`} pageNumber={index + 1} width={940} />
            ))}
          </Document>
        </div>
      );
    };
  },
  { ssr: false }
);

// Required worker file for react-pdf
// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

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
    const pdfLink = `${baseUrl}/policy/dieu_khoan_su_dung_nen_tang.pdf`;

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
                <Button 
                    key="cancel"
                    onClick={onClose}
                >
                    Đóng
                </Button>,

                <Button 
                    key="accept" 
                    type="primary" 
                    onClick={handleAccept} 
                    disabled={!canAccept}
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
                        marginTop: "20px"
                    }}
                >
                    <p style={{ margin: 0, color: "#389e0d" }}>
                        Bằng cách nhấp vào "Tôi đồng ý", bạn xác nhận rằng đã đọc, hiểu và đồng ý tuân thủ tất cả các điều khoản và điều kiện trên.
                    </p>
                </div>
            </div>
        </Modal>
    );
};

export default TermAndConditionsModal;