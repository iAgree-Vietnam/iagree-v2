import React, { useState, useEffect } from "react";
import { Upload, Button, Typography, Image, Modal, Space, Col, message } from "antd";
import {
  UploadOutlined,
  PlayCircleOutlined,
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import type { UploadFile } from "antd/lib/upload/interface";
import Constants from "@/src/constants/Constants";
import { 
  formatDuration, 
  formatFileSize, 
  getFileIcon, 
  getFileMainColor 
} from "../../../utils/JobEditFormUtils";

const { Text } = Typography;

interface ViewableFile extends UploadFile {
  comment?: string;
  thumbnailUrl?: string;
  duration?: number;
  previewUrl?: string;
}

interface JobAttachmentUploadProps {
  value?: ViewableFile[];
  onChange?: (fileList: ViewableFile[]) => void;
}

const JobAttachmentUpload: React.FC<JobAttachmentUploadProps> = ({
  value = [],
  onChange,
}) => {
  const [fileList, setFileList] = useState<ViewableFile[]>(value);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<ViewableFile | null>(null);

  // useEffect(() => {
  //   setFileList(value);
  // }, [value]);

  const isDirectlyPreviewable = (file: ViewableFile) => {
    return (
      file.type?.startsWith("image/") ||
      file.type?.startsWith("video/") ||
      file.type === "application/pdf"
    );
  };

  const handlePreview = async (file: ViewableFile) => {
    const urlToPreview = file.previewUrl || file.url;

    if (urlToPreview) {
      if (file.type?.startsWith("image/") || file.type?.startsWith("video/")) {
        setPreviewFile(file);
        setPreviewOpen(true);
      } else if (file.type === "application/pdf") {
        window.open(urlToPreview, "_blank");
      } else {
        handleDownload(file);
      }
    } else {
      Modal.warn({
        title: "Không có URL để xem trước",
        content:
          "Không có URL cho tệp này để xem trước. Vui lòng thử lại sau khi tệp được xử lý.",
        okText: "Đóng",
      });
    }
  };

  const handleDownload = (file: ViewableFile) => {
    const urlToDownload = file.previewUrl || file.url;
    if (urlToDownload) {
      Modal.confirm({
        title: "Xác nhận tải xuống",
        content: `Bạn có muốn tải xuống tệp "${file.name}" không?`,
        okText: "Tải xuống",
        cancelText: "Hủy",
        onOk() {
          const a = document.createElement("a");
          a.href = urlToDownload;
          a.download = file.name || "download";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        },
      });
    } else {
      Modal.warn({
        title: "Không có URL để tải xuống",
        content:
          "Không có URL cho tệp này để tải xuống. Vui lòng thử lại sau khi tệp được xử lý.",
        okText: "Đóng",
      });
    }
  };

  const handleBeforeUpload = (file: File) => {
    const maxFileSize = Constants.MAX_FILE_SIZE;

    const isDuplicate = fileList.some(
      (f) => f.name === file.name && f.size === file.size
    );

    if (isDuplicate) {
      message.warning(`Tệp ${file.name} đã tồn tại!`);
      return Upload.LIST_IGNORE;
    }

    if (file.size > maxFileSize) {
      message.error(`File ${file.name} vượt quá ${maxFileSize / 1024 / 1024} MB`);
      return Upload.LIST_IGNORE;
    }

    return true;
  }

  const handleFileChange = ({
    fileList: newFileList,
  }: {
    fileList: UploadFile[];
  }) => {
    const processedFileList = newFileList.map((file) => {
      if (!file.url && file.originFileObj) {
        return {
          ...file,
          previewUrl: URL.createObjectURL(file.originFileObj as Blob),
          status: "done",
          duration: file.type?.startsWith("video/") ? 120 : undefined,
        } as ViewableFile;
      }
      return file as ViewableFile;
    });

    setFileList(processedFileList);
    if (onChange) {
      onChange(processedFileList);
    }
  };

  const handleRemove = (fileToRemove: ViewableFile) => {
    if (fileToRemove.previewUrl && fileToRemove.url?.startsWith("blob:")) {
      URL.revokeObjectURL(fileToRemove.previewUrl);
    }
    const newFileList = fileList.filter(
      (file) => file.uid !== fileToRemove.uid
    );
    setFileList(newFileList);
    if (onChange) {
      onChange(newFileList);
    }
  };

  const customUploadItemRender = (
    file: UploadFile,
    actions: { download: () => void; preview: () => void; remove: () => void }
  ) => {
    const viewableFile = file as ViewableFile;
    const isImage = viewableFile.type?.startsWith("image/");
    const isVideo = viewableFile.type?.startsWith("video/");
    const displayUrl = viewableFile.previewUrl || viewableFile.url;

    const actionButton = isDirectlyPreviewable(viewableFile) ? (
      <Button
        type="text"
        size="small"
        icon={<EyeOutlined style={{ fontSize: "14px" }} />}
        onClick={() => handlePreview(viewableFile)}
        style={{
          color: "#8c8c8c",
          padding: "0",
          minWidth: "auto",
          height: "auto",
        }}
      />
    ) : (
      <Button
        type="text"
        size="small"
        icon={<DownloadOutlined style={{ fontSize: "14px" }} />}
        onClick={() => handleDownload(viewableFile)}
        style={{
          color: "#8c8c8c",
          padding: "0",
          minWidth: "auto",
          height: "auto",
        }}
      />
    );

    return (
      <div
        key={file.uid}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 12px",
          backgroundColor: "white",
          border: "1px solid #d9d9d9",
          borderRadius: "6px",
          boxSizing: "border-box",
          flexGrow: 1,
          minWidth: "180px",
          maxWidth: "280px",
          height: "fit-content",
          alignSelf: "start",
          position: "relative",
        }}
      >
        {isImage && displayUrl ? (
          <Image
            src={displayUrl}
            alt={viewableFile.name}
            width={32}
            height={32}
            preview={false}
            style={{ borderRadius: "4px", objectFit: "cover", flexShrink: 0 }}
          />
        ) : isVideo && (displayUrl || viewableFile.thumbUrl) ? (
          <div
            style={{
              width: 32,
              height: 32,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: getFileMainColor(viewableFile.type) + "1A",
              borderRadius: "4px",
              flexShrink: 0,
            }}
          >
            {viewableFile.thumbUrl ? (
              <Image
                src={viewableFile.thumbUrl}
                alt="Video Thumbnail"
                width={32}
                height={32}
                preview={false}
                style={{ borderRadius: "4px", objectFit: "cover" }}
              />
            ) : (
              <PlayCircleOutlined
                style={{
                  fontSize: "20px",
                  color: getFileMainColor(viewableFile.type),
                }}
              />
            )}
          </div>
        ) : (
          getFileIcon(viewableFile.type || "", 20)
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <Typography.Text
            style={{
              fontSize: "13px",
              display: "block",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={viewableFile.name}
          >
            {viewableFile.name}
          </Typography.Text>
          <Typography.Text style={{ fontSize: "14px", color: "#8c8c8c" }}>
            {viewableFile.size ? formatFileSize(viewableFile.size) : "N/A"}
            {isVideo &&
              viewableFile.duration !== undefined &&
              ` | Thời lượng: ${formatDuration(viewableFile.duration)}`}
          </Typography.Text>
          {file.status === "error" && (
            <Typography.Text type="danger" style={{ fontSize: "14px" }}>
              Lỗi xử lý file
            </Typography.Text>
          )}
        </div>
        <div style={{ display: "flex", gap: "4px" }}>
          {/* Nút Action (Preview hoặc Download) */}
          {actionButton}

          {/* Nút Delete */}
          <Button
            type="text"
            size="small"
            icon={<DeleteOutlined style={{ fontSize: "14px" }} />}
            onClick={() => handleRemove(viewableFile)}
            style={{
              color: "#8c8c8c",
              padding: "0",
              minWidth: "auto",
              height: "auto",
            }}
          />
        </div>
      </div>
    );
  };

  const isUploadDisabled = fileList.length >= Constants.MAX_FILE_COUNT;
  const uploadButton = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "5px 0",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "23px",
          height: "23px",
          borderRadius: "50%",
          backgroundColor: "white",
          border: "1px solid #d9d9d9",
          boxShadow: "0 2px 0 rgba(0, 0, 0, 0.04)",
        }}
      >
        <PlusOutlined style={{ fontSize: "15px", color: "#999" }} />
      </div>
      <Typography.Text style={{ fontSize: "12px", marginTop: "5px" }}>
        {isUploadDisabled ? "Không thể tải thêm tệp" : "Thêm tệp"}
      </Typography.Text>
    </div>
  );

  return (
    <>
      {fileList.length === 0 ? (
        <div
          style={{
            borderRadius: "8px",
            padding: "8px 12px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "5px",
            transition: "border-color 0.3s",
          }}
        >
          <Upload
            name="file"
            accept="image/*,.pdf"
            multiple
            beforeUpload={(file) => handleBeforeUpload(file)}
            onChange={handleFileChange}
            showUploadList={false}
            fileList={fileList}
            maxCount={5}
            disabled={fileList.length >= Constants.MAX_FILE_COUNT}
          >
            <Button
              icon={<UploadOutlined />}
              size="large"
              disabled={fileList.length >= Constants.MAX_FILE_COUNT}
            >
              Tải lên tệp đính kèm
            </Button>
          </Upload>
          <Text
            type="secondary"
            style={{ fontStyle: "normals", fontSize: "14px" }}
          >
            (*) Hỗ trợ hình ảnh và .pdf. Số lượng tối đa 5 tệp. Dung lượng tệp tối đa 5MB.
          </Text>
        </div>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "8px",
            }}
          >
            {fileList.map((file) =>
              customUploadItemRender(file, {
                download: () => handleDownload(file),
                preview: () => handlePreview(file),
                remove: () => handleRemove(file),
              })
            )}
            <Upload
              name="file"
              multiple
              beforeUpload={(file) => handleBeforeUpload(file)}
              onChange={handleFileChange}
              showUploadList={false}
              fileList={fileList}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "0",
                border: "1px dashed #d9d9d9",
                borderRadius: "6px",
                backgroundColor: "#fafafa",
                cursor: "pointer",
                minWidth: "180px",
                maxWidth: "280px",
                height: "fit-content",
                boxSizing: "border-box",
              }}
              disabled={fileList.length >= Constants.MAX_FILE_COUNT}
            >
              {uploadButton}
            </Upload>
          </div>

          {/* Modal để hiển thị preview cho ảnh và video */}
          <Modal
            open={previewOpen}
            title={previewFile?.name}
            footer={null}
            onCancel={() => setPreviewOpen(false)}
            width={previewFile?.type?.startsWith("video/") ? 720 : 520}
            destroyOnClose
          >
            {previewFile?.type?.startsWith("image/") && (
              <img
                alt="preview"
                style={{ width: "100%", display: "block", margin: "auto" }}
                src={previewFile.previewUrl || previewFile.url}
              />
            )}
            {previewFile?.type?.startsWith("video/") && (
              <video
                controls
                style={{ width: "100%", display: "block", margin: "auto" }}
                src={previewFile.previewUrl || previewFile.url}
              >
                Trình duyệt của bạn không hỗ trợ phát video.
              </video>
            )}
          </Modal>
        </>
      )}
    </>
  );
};

export default JobAttachmentUpload;
