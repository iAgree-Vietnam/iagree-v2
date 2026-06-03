"use client";

import { useState, useEffect } from "react";
import { Upload, Button, Spin, Progress, message } from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useDeleteImageOfTypicalProjects } from "../hooks/useDeleteImageOfTypicalProjects";
import Constants from "@/src/constants/Constants";

interface CoverUploadImageProps {
  value?: string;
  onChange?: (url: string | undefined, file?: File) => void;
  disabled?: boolean;
  projectId?: number;
}

interface CoverImageState {
  url?: string;
  status: "idle" | "uploading" | "done" | "error";
  progress: number;
  fileName?: string;
  fileSize?: number;
  file?: File;
}

export function CoverUploadImage({
  value,
  onChange,
  disabled,
  projectId
}: CoverUploadImageProps) {
  const [imageState, setImageState] = useState<CoverImageState>({
    url: value,
    status: "idle",
    progress: 0,
  });

  function formatFileSize(size: number) {
    if (size < 1024) return size + " B";
    else if (size < 1024 * 1024) return (size / 1024).toFixed(2) + " KB";
    else return (size / 1024 / 1024).toFixed(2) + " MB";
  }

  // Update state when value prop changes
  useEffect(() => {
    if (imageState.url && (imageState.file?.name.startsWith('blob:'))) {
      setImageState((prev) => ({
        ...prev,
        url: value,
        status: value ? "done" : "idle",
        file: undefined, // Clear file when setting external URL
      }));
    }
  }, [value, imageState.url]);

  // Cleanup function to revoke object URLs
  useEffect(() => {
    return () => {
      if (imageState.url && imageState.url.startsWith('blob:')) {
        URL.revokeObjectURL(imageState.url);
      }
    };
  }, []);

  const handleImageUpload = async (file: File) => {
    // Kiểm tra loại file
    if (!file.type.startsWith("image/")) {
      message.error("Chỉ được phép tải lên hình ảnh!");
      return false;
    }

    // Kiểm tra kích thước file
    const maxFileSize = Constants.MAX_FILE_SIZE;
    if (file.size > maxFileSize) {
      message.error(`Tệp ${file.name} vượt quá ${maxFileSize / 1024 / 1024}MB!`);
      return false;
    }

    // Revoke previous object URL if exists
    if (imageState.url && imageState.url.startsWith('blob:')) {
      URL.revokeObjectURL(imageState.url);
    }

    setImageState({
      url: undefined,
      status: "uploading",
      progress: 0,
      fileName: file.name,
      fileSize: file.size,
      file: file,
    });

    try {
      // Simulate upload progress
      for (let progress = 0; progress <= 90; progress += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        setImageState((prev) => ({ ...prev, progress }));
      }

      // Tạo URL cho file
      const fileUrl = URL.createObjectURL(file);

      setImageState({
        url: fileUrl,
        status: "done",
        progress: 100,
        fileName: file.name,
        fileSize: file.size,
        file: file
      });

      // onChange?.(fileUrl);
      onChange?.(fileUrl, file);
      // message.success("Tải lên hình bìa thành công!");
    } catch (error) {
      setImageState({ 
        url: undefined, 
        status: "error", 
        progress: 0,
        file: undefined
      });
      message.error("Lỗi khi tải lên hình bìa!");
    }

    return false;
  };

  const deleteImage = useDeleteImageOfTypicalProjects(projectId!);
  const handleRemoveImage = () => {
    if (imageState.url && imageState.url.startsWith('blob:')) {
      URL.revokeObjectURL(imageState.url);
    }
    setImageState({ 
      url: undefined, 
      status: "idle", 
      progress: 0,
      file: undefined
    });
    onChange?.(undefined, undefined);

    if (projectId) {
      deleteImage.mutateAsync();
    }
    // message.success("Đã xóa ảnh bìa thành công!");
  };

  return (
    <div style={{ width: "100%" }}>
      {imageState.url || imageState.status === "uploading" ? (
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "200px",
            borderRadius: "8px",
            overflow: "hidden",
            border: "1px solid #f0f0f0",
            backgroundColor: "#f5f5f5",
          }}
        >
          {/* Loading overlay */}
          {imageState.status === "uploading" && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(255,255,255,0.95)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
              }}
            >
              <div style={{ textAlign: "center" }}>
                <Spin size="large" />
                <div
                  style={{
                    marginTop: "12px",
                    fontSize: "14px",
                    color: "#666",
                    fontWeight: "500",
                  }}
                >
                  Đang tải lên hình bìa...
                </div>
                <Progress
                  percent={imageState.progress}
                  size="small"
                  style={{
                    width: "200px",
                    marginTop: "8px",
                  }}
                  strokeColor={{
                    "0%": "#108ee9",
                    "100%": "#87d068",
                  }}
                />
              </div>
            </div>
          )}

          {imageState.url && (
            <img
              src={imageState.url || "/placeholder.svg"}
              alt="Cover"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                target.parentElement!.innerHTML = `
                  <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; flex-direction: column; color: #999;">
                    <div style="font-size: 48px; margin-bottom: 12px;">🖼️</div>
                    <div>Không thể tải hình ảnh</div>
                  </div>
                `;
              }}
            />
          )}

          {/* Overlay với actions - LUÔN hiển thị khi có ảnh */}
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
              transition: "opacity 0.2s ease",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "12px",
            }}
            className="image-overlay"
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "0";
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
              }}
            >
              {/* Nút thay đổi ảnh */}
              <Upload
                accept="image/*"
                beforeUpload={handleImageUpload}
                showUploadList={false}
                disabled={disabled || imageState.status === "uploading"}
              >
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  style={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    color: "white",
                    border: "none",
                    backdropFilter: "blur(4px)",
                  }}
                />
              </Upload>

              {/* Nút xóa ảnh */}
              <Button
                type="text"
                icon={<DeleteOutlined />}
                onClick={handleRemoveImage}
                style={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  color: "white",
                  border: "none",
                  backdropFilter: "blur(4px)",
                }}
              />
            </div>

            <div>
              {imageState.fileName && imageState.fileSize && (
                <>
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
                    {imageState.fileName}
                  </div>
                  <div
                    style={{
                      color: "rgba(255,255,255,0.8)",
                      fontSize: "12px",
                    }}
                  >
                    {formatFileSize(imageState.fileSize)}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <Upload
          accept="image/*"
          beforeUpload={handleImageUpload}
          showUploadList={false}
          disabled={disabled || imageState.status.includes("uploading")}
        >
          <Button
            icon={<UploadOutlined />}
            size="middle"
            disabled={disabled || imageState.status.includes("uploading")}
          >
            {imageState.status.includes("uploading")
              ? "Đang tải lên..."
              : "Upload hình bìa"}
          </Button>
        </Upload>
      )}
    </div>
  );
}
