"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Card, Skeleton, Typography, Modal } from "antd";
import {
  FilePdfOutlined,
  FileWordOutlined,
  FileOutlined,
} from "@ant-design/icons";
import useSWR from "swr";
import MessageServices, {
  AttachmentItem,
} from "@/src/data/message/services/MessageServices";
import { isEmpty } from "lodash";

const { Title, Text } = Typography;

interface Props {
  roomId: string;
  key: number;
}

export const SharedMediaGallery: React.FC<Props> = ({ roomId, key }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [previewTitle, setPreviewTitle] = useState<string>("");

  const { data, isLoading: loading } = useSWR(
    ["roomId", roomId, key],
    async () => {
      return roomId
        ? new MessageServices().getListFile(roomId, {
            per_page: 150,
          })
        : undefined;
    },
    { revalidateOnFocus: false }
  );

  const imageExts = ["png", "jpg", "jpeg", "gif", "webp"];
  const videoExts = ["mp4", "mov", "avi", "webm"];

  const isImage = (name: string) =>
    imageExts.some((ext) => name.toLowerCase().endsWith(ext));
  const isVideo = (name: string) =>
    videoExts.some((ext) => name.toLowerCase().endsWith(ext));

  // --- GROUP FILES BY DATE ---
  const groupedFiles = useMemo(() => {
    const map = new Map<string, AttachmentItem[]>();
    data?.data?.attachments?.forEach((f: AttachmentItem) => {
      const date = new Date(f.created_at).toISOString().split("T")[0]; // yyyy-mm-dd
      if (!map.has(date)) map.set(date, []);
      map.get(date)!.push(f);
    });

    return Array.from(map.entries())
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .map(([date, items]) => ({ date, items }));
  }, [JSON.stringify(data?.data?.attachments)]);

  const handlePreview = (file: AttachmentItem) => {
    setPreviewUrl(file.file_path);
    setPreviewTitle(file.file_name_original);
    setPreviewOpen(true);
  };

  const getDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const diff =
      (today.setHours(0, 0, 0, 0) - date.setHours(0, 0, 0, 0)) / 86400000;

    if (diff === 0) return "Hôm nay";
    if (diff === 1) return "Hôm qua";
    return new Date(dateStr).toLocaleDateString("vi-VN");
  };

  /** 🧩 Lock scroll khi mở modal */
  useEffect(() => {
    if (previewOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // cleanup khi component unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [previewOpen]);

  return !isEmpty(data?.data?.attachments) ? (
    <div
      className="listFile"
      style={{ background: "#fff", borderRadius: 8, padding: 16 }}
    >
      <Title level={5}>Hình ảnh / Videos / Tệp tin</Title>

      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : (
        groupedFiles.map(({ date, items }) => {
          const media = items.filter(
            (f) =>
              isImage(f.file_name_original) || isVideo(f.file_name_original)
          );
          const docs = items.filter(
            (f) =>
              !isImage(f.file_name_original) && !isVideo(f.file_name_original)
          );

          return (
            <div key={date} style={{ marginBottom: 24 }}>
              <Title level={5} style={{ marginBottom: 12 }}>
                {getDateLabel(date)}
              </Title>

              {/* --- MEDIA --- */}
              {media.length > 0 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(120px, 1fr))",
                    gap: 8,
                    marginBottom: 16,
                  }}
                >
                  {media.map((f) => (
                    <Card
                      key={f.id + f.file_path}
                      hoverable
                      style={{ overflow: "hidden", borderRadius: 6 }}
                      bodyStyle={{ padding: 0 }}
                      onClick={() => handlePreview(f)}
                      cover={
                        isImage(f.file_name_original) ? (
                          <img
                            src={f.file_path}
                            alt={f.file_name_original}
                            style={{
                              width: "100%",
                              height: 120,
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <video
                            src={f.file_path}
                            style={{
                              width: "100%",
                              height: 120,
                              objectFit: "cover",
                            }}
                            muted
                          />
                        )
                      }
                    />
                  ))}
                </div>
              )}

              {/* --- DOC FILES --- */}
              {docs.length > 0 && (
                <div>
                  {docs.map((f) => {
                    const isPdf = f.file_name_original
                      .toLowerCase()
                      .endsWith(".pdf");
                    const isDoc = f.file_name_original
                      .toLowerCase()
                      .endsWith(".docx");
                    const Icon = isPdf
                      ? FilePdfOutlined
                      : isDoc
                      ? FileWordOutlined
                      : FileOutlined;
                    return (
                      <div
                        key={f.id + f.file_path}
                        onClick={() =>
                          window.open(
                            f.file_path,
                            "_blank",
                            "noopener,noreferrer"
                          )
                        }
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          borderBottom: "1px solid #f0f0f0",
                          padding: "8px 0",
                          cursor: "pointer",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <Icon
                            style={{
                              fontSize: 20,
                              color: isPdf ? "#f5222d" : "#1677ff",
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: 500 }}>
                              {f.file_name_original.length > 36
                                ? f.file_name_original.slice(0, 36) + "..."
                                : f.file_name_original}
                            </div>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              {new Date(f.created_at).toLocaleTimeString(
                                "vi-VN",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </Text>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })
      )}

      {/* Modal preview */}
      <Modal
        open={previewOpen}
        onCancel={() => setPreviewOpen(false)}
        title={previewTitle}
        width="70vw"
        footer={null}
        styles={{ body: { padding: 0 } }}
        maskClosable={true}
      >
        {isImage(previewTitle) ? (
          <img
            src={previewUrl}
            alt={previewTitle}
            style={{ width: "100%", height: "70vh", objectFit: "contain" }}
          />
        ) : isVideo(previewTitle) ? (
          <video
            src={previewUrl}
            controls
            style={{ width: "100%", height: "70vh", objectFit: "contain" }}
          />
        ) : null}
      </Modal>
    </div>
  ) : (
    <></>
  );
};
