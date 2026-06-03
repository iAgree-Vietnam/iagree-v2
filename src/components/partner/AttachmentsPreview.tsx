import React, { useMemo, useState } from "react";
import { Image, Typography, Tooltip, Modal, Button } from "antd";
import { EyeOutlined, LinkOutlined } from "@ant-design/icons";
import { RawUserReviewAttachmentsResource } from "@/src/data/partner/models/partner.raw";
import StringUtils from "@/src/utils/StringUtils";

type AttachmentsPreviewProps = {
  attachments?: RawUserReviewAttachmentsResource[];
  imageSize?: number;
  maxNameWidth?: number;
};

const openInNewTab = (url: string) => {
  if (!url) return;
  window.open(url, "_blank", "noopener,noreferrer");
};

const AttachmentsPreview: React.FC<AttachmentsPreviewProps> = ({
  attachments = [],
  imageSize = 80,
  maxNameWidth = 180,
}) => {
  const [pdfPreview, setPdfPreview] = useState<{
    open: boolean;
    url: string;
    name: string;
  }>({ open: false, url: "", name: "" });

  const items = useMemo(() => attachments.filter(Boolean), [attachments]);

  if (!items.length) return null;

  return (
    <>
      <div style={{ marginTop: 16 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {items.map((a, idx) => {
            const key = a.id ?? idx;
            const name = a.file_name || "Untitled";
            const url = StringUtils.pickUrl(a);
            const ext = StringUtils.getExt(a.file_name || url);

            const canPreviewImage = StringUtils.isImageExt(ext);
            const canPreviewPdf = StringUtils.isPdfExt(ext);

            // 1) IMAGE: preview ngay bằng antd Image
            if (canPreviewImage) {
              return (
                <div key={key} style={{ position: "relative" }}>
                  <Image
                    src={url}
                    alt={name}
                    width={imageSize}
                    height={imageSize}
                    style={{
                      objectFit: "cover",
                      borderRadius: 6,
                      cursor: "pointer",
                    }}
                    preview={{ src: url }}
                  />
                </div>
              );
            }

            // 2) PDF: preview bằng modal + iframe
            if (canPreviewPdf) {
              return (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 12px",
                    border: "1px solid #d9d9d9",
                    borderRadius: 6,
                    backgroundColor: "#fafafa",
                    maxWidth: maxNameWidth + 90,
                    minWidth: 160,
                    gap: 8,
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    setPdfPreview({ open: true, url, name: name || "PDF" })
                  }
                >
                  <span style={{ fontSize: 16, lineHeight: 1 }}>
                    {StringUtils.getFileIcon(ext)}
                  </span>

                  <Tooltip title={name}>
                    <Typography.Text
                      ellipsis
                      style={{ fontSize: 12, flex: 1, maxWidth: maxNameWidth }}
                    >
                      {name}
                    </Typography.Text>
                  </Tooltip>

                  <Button
                    type="text"
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      setPdfPreview({ open: true, url, name });
                    }}
                  />
                  <Button
                    type="text"
                    size="small"
                    icon={<LinkOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      openInNewTab(url);
                    }}
                  />
                </div>
              );
            }

            // 3) Others (doc/docx/zip/...): không preview => click mở _blank
            return (
              <div
                key={key}
                onClick={() => openInNewTab(url)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "8px 12px",
                  border: "1px solid #d9d9d9",
                  borderRadius: 6,
                  backgroundColor: "#fafafa",
                  cursor: "pointer",
                  maxWidth: maxNameWidth + 90,
                  minWidth: 160,
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 16, lineHeight: 1 }}>
                  {StringUtils.getFileIcon(ext)}
                </span>

                <Tooltip title={name}>
                  <Typography.Text
                    ellipsis
                    style={{ fontSize: 12, flex: 1, maxWidth: maxNameWidth }}
                  >
                    {name}
                  </Typography.Text>
                </Tooltip>

                <Button
                  type="text"
                  size="small"
                  icon={<EyeOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    openInNewTab(url);
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <Modal
        open={pdfPreview.open}
        title={pdfPreview.name}
        onCancel={() => setPdfPreview({ open: false, url: "", name: "" })}
        footer={[
          <Button
            key="open"
            icon={<LinkOutlined />}
            onClick={() => openInNewTab(pdfPreview.url)}
          >
            Mở tab mới
          </Button>,
          <Button
            key="close"
            type="primary"
            onClick={() => setPdfPreview({ open: false, url: "", name: "" })}
          >
            Đóng
          </Button>,
        ]}
        width={900}
        style={{ top: 24 }}
        destroyOnClose
      >
        <div style={{ height: "70vh" }}>
          <iframe
            src={pdfPreview.url}
            title={pdfPreview.name}
            style={{ width: "100%", height: "100%", border: 0 }}
          />
        </div>
      </Modal>
    </>
  );
};

export default AttachmentsPreview;
