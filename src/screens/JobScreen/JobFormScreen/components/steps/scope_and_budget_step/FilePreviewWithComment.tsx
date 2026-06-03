// File: src/components/FilePreviewWithComment.tsx (Không cần thay đổi nhiều)
import React, { useState } from "react";
import { Input, Button, Typography, Space, Form, Modal, Image } from "antd";
import {
  CloseCircleOutlined,
  EyeOutlined,
  DownloadOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { UploadFile } from "antd/lib/upload/interface";

import {
  formatDuration,
  formatFileSize,
  getFileIcon,
  getFileMainColor,
} from "../../../utils/JobAddFormUtils"; // Đảm bảo đường dẫn này đúng

const { Text } = Typography;
const { TextArea } = Input;

interface DeliverableAttachment extends UploadFile {
  comment?: string;
  thumbnailUrl?: string;
  duration?: number;
  previewUrl?: string;
}

interface FilePreviewWithCommentProps {
  file: DeliverableAttachment;
  onRemove: () => void;
  name: number;
  restField: any;
}

const FilePreviewWithComment: React.FC<FilePreviewWithCommentProps> = ({
  file,
  onRemove,
  name,
  restField,
}) => {
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  // Không cần previewFileInModal nếu chỉ preview 1 file tại 1 thời điểm
  // và file prop đã là đủ thông tin
  const COMMENT_MAX_LENGTH = 1000;

  const displayUrl = file.previewUrl || file.url;
  const isImage = file.type?.startsWith("image/");
  const isVideo = file.type?.startsWith("video/");

  const isDirectlyPreviewable = (currentFile: DeliverableAttachment) => {
    const type = currentFile.type?.toLowerCase();
    return (
      type?.startsWith("image/") ||
      type?.startsWith("video/") ||
      type === "application/pdf"
    );
  };

  const handlePreview = () => {
    if (!displayUrl) {
      Modal.warn({
        title: "Không có URL để xem trước",
        content:
          "Không có URL cho tệp này để xem trước. Vui lòng thử lại sau khi tệp được xử lý.",
        okText: "Đóng",
      });
      return;
    }

    if (isDirectlyPreviewable(file)) {
      if (isImage || isVideo) {
        // Chỉ cần mở modal, renderModalContent sẽ dùng file từ props
        setIsPreviewModalOpen(true);
      } else if (file.type === "application/pdf") {
        window.open(displayUrl, "_blank");
      }
    } else {
      handleDownload();
    }
  };

  const handleDownload = () => {
    if (!displayUrl) {
      Modal.warn({
        title: "Không có URL để tải xuống",
        content:
          "Không có URL cho tệp này để tải xuống. Vui lòng thử lại sau khi tệp được xử lý.",
        okText: "Đóng",
      });
      return;
    }

    Modal.confirm({
      title: "Xác nhận tải xuống",
      content: `Bạn có muốn tải xuống tệp "${file.name}" không?`,
      okText: "Tải xuống",
      cancelText: "Hủy",
      onOk() {
        const a = document.createElement("a");
        a.href = displayUrl;
        a.download = file.name || "download";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      },
    });
  };

  const renderModalContent = () => {
    // Luôn sử dụng 'file' prop trực tiếp trong renderModalContent
    // vì file là đối tượng đang được hiển thị bởi FilePreviewWithComment này
    if (!displayUrl) {
      return (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Text type="secondary">Không có URL file để hiển thị.</Text>
        </div>
      );
    }
    if (isImage) {
      return (
        <img
          alt="preview"
          style={{ width: "100%", display: "block", margin: "auto" }}
          src={displayUrl}
        />
      );
    }
    if (isVideo) {
      return (
        <video
          controls
          style={{ width: "100%", display: "block", margin: "auto" }}
          src={displayUrl}
        >
          Trình duyệt của bạn không hỗ trợ phát video.
        </video>
      );
    }
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <div style={{ fontSize: "60px", marginBottom: "16px" }}>
          {getFileIcon(file.type || "", 60)}
        </div>
        <Text type="secondary">
          Tệp "{file.name}" không thể xem trước trực tiếp tại đây. Vui lòng tải
          xuống.
        </Text>
      </div>
    );
  };

  return (
    <div
      key={file.uid}
      style={{
        display: "flex",
        marginBottom: 16,
        alignItems: "flex-start",
        width: "100%",
        gap: "12px",
        padding: "8px",
        border: "1px solid #e0e0e0",
        borderRadius: "6px",
        backgroundColor: "#fbfbfb",
        position: "relative",
      }}
    >
      <Button
        type="text"
        icon={
          <CloseCircleOutlined style={{ color: "white", fontSize: "18px" }} />
        }
        onClick={onRemove}
        danger
        size="small"
        style={{
          position: "absolute",
          top: -8,
          right: -8,
          backgroundColor: "#ff4d4f",
          border: "none",
          padding: 0,
          width: 24,
          height: 24,
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 10,
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        }}
        className="file-remove-button"
        aria-label={`Xóa tệp ${file.name}`}
      />

      <div
        className="file-thumbnail-container"
        style={{
          width: 80,
          height: 80,
          border: "1px solid #d9d9d9",
          borderRadius: 6,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          flexShrink: 0,
          backgroundColor: isImage
            ? "transparent"
            : getFileMainColor(file.type) + "1A",
        }}
      >
        {isImage && displayUrl ? (
          <Image
            src={displayUrl}
            alt={file.name}
            width={80}
            height={80}
            style={{ objectFit: "cover" }}
            preview={false}
          />
        ) : isVideo && file.thumbnailUrl ? ( // Chỉ hiển thị Image nếu CÓ thumbnailUrl
          <Image
            src={file.thumbnailUrl} // Sử dụng thumbnailUrl được truyền vào
            alt="Video Thumbnail"
            width={80}
            height={80}
            style={{ objectFit: "cover" }}
            preview={false}
          />
        ) : isVideo ? ( // Nếu là video nhưng KHÔNG CÓ thumbnailUrl
          <PlayCircleOutlined
            style={{
              fontSize: "40px",
              color: getFileMainColor(file.type),
            }}
          />
        ) : (
          getFileIcon(file.type || "", 40)
        )}
      </div>

      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Text
          strong
          ellipsis
          style={{ marginBottom: 4, fontSize: "1.05em" }}
          title={file.name}
        >
          {file.name}
        </Text>
        <Space
          size="small"
          style={{ marginBottom: 8, fontSize: "0.85em", color: "#8c8c8c" }}
        >
          {file.size ? (
            <Text type="secondary">{formatFileSize(file.size)}</Text>
          ) : (
            <Text type="secondary">N/A</Text>
          )}
          {isVideo && file.duration !== undefined && (
            <>
              <Text type="secondary">|</Text>
              <Text type="secondary">
                Thời lượng: {formatDuration(file.duration)}
              </Text>
            </>
          )}
        </Space>

        <Form.Item
          {...restField}
          name={[name, "comment"]}
          style={{ marginBottom: 8 }}
          rules={[
            {
              max: COMMENT_MAX_LENGTH,
              message: `Chú thích không được quá ${COMMENT_MAX_LENGTH} ký tự.`,
            },
          ]}
        >
          <TextArea
            placeholder="Chú thích (tùy chọn)"
            autoSize={{ minRows: 2, maxRows: 10 }}
            maxLength={COMMENT_MAX_LENGTH}
            showCount
            style={{ width: "100%" }}
            size="small"
          />
        </Form.Item>

        <Space size="small">
          {isDirectlyPreviewable(file) ? (
            <Button icon={<EyeOutlined />} onClick={handlePreview} size="small">
              Xem trước
            </Button>
          ) : (
            <Button
              icon={<DownloadOutlined />}
              onClick={handleDownload}
              size="small"
            >
              Tải xuống
            </Button>
          )}
        </Space>
      </div>

      <Modal
        title={file.name}
        open={isPreviewModalOpen}
        onCancel={() => setIsPreviewModalOpen(false)}
        footer={null}
        width={isVideo ? 800 : 520}
        destroyOnClose
      >
        {renderModalContent()}
      </Modal>
    </div>
  );
};

export default FilePreviewWithComment;
