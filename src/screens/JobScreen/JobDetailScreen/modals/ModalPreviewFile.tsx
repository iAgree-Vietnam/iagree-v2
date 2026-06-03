
import { Modal } from "antd";

export type FilePreviewModalProps = {
  open: boolean;
  onClose?: () => void;
  fileUrl?: string;      // link file (pdf, docx, image)
  title?: string;
};

type FileType = "pdf" | "docx" | "image" | "other";

function getFileType(url?: string): FileType {
  if (!url) return "other";
  const ext = url.split(".").pop()?.toLowerCase();
  if (!ext) return "other";
  if (ext === "pdf") return "pdf";
  if (["png", "jpg", "jpeg", "webp", "gif"].includes(ext)) return "image";
  if (ext === "docx") return "docx";
  return "other";
}

const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  open,
  onClose,
  fileUrl,
  title,
}) => {
  const type = getFileType(fileUrl);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width="80%"
      style={{ top: 20 }}
      title={title || "Preview"}
    >
      <div style={{ height: "80vh" }}>
        {type === "pdf" && (
          <iframe
            src={fileUrl}
            title="PDF Preview"
            width="100%"
            height="100%"
            style={{ border: "none" }}
          />
        )}

        {type === "image" && (
          <img
            src={fileUrl}
            alt="preview"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        )}

        {type === "docx" && (
          <iframe
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
              fileUrl!
            )}`}
            title="DOCX Preview"
            width="100%"
            height="100%"
            style={{ border: "none" }}
          />
        )}

        {type === "other" && (
          <p>
            Không hỗ trợ preview loại file này.{" "}
            {fileUrl && <a href={fileUrl}>Tải về</a>}
          </p>
        )}
      </div>
    </Modal>
  );
};

export default FilePreviewModal;