import React, { useState } from "react";
import { Typography, Image, Modal, Button, UploadFile } from "antd";
import {
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FileFilled,
  PlayCircleOutlined,
  DownloadOutlined,
  EyeOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const getFileIcon = (
  fileType: string | undefined | null,
  fontSize: number = 24
) => {
  if (!fileType) return <FileFilled style={{ fontSize, color: "#95a5a6" }} />;

  const typeLower = fileType.toLowerCase();
  if (typeLower.includes("pdf")) {
    return <FilePdfOutlined style={{ fontSize, color: "#e74c3c" }} />;
  } else if (typeLower.includes("word") || typeLower.includes("document")) {
    return <FileWordOutlined style={{ fontSize, color: "#2980b9" }} />;
  } else if (typeLower.includes("excel") || typeLower.includes("spreadsheet")) {
    return <FileExcelOutlined style={{ fontSize, color: "#27ae60" }} />;
  } else if (typeLower.startsWith("video/")) {
    return <PlayCircleOutlined style={{ fontSize, color: "#9b59b6" }} />;
  }
  return <FileFilled style={{ fontSize, color: "#95a5a6" }} />;
};

interface PreviewableFile extends UploadFile {
  uid: string;
  name: string;
  url?: string;
  type?: string;
  comment?: string;
  previewUrl?: string;
  duration?: number;
  thumbnailUrl?: string;
}

interface AttachmentDisplayCardProps {
  file: PreviewableFile;
}

const AttachmentDisplayCard: React.FC<AttachmentDisplayCardProps> = ({
  file,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalFile, setModalFile] = useState<PreviewableFile | null>(null);

  const displayUrl = file.previewUrl || file.url;

  const isDirectlyPreviewable = (currentFile: PreviewableFile) => {
    const type = currentFile.type?.toLowerCase();
    return (
      type?.startsWith("image/") ||
      type?.startsWith("video/") ||
      type === "application/pdf"
    );
  };

  const handleAction = (currentFile: PreviewableFile) => {
    if (!displayUrl) {
      Modal.warn({
        title: "Không có URL",
        content: "Không có URL file để thực hiện thao tác này.",
        okText: "Đóng",
      });
      return;
    }

    if (isDirectlyPreviewable(currentFile)) {
      if (
        currentFile.type?.startsWith("image/") ||
        currentFile.type?.startsWith("video/")
      ) {
        setModalFile(currentFile);
        setIsModalVisible(true);
      } else if (currentFile.type === "application/pdf") {
        window.open(displayUrl, "_blank");
      }
    } else {
      handleDownload(currentFile);
    }
  };

  const handleDownload = (currentFile: PreviewableFile) => {
    if (!displayUrl) {
      Modal.warn({
        title: "Không có URL",
        content: "Không có URL file để tải xuống.",
        okText: "Đóng",
      });
      return;
    }

    Modal.confirm({
      title: "Xác nhận tải xuống",
      content: `Bạn có muốn tải xuống tệp "${currentFile.name}" không?`,
      okText: "Tải xuống",
      cancelText: "Hủy",
      onOk() {
        const a = document.createElement("a");
        a.href = displayUrl;
        a.download = currentFile.name || "download";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      },
    });
  };

  const renderFileContentInModal = (currentFile: PreviewableFile | null) => {
    if (!currentFile || !displayUrl) {
      return (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Text type="secondary">Không có URL file để hiển thị.</Text>
        </div>
      );
    }

    const fileType = currentFile.type || "";

    if (fileType.startsWith("image/")) {
      return (
        <Image
          src={displayUrl}
          alt={currentFile.name}
          style={{
            maxWidth: "100%",
            height: "auto",
            display: "block",
            margin: "0 auto",
          }}
          preview={false}
        />
      );
    } else if (fileType.startsWith("video/")) {
      return (
        <div style={{ textAlign: "center" }}>
          <video controls width="100%" height="auto">
            <source src={displayUrl} type={currentFile.type} />
            Trình duyệt của bạn không hỗ trợ phát video.
          </video>
        </div>
      );
    } else if (fileType === "application/pdf") {
      return (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <div style={{ fontSize: "60px", marginBottom: "16px" }}>
            {getFileIcon(currentFile.type)}
          </div>
          <Text type="secondary">
            Tệp PDF sẽ mở trong tab mới.
            <br /> Để xem nội dung file "{currentFile.name}", vui lòng tải xuống
            hoặc mở trong tab mới.
          </Text>
        </div>
      );
    } else {
      return (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <div style={{ fontSize: "60px", marginBottom: "16px" }}>
            {getFileIcon(currentFile.type)}
          </div>
          <Text type="secondary">
            Để xem nội dung file "{currentFile.name}", vui lòng tải xuống.
          </Text>
        </div>
      );
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "4px 0",
          cursor: "pointer",
        }}
        onClick={() => handleAction(file)}
      >
        <div
          style={{
            width: 32,
            height: 32,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            flexShrink: 0,
            borderRadius: "4px",
            border: "1px solid #f0f0f0",
          }}
        >
          {file.type?.startsWith("image/") && displayUrl ? (
            <Image
              src={displayUrl}
              alt={file.name}
              width={32}
              height={32}
              style={{ objectFit: "cover" }}
              preview={false}
            />
          ) : (
            getFileIcon(file.type)
          )}
        </div>
        <Text>{file.name}</Text>
        {isDirectlyPreviewable(file) ? (
          <EyeOutlined style={{ marginLeft: "auto", color: "#1890ff" }} />
        ) : (
          <DownloadOutlined style={{ marginLeft: "auto", color: "#1890ff" }} />
        )}
      </div>

      <Modal
        title={modalFile?.name || "Chi tiết Tệp"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={modalFile?.type?.startsWith("video/") ? 800 : 520}
        footer={[
          <Button
            key="download"
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => modalFile && handleDownload(modalFile)}
          >
            Tải xuống
          </Button>,
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        destroyOnClose
      >
        {renderFileContentInModal(modalFile)}
        {modalFile?.comment && (
          <div
            style={{
              marginTop: "20px",
              paddingTop: "16px",
              borderTop: "1px dashed #eee",
            }}
          >
            <Typography.Paragraph>
              <Text strong>Chú thích:</Text>{" "}
              <div style={{ whiteSpace: "pre-wrap" }}>{modalFile.comment}</div>
            </Typography.Paragraph>
          </div>
        )}
      </Modal>
    </>
  );
};

export default AttachmentDisplayCard;
