"use client";

import { Modal, Button } from "antd";
import { Download } from "lucide-react";


interface ModalPreviewUrlProps {
  previewOpen: boolean;
  setPreviewOpen: (open: boolean) => void;
  previewUrl?: string;
  previewTitle?: string;
  getIcon?: (type: string, size?: number) => React.ReactNode;
  downloadUrl?: (url: string, name?: string) => void;
}

export const ModalPreviewUrl: React.FC<ModalPreviewUrlProps> = ({
  previewOpen,
  setPreviewOpen,
  previewUrl,
  previewTitle,
  getIcon,
  downloadUrl,
}) => {
  return (
    <Modal
      open={previewOpen}
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            width: "100%",
          }}
        >
          {getIcon && getIcon("image", 16)}
          <span>{previewTitle}</span>

          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            {!!previewUrl && (
              <>
                <Button
                  size="small"
                  type="primary"
                  onClick={() =>
                    window.open(previewUrl, "_blank", "noopener,noreferrer")
                  }
                >
                  Mở tab mới
                </Button>

                <Button
                  size="small"
                  icon={<Download size={14} />}
                  onClick={() => downloadUrl?.(previewUrl, previewTitle)}
                >
                  Tải xuống
                </Button>
              </>
            )}
          </div>
        </div>
      }
      onCancel={() => setPreviewOpen(false)}
      footer={null}
      width="70vw"
      styles={{ body: { padding: 0 } }}
    >
      <div
        style={{
          height: "50vh",
          background: "#00000008",
        }}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={previewTitle}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        ) : (
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#999",
            }}
          >
            Không có hình ảnh để hiển thị
          </div>
        )}
      </div>
    </Modal>
  );
};