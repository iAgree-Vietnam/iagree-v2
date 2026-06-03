"use client";

import type React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Typography, Button, Upload, message, Progress, Spin } from "antd";
import {
  FilePdfOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import type { RcFile } from "antd/lib/upload/interface";
import Constants from "@/src/constants/Constants";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import { FilePreviewModal } from "./FilePreviewModal";
import { useDetectDeviceV2 } from "@/src/hooks/useDetectDevice";

interface UploadedFile {
  uid: string;
  name: string;
  url: string;
  type: "image" | "document";
  fileType: string;
  size: number;
  statusUpload: "uploading" | "done" | "error";
  progress: number;
  projectIndex?: number;
  isApiFile?: boolean;
  apiFileId?: number;
}

interface ProjectItemStep5Props {
  value?: File[];
  onChange?: (files: File[]) => void;
}

const formatFileSize = (size: number) => {
  if (size === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(size) / Math.log(k));
  return Number.parseFloat((size / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const getFileType = (file: File): "image" | "document" => {
  const fileType = file.type || "";
  const fileName = file.name || "";

  if (fileType.startsWith("image/")) return "image";

  const extension = fileName.split(".").pop()?.toLowerCase();
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];

  if (imageExtensions.includes(extension || "")) return "image";

  return "document";
};

export const ProjectItemStep5: React.FC<ProjectItemStep5Props> = ({
  value = [],
  onChange,
}) => {
  const {isMobile,isDesktop} = useDetectDeviceV2();

  const [fileList, setFileList] = useState<File[]>(value);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [fileToPreview, setFileToPreview] = useState<UploadedFile | null>(null);

  const convertedFiles = useMemo(() => {
    return value.map((file, index) => {
      return {
        uid: `file-${index}-${file.name}-${file.size}`,
        name: file.name,
        url: URL.createObjectURL(file),
        type: getFileType(file),
        fileType: file.type,
        size: file.size,
        statusUpload: "done" as const,
        progress: 100,
        isApiFile: false,
      };
    });
  }, [value]);

  useEffect(() => {
    setUploadedFiles(convertedFiles);

    return () => {
      convertedFiles.forEach((file) => {
        URL.revokeObjectURL(file.url);
      });
    };
  }, [convertedFiles]);

  const handleBeforeUpload = useCallback(
    async (file: RcFile): Promise<boolean> => {
      const fileName = file.name.toLowerCase();
      const fileType = file.type.toLowerCase();
      const isImage =
        fileType.startsWith("image/") ||
        /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(fileName);
      const isPDF = fileType === "application/pdf" || fileName.endsWith(".pdf");

      if (!isImage && !isPDF) {
        message.error(
          `Chỉ được phép tải lên hình ảnh và file PDF. File ${file.name} không được hỗ trợ.`
        );
        return false;
      }

      const maxFileSize = Constants.MAX_FILE_SIZE;
      if (file.size > maxFileSize) {
        message.error(
          `Tệp ${file.name} vượt quá ${maxFileSize / 1024 / 1024}MB!`
        );
        return false;
      }

      const maxFileCount = Constants.MAX_FILE_COUNT;
      if (fileList.length >= maxFileCount) {
        message.error(`Bạn chỉ có thể tải lên tối đa ${maxFileCount} tệp!`);
        return false;
      }

      const isDuplicate =
        fileList.some((f) => f.name === file.name && f.size === file.size) ||
        uploadedFiles.some((f) => f.name === file.name && f.size === file.size);

      if (isDuplicate) {
        message.warning(`File ${file.name} đã tồn tại!`);
        return false;
      }

      const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const fileTypeCategory = getFileType(file as File);

      setIsUploading(true);

      const newFileForUI: UploadedFile = {
        uid: fileId,
        name: file.name,
        url: "",
        type: fileTypeCategory,
        fileType: file.type,
        size: file.size,
        statusUpload: "uploading",
        progress: 0,
        isApiFile: false,
      };

      setUploadedFiles((prev) => [...prev, newFileForUI]);

      try {
        await new Promise((resolve) => setTimeout(resolve, 50));
        for (let progress = 0; progress <= 90; progress += 10) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          setUploadedFiles((prev) =>
            prev.map((f) => (f.uid === fileId ? { ...f, progress } : f))
          );
        }

        const fileUrl = URL.createObjectURL(file);
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.uid === fileId
              ? {
                  ...f,
                  url: fileUrl,
                  statusUpload: "done",
                  progress: 100,
                }
              : f
          )
        );

        const newFileList = [...fileList, file as File];
        setFileList(newFileList);
        onChange?.(newFileList);
      } catch (error) {
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.uid === fileId
              ? {
                  ...f,
                  statusUpload: "error",
                  progress: 0,
                }
              : f
          )
        );
        message.error(`Lỗi khi tải ${file.name}`);
      } finally {
        setIsUploading(false);
      }

      return false;
    },
    [fileList, uploadedFiles, onChange]
  );

  const handleRemoveFile = useCallback(
    (uid: string) => {
      const fileToRemove = uploadedFiles.find((f) => f.uid === uid);
      if (!fileToRemove) return;

      setUploadedFiles((prev) => {
        const filtered = prev.filter((file) => file.uid !== uid);
        if (fileToRemove.url && !fileToRemove.isApiFile) {
          URL.revokeObjectURL(fileToRemove.url);
        }
        return filtered;
      });

      const newFileList = fileList.filter(
        (file) => file.name !== fileToRemove.name
      );
      setFileList(newFileList);
      onChange?.(newFileList);

      message.success("Đã xóa file thành công!");
    },
    [uploadedFiles, fileList, onChange]
  );

  // Hàm xử lý khi bấm nút preview
  const handlePreviewFile = useCallback((file: UploadedFile) => {
    setFileToPreview(file);
    setIsPreviewModalOpen(true);
  }, []);

  const renderFileItem = (file: UploadedFile, index: number) => {
    const isImage = file.type === "image";

    return (
      <div
        key={file.uid}
        style={{
          position: "relative",
          marginBottom: "16px",
          borderRadius: "10px",
          overflow: "hidden",
          border: "1px solid #d9d9d9",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          animation: `slideIn 0.5s ease-out ${index * 0.1}s both`,
          transition: "all 0.3s ease",
          backgroundColor: "#fff",
        }}
      >
        {file.statusUpload === "uploading" && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255,255,255,0.98)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 15,
              borderRadius: "10px",
              backdropFilter: "blur(2px)",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <Spin size="large" />
              <div
                style={{
                  marginTop: "16px",
                  fontSize: "14px",
                  color: "#999",
                }}
              >
                Đang tải lên...
              </div>
              <Progress
                percent={file.progress}
                size="small"
                style={{ width: "220px", marginTop: "12px" }}
                strokeColor={{ "0%": "#108ee9", "100%": "#87d068" }}
                showInfo={true}
              />
            </div>
          </div>
        )}

        <div
          style={{
            height: "220px",
            position: "relative",
            backgroundColor: "#f5f5f5",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          {isImage ? (
            <img
              src={file.url || "/placeholder.svg"}
              alt={file.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const fallbackDiv =
                  e.currentTarget.parentElement?.querySelector(
                    ".fallback-content"
                  );
                if (fallbackDiv)
                  (fallbackDiv as HTMLElement).style.display = "flex";
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                backgroundColor: "#b72f31ff",
                color: "white",
              }}
            >
              <FilePdfOutlined
                style={{ fontSize: "48px", marginBottom: "12px" }}
              />

              <div
                style={{
                  fontSize: "12px",
                  textAlign: "center",
                  padding: "0 12px",
                  opacity: 0.9,
                }}
              >
                {file.name.length > 100
                  ? file.name.substring(0, 20) + "..."
                  : file.name}
              </div>
            </div>
          )}

          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.1), transparent, rgba(0,0,0,0.7))",
              opacity: 0,
              transition: "opacity 0.3s ease",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "12px",
              zIndex: 5,
            }}
            className="image-overlay"
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "0";
            }}
          >
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              {file.isApiFile && (
                <div
                  style={{
                    backgroundColor: "rgba(24, 144, 255, 0.8)",
                    color: "white",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    fontSize: "11px",
                    fontWeight: "500",
                  }}
                >
                  Tệp đã tải lên
                </div>
              )}
              <div style={{ display: "flex", gap: "8px" }}>
                <Button
                  type="text"
                  icon={<EyeOutlined />}
                  onClick={() => handlePreviewFile(file)} // Thêm nút preview
                  style={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    color: "white",
                    border: "none",
                    backdropFilter: "blur(4px)",
                  }}
                />
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemoveFile(file.uid)}
                  style={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    color: "white",
                    border: "none",
                    backdropFilter: "blur(4px)",
                  }}
                />
              </div>
            </div>
            <div>
              <div
                style={{
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "4px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {file.name}
              </div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px" }}>
                {file.size > 0
                  ? formatFileSize(file.size)
                  : "Kích thước không xác định"}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Typography.Title level={5} style={{ marginBottom: 12 }}>
        Tài liệu hoặc hình ảnh liên quan của dự án
        <Typography.Text
          type="secondary"
          style={{
            color: "#8c8c8c",
            marginLeft: 3,
            fontSize: 13,
          }}
        >
          (tuỳ chọn)
        </Typography.Text>
      </Typography.Title>

      <div
        style={{
         ...(isDesktop ? { height: "600px"} : {}),
          border: "1px solid #d9d9d9",
          borderRadius: "10px",
          padding: "0 12px 0 12px",
        }}
      >
        <div
          style={{
            // maxHeight: "600px",
            ...(isDesktop ? { maxHeight: "600px"} : {}),
            overflowY: "auto",
            paddingRight: "8px",
          }}
        >
          <div style={{ height: "12px", width: "100%" }} />

          {uploadedFiles.map((file: UploadedFile, index: number) =>
            renderFileItem(file, index)
          )}

          <Upload
            multiple
            accept="image/*,.pdf"
            beforeUpload={handleBeforeUpload}
            showUploadList={false}
            style={{ width: "100%", display: "block" }}
            maxCount={5}
            disabled={isUploading || uploadedFiles.length >= 5}
          >
            <div
              className="upload-area"
              style={{
                borderRadius: "10px",
                padding: "24px 24px",
                border: "2px dashed #d9d9d9",
                minHeight: "80px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: isUploading ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                opacity: isUploading ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isUploading) e.currentTarget.style.borderColor = "#09993E";
              }}
              onMouseLeave={(e) => {
                if (!isUploading) e.currentTarget.style.borderColor = "#d9d9d9";
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "transform 0.3s ease",
                  }}
                >
                  <IconSvgLocal
                    name={"IC_ADD_IMAGE_OR_FILE"}
                    width={22}
                    height={22}
                    fill="transparent"
                  />
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "#999",
                    marginBottom: "3px",
                  }}
                >
                  {isUploading ? "Đang xử lý..." : "Thêm hình ảnh, tài liệu"}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#d9d9d9",
                    textAlign: "center",
                    lineHeight: "1.5",
                  }}
                >
                  (Hỗ trợ: Hình ảnh, PDF)
                  <br />
                  Kích thước tệp tối đa: 5MB
                </div>
              </div>
            </div>
          </Upload>

          <div style={{ height: "12px", width: "100%" }} />
        </div>
      </div>

      {/* Thêm modal xem trước vào đây */}
      {fileToPreview && (
        <FilePreviewModal
          isOpen={isPreviewModalOpen}
          onClose={() => setIsPreviewModalOpen(false)}
          file={fileToPreview}
        />
      )}

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .image-overlay {
          transition: opacity 0.3s ease;
        }
      `}</style>
    </>
  );
};
