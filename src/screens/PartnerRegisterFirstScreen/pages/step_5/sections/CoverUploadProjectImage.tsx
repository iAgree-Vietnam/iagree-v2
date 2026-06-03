// src/screens/PartnerScreen/uploads/CoverUploadImage.tsx

"use client";

import { useState, useEffect } from "react";
import { Upload, Button, Spin, Progress, message } from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import Constants from "@/src/constants/Constants";

interface CoverUploadProjectImageProps {
  value?: File;
  onChange?: (file: File | undefined) => void;
  disabled?: boolean;
}

interface CoverUploadProjectImageState {
  url?: string;
  status: "idle" | "uploading" | "done" | "error";
  progress: number;
  fileName?: string;
  fileSize?: number;
  file?: File;
}

export function CoverUploadProjectImage({
  value,
  onChange,
  disabled,
}: CoverUploadProjectImageProps) {
  const [imageState, setImageState] = useState<CoverUploadProjectImageState>(() => {
    return {
      url: value ? URL.createObjectURL(value) : undefined,
      status: value ? "done" : "idle",
      progress: 0,
      fileName: value?.name,
      fileSize: value?.size,
      file: value,
    };
  });

  // Effect to re-create blob URL and sync internal state with `value` prop
  useEffect(() => {
    // Check if the value prop has changed
    if (value !== imageState.file) {
      // Revoke old blob URL if it exists
      if (imageState.url && imageState.url.startsWith("blob:")) {
        URL.revokeObjectURL(imageState.url);
      }
      // Create new blob URL if a new file is provided
      const newUrl = value ? URL.createObjectURL(value) : undefined;

      setImageState({
        url: newUrl,
        status: value ? "done" : "idle",
        progress: 0,
        fileName: value?.name,
        fileSize: value?.size,
        file: value,
      });

      // Cleanup function to revoke the new URL when component unmounts
      // or when the effect re-runs
      return () => {
        if (newUrl && newUrl.startsWith("blob:")) {
          URL.revokeObjectURL(newUrl);
        }
      };
    }
  }, [value]); // Depend on `value` prop to re-run effect

  function formatFileSize(size: number) {
    if (size < 1024) return size + " B";
    else if (size < 1024 * 1024) return (size / 1024).toFixed(2) + " KB";
    else return (size / 1024 / 1024).toFixed(2) + " MB";
  }

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      message.error("Chỉ được phép tải lên hình ảnh!");
      return false;
    }

    const maxFileSize = Constants.MAX_FILE_SIZE;
    if (file.size > maxFileSize) {
      message.error(`Kích thước hình ảnh không được vượt quá ${maxFileSize / 1024 / 1024}MB!`);
      return false;
    }

    if (imageState.url && imageState.url.startsWith("blob:")) {
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
      for (let progress = 0; progress <= 90; progress += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        setImageState((prev) => ({ ...prev, progress }));
      }

      const fileUrl = URL.createObjectURL(file);

      setImageState({
        url: fileUrl,
        status: "done",
        progress: 100,
        fileName: file.name,
        fileSize: file.size,
        file: file,
      });
      onChange?.(file);
      message.success("Tải lên hình bìa thành công!");
    } catch (error) {
      setImageState({
        url: undefined,
        status: "error",
        progress: 0,
        file: undefined,
      });
      message.error("Lỗi khi tải lên hình bìa!");
    }

    return false;
  };

  const handleRemoveImage = () => {
    if (imageState.url && imageState.url.startsWith("blob:")) {
      URL.revokeObjectURL(imageState.url);
    }
    setImageState({
      url: undefined,
      status: "idle",
      progress: 0,
      file: undefined,
      fileName: undefined,
      fileSize: undefined,
    });
    onChange?.(undefined);
    message.success("Đã xóa ảnh bìa thành công!");
  };

  return (
    <div style={{ width: "100%" }}>
      {imageState.url || imageState.status.includes("uploading") ? (
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
          {imageState.status.includes("uploading") && (
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
              src={imageState.url}
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
              <Upload
                accept="image/*"
                beforeUpload={handleImageUpload}
                showUploadList={false}
                disabled={disabled || imageState.status.includes("uploading")}
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
          disabled={disabled}
        >
          <Button icon={<UploadOutlined />} size="middle" disabled={disabled}>
            {imageState.status.includes("uploading")
              ? "Đang tải lên..."
              : "Upload hình bìa"}
          </Button>
        </Upload>
      )}
    </div>
  );
}
