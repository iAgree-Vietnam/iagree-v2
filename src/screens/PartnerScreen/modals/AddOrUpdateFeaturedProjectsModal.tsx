"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Row,
  Col,
  Button,
  Upload,
  message,
  Progress,
  Spin,
  Typography,
} from "antd";
import {
  DownloadOutlined,
  FileOutlined,
  DeleteOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FilePptOutlined,
  FileTextOutlined,
  PlayCircleOutlined,
  FileZipOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import { CoverUploadImage } from "../uploads/CoverUploadImage";
import AppDatePicker from "@/src/components/date/DatePicker";
import datetimeUtils from "@/src/utils/DatetimeUtils";
import { FeaturedProjectUploadItem, UploadedFile } from "@/src/data/typical-projects/models/typicalProjects.types";

const { TextArea } = Input;

interface AddOrUpdateFeaturedProjectsModalProps {
  visible: boolean;
  editingProject: FeaturedProjectUploadItem | null;
  form: any;
  onCancel: () => void;
  onSubmit: (values: any, uploadedFiles: UploadedFile[]) => void;
}



export function AddOrUpdateFeaturedProjectsModal({
  visible,
  editingProject,
  form,
  onCancel,
  onSubmit,
}: AddOrUpdateFeaturedProjectsModalProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [coverImage, setCoverImage] = useState<string | undefined>();

  // Thêm hàm trung gian để gọi onSubmit với 2 tham số
  const onFinishHandler = (values: any) => {
    onSubmit(values, uploadedFiles);
  };

  // Hàm kiểm tra file có thể preview không
  const canPreview = (fileName: string, fileType: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    const previewableImageExtensions = [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "bmp",
      "webp",
      "svg",
    ];
    const previewableVideoExtensions = [
      "mp4",
      "avi",
      "mov",
      "wmv",
      "flv",
      "webm",
      "mkv",
    ];
    const previewableDocumentExtensions = ["pdf"];

    if (
      fileType.startsWith("image/") &&
      previewableImageExtensions.includes(extension || "")
    )
      return true;
    if (
      fileType.startsWith("video/") &&
      previewableVideoExtensions.includes(extension || "")
    )
      return true;
    if (previewableDocumentExtensions.includes(extension || "")) return true;

    return false;
  };

  useEffect(() => {
    if (visible) {
      setCoverImage(editingProject?.image);
      setUploadedFiles(editingProject?.filesUploaded ?? []);
      form.setFieldsValue({
        image: editingProject?.image,
      });
      setIsUploading(false);
    } else {
      setCoverImage(undefined);
      setUploadedFiles([]);
      form.resetFields();
      setIsUploading(false);
    }
  }, [visible, editingProject]);

  const handleCoverImageChange = (url: string | undefined) => {
    setCoverImage(url);
    form.setFieldsValue({ image: url });
  };

  // Hàm xác định loại file
  const getFileType = (file: File): "image" | "video" | "document" => {
    const fileType = file.type || "";
    const fileName = file.name || "";

    if (fileType.startsWith("image/")) return "image";
    if (fileType.startsWith("video/")) return "video";

    const extension = fileName.split(".").pop()?.toLowerCase();
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
    const videoExtensions = ["mp4", "avi", "mov", "wmv", "flv", "webm", "mkv"];

    if (imageExtensions.includes(extension || "")) return "image";
    if (videoExtensions.includes(extension || "")) return "video";

    return "document";
  };

  // Hàm xác định icon file
  const getFileIcon = (fileName: string, fileType: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    const iconStyle = { fontSize: "22px", color: "#1890ff" };

    if (fileType?.startsWith("video/")) {
      return <PlayCircleOutlined style={{ ...iconStyle, color: "#ff4d4f" }} />;
    }

    switch (extension) {
      case "pdf":
        return <FilePdfOutlined style={{ ...iconStyle, color: "#ff4d4f" }} />;
      case "doc":
      case "docx":
        return <FileWordOutlined style={{ ...iconStyle, color: "#1890ff" }} />;
      case "xls":
      case "xlsx":
        return <FileExcelOutlined style={{ ...iconStyle, color: "#52c41a" }} />;
      case "ppt":
      case "pptx":
        return <FilePptOutlined style={{ ...iconStyle, color: "#fa8c16" }} />;
      case "txt":
        return <FileTextOutlined style={{ ...iconStyle, color: "#666" }} />;
      case "zip":
      case "rar":
        return <FileZipOutlined style={{ ...iconStyle, color: "#722ed1" }} />;
      default:
        return <FileOutlined style={{ ...iconStyle, color: "#666" }} />;
    }
  };

  // Hàm xử lý upload file
  const handleFileUpload = async (file: File) => {
    const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const fileType = getFileType(file);

    // Kiểm tra kích thước file
    if (file.size / 1024 / 1024 > 10) {
      message.error(`File ${file.name} vượt quá 10MB!`);
      return false;
    }

    // Kiểm tra duplicate
    const isDuplicate = uploadedFiles.some(
      (f) => f.name === file.name && f.size === file.size
    );

    if (isDuplicate) {
      message.warning(`File ${file.name} đã tồn tại!`);
      return false;
    }

    // Thêm file với status uploading
    const newFile: UploadedFile = {
      uid: fileId,
      name: file.name,
      url: "",
      type: fileType,
      fileType: file.type,
      size: file.size,
      statusUpload: "uploading",
      progress: 0,
    };

    setUploadedFiles((prev) => [...prev, newFile]);
    setIsUploading(true);

    try {
      // Simulate upload progress
      for (let progress = 0; progress <= 90; progress += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        setUploadedFiles((prev) =>
          prev.map((f) => (f.uid === fileId ? { ...f, progress } : f))
        );
      }

      // Tạo URL cho file
      const fileUrl = URL.createObjectURL(file);

      // Hoàn thành upload
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.uid === fileId
            ? { ...f, url: fileUrl, statusUpload: "done", progress: 100 }
            : f
        )
      );

      message.success(`Tải lên ${file.name} thành công!`);
    } catch (error) {
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.uid === fileId ? { ...f, statusUpload: "error", progress: 0 } : f
        )
      );
      message.error(`Lỗi khi tải ${file.name}`);
    } finally {
      setIsUploading(false);
    }

    return false; // Prevent default upload
  };

  // Hàm xóa file
  const handleRemoveFile = (uid: string) => {
    setUploadedFiles((prev) => {
      const fileToRemove = prev.find((f) => f.uid === uid);
      if (fileToRemove?.url) {
        URL.revokeObjectURL(fileToRemove.url);
      }
      return prev.filter((file) => file.uid !== uid);
    });
    message.success("Đã xóa file thành công!");
  };

  // Hàm format kích thước file
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  // Component hiển thị file
  const renderFileItem = (file: UploadedFile, index: number) => (
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
      {/* Loading overlay */}
      {file.statusUpload === "uploading" && (
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255,255,255,0.95)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            borderRadius: "10px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <Spin size="default" />
            <div
              style={{
                marginTop: "12px",
                fontSize: "13px",
                color: "#666",
                fontWeight: "500",
              }}
            >
              Đang tải lên...
            </div>
            <Progress
              percent={file.progress}
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

      {file.type === "image" ? (
        // Hiển thị hình ảnh
        <div
          style={{
            height: "220px",
            position: "relative",
            backgroundColor: "#f5f5f5",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
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
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              target.parentElement!.innerHTML = `
                <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; flex-direction: column; color: #999;">
                  <FileImageOutlined style="font-size: 48px; margin-bottom: 12px;" />
                  <div>Không thể tải hình ảnh</div>
                </div>
              `;
            }}
          />

          {/* Overlay với actions */}
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
              {/* Nút xóa ảnh */}
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
              <div
                style={{
                  color: "rgba(255,255,255,0.8)",
                  fontSize: "12px",
                }}
              >
                {formatFileSize(file.size)}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Hiển thị file/video
        <div
          style={{
            height: "90px",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            marginBottom: "0",
            borderRadius: "12px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            backgroundColor: "#fff",
            transition: "box-shadow 0.3s ease",
            cursor: "default",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0 4px 20px rgba(0,0,0,0.15)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0 2px 10px rgba(0,0,0,0.08)";
          }}
        >
          {/* Icon file/video */}
          <div
            style={{
              flexShrink: 0,
              width: 48,
              height: 48,
              borderRadius: 8,
              backgroundColor: "#f0f5ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 16,
              color: "#2f54eb",
              fontSize: 28,
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            }}
          >
            {getFileIcon(file.name, file.fileType)}
          </div>

          {/* Thông tin file */}
          <div
            style={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                fontWeight: 600,
                fontSize: 15,
                lineHeight: 1.2,
                color: "#141414",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={file.name}
            >
              {file.name}
            </div>
            <div
              style={{
                fontSize: 13,
                color: "#8c8c8c",
                marginTop: 4,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span>{formatFileSize(file.size)}</span>
              <span
                style={{
                  backgroundColor: "#f0f0f0",
                  color: "#595959",
                  fontSize: 11,
                  borderRadius: 6,
                  padding: "2px 8px",
                  userSelect: "none",
                }}
              >
                {file.type === "video"
                  ? "Video"
                  : file.name.split(".").pop()?.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginLeft: 12,
            }}
          >
            {/* Preview hoặc download */}
            {canPreview(file.name, file.fileType) ? (
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={() => window.open(file.url, "_blank")}
                style={{
                  color: "#389e0d",
                  fontSize: 18,
                  padding: 6,
                  borderRadius: 8,
                }}
                title="Xem trước"
              />
            ) : (
              <Button
                type="text"
                icon={<DownloadOutlined />}
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = file.url;
                  link.download = file.name;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                style={{
                  color: "#096dd9",
                  fontSize: 18,
                  padding: 6,
                  borderRadius: 8,
                }}
                title="Tải xuống"
              />
            )}

            {/* Xóa file */}
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => handleRemoveFile(file.uid)}
              style={{
                color: "#cf1322",
                fontSize: 18,
                padding: 6,
                borderRadius: 8,
              }}
              title="Xóa file"
            />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
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

      <Modal
        title={editingProject ? "Chỉnh sửa dự án" : "Thêm dự án mới"}
        open={visible}
        onCancel={onCancel}
        footer={null}
        width={1000}
        style={{ top: 20 }}
      >
        <Form
          name={'typicalProjects'}
          form={form}
          layout="vertical"
          onFinish={onFinishHandler}
          scrollToFirstError
        >
          <Row gutter={32}>
            {/* Left Column - Form Fields */}
            <Col xs={24} lg={10}>
              <Form.Item
                label="Tên dự án"
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập tên dự án" }]}
              >
                <Input
                  placeholder="Nhập tên dự án"
                  size="large"
                  style={{ borderRadius: "10px" }}
                />
              </Form.Item>

              <Form.Item
                label="Vai trò trong dự án"
                name="role"
                rules={[{ required: true, message: "Vui lòng nhập vai trò trong dự án" }]}
              >
                <Input
                  placeholder="Nhập vai trò trong dự án"
                  size="large"
                  style={{ borderRadius: "10px" }}
                />
              </Form.Item>

              <Form.Item
                name={'start_date'}
                label={'Thời gian bắt đầu'}
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập thời gian bắt đầu',
                  },
                ]}
                getValueProps={(value) => ({
                  value:
                    value &&
                    datetimeUtils.getMoment(
                      value,
                      datetimeUtils.BACKEND_DATE_TIME
                    ),
                })}
                normalize={(value) =>
                  (value &&
                    value.format(datetimeUtils.BACKEND_DATE_TIME)) ||
                  ''
                }
              >
                <AppDatePicker
                  className={'full-width'}
                  format={'MM/YYYY'}
                  picker="month"
                  placeholder={'mm/yyyy'}
                />
              </Form.Item>

              <Form.Item
                name={'end_date'}
                label={'Thời gian kết thúc'}
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập thời gian kết thúc',
                  },
                ]}
                getValueProps={(value) => ({
                  value:
                    value &&
                    datetimeUtils.getMoment(
                      value,
                      datetimeUtils.BACKEND_DATE_TIME
                    ),
                })}
                normalize={(value) =>
                  (value &&
                    value.format(datetimeUtils.BACKEND_DATE_TIME)) ||
                  ''
                }
              >
                <AppDatePicker
                  className={'full-width'}
                  format={'MM/YYYY'}
                  picker="month"
                  placeholder={'mm/yyyy'}
                />
              </Form.Item>

              <Form.Item
                label="Mô tả"
                name="description"
                rules={[
                  { required: true, message: "Vui lòng nhập mô tả dự án" },
                ]}
              >
                <TextArea
                  rows={5}
                  placeholder="Nhập mô tả dự án..."
                  style={{
                    borderRadius: "10px",
                    resize: "none",
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Thành tựu nổi bật"
                name="achievements"
              >
                <TextArea
                  rows={5}
                  placeholder="Nhập thành tựu nổi bật..."
                  style={{
                    borderRadius: "10px",
                    resize: "none",
                  }}
                />
              </Form.Item>
            </Col>

            {/* Right Column - File Upload Area */}
            <Col xs={24} lg={14}>
              <Form.Item
                label="Hình bìa"
                name="image"
                rules={[
                  { required: true, message: "Vui lòng chọn hình bìa dự án" },
                ]}
              >
                <CoverUploadImage value={coverImage} onChange={handleCoverImageChange} />
              </Form.Item>
              <div
                style={{
                  padding: "12px 0",
                }}
              >
                <Typography.Title level={5} style={{ margin: 0 }}>
                  Tổng số tệp: {uploadedFiles.length}
                </Typography.Title>
              </div>
              <div
                style={{
                  height: "600px",
                  border: "1px solid #d9d9d9",
                  borderRadius: "10px",
                  padding: "0 12px 0 12px",
                }}
              >
                <div
                  style={{
                    maxHeight: "600px",
                    overflowY: "auto",
                    paddingRight: "8px",
                  }}
                >
                  <div style={{ height: "12px", width: "100%" }} />
                  {/* Render uploaded files */}
                  {uploadedFiles.map((file, index) =>
                    renderFileItem(file, index)
                  )}

                  {/* Upload area */}
                  <Upload
                    name="projectFiles"
                    multiple
                    accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar"
                    beforeUpload={handleFileUpload}
                    showUploadList={false}
                    style={{ width: "100%", display: "block" }}
                    disabled={isUploading}
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
                        if (!isUploading) {
                          e.currentTarget.style.borderColor = "#09993E";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isUploading) {
                          e.currentTarget.style.borderColor = "#d9d9d9";
                        }
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
                          {isUploading
                            ? "Đang xử lý..."
                            : "Thêm hình ảnh, tài liệu"}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#d9d9d9",
                            textAlign: "center",
                            lineHeight: "1.5",
                          }}
                        >
                          (Hỗ trợ: Hình ảnh, Video, PDF, Word, Excel,
                          PowerPoint, TXT, ZIP)
                          <br />
                          Kích thước tối đa: 10MB
                        </div>
                      </div>
                    </div>
                  </Upload>
                  <div style={{ height: "12px", width: "100%" }} />
                </div>
              </div>
            </Col>

            <div style={{ textAlign: "center", marginTop: "15px", marginInline: "auto" }}>
                <Button
                  htmlType="submit"
                  size="middle"
                  style={{ padding: "0 60px" }}
                >
                  {editingProject ? "Cập nhật" : "Đăng tải"}
                </Button>
              </div>
          </Row>
        </Form>
      </Modal>
    </>
  );
}
