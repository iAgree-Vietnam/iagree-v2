
import { Modal } from "antd";

interface PreviewFile {
  name: string;
  url: string;
  type: "image" | "document";
}

interface FilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: PreviewFile;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  isOpen,
  onClose,
  file,
}) => {
  if (!file) return null;

  const isImage = file.type === "image";

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null} // Ẩn footer mặc định của Modal
      centered
      width={isImage ? "auto" : "90%"} // Tối ưu kích thước modal
      style={{ top: 20 }}
      maskClosable={true}
      title={file.name}
    >
      <div style={{ padding: "16px 0", maxHeight: "80vh", overflow: "hidden" }}>
        {isImage ? (
          <img
            src={file.url}
            alt={file.name}
            style={{
              maxWidth: "100%",
              maxHeight: "80vh",
              display: "block",
              margin: "0 auto",
            }}
          />
        ) : (
          <iframe
            src={file.url}
            title={file.name}
            style={{ width: "100%", height: "70vh", border: "none" }}
          />
        )}
      </div>
    </Modal>
  );
};
