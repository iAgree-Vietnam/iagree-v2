import React, { useState, useEffect, useRef } from "react";
import { Button, Image, message, Typography, Upload } from "antd";
import { UploadOutlined, CloseOutlined } from "@ant-design/icons";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import { RcFile } from "antd/es/upload";
import Constants from "@/src/constants/Constants";

const { Dragger } = Upload;

interface AppIDUploadStep9Props {
  onUpdate?: (file: File | null) => void;
  defaultValue?: string | File | null;
}

function AppIDUploadStep9({ onUpdate, defaultValue }: AppIDUploadStep9Props) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Use a ref for a hidden file input

  useEffect(() => {
    // Khởi tạo currentFile chỉ khi defaultValue là một File
    if (defaultValue instanceof File) {
      setCurrentFile(defaultValue);
    } else {
      setCurrentFile(null);
    }
  }, [defaultValue]);

  const isDefaultUrl = typeof defaultValue === "string" && !currentFile;
  const isNewFile = currentFile;
  const isDefaultFile = defaultValue instanceof File;

  let previewUrl: string | undefined;
  if (isNewFile) {
    previewUrl = URL.createObjectURL(currentFile);
  } else if (isDefaultUrl) {
    previewUrl = defaultValue;
  } else if (isDefaultFile) {
    previewUrl = URL.createObjectURL(defaultValue);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const maxFileSize = Constants.MAX_FILE_SIZE;
      if (e.target.files[0].size > maxFileSize) {
        message.error(`Kích thước tệp không được vượt quá ${maxFileSize / 1024 / 1024}MB!`);
        return;
      }
      
      const file = e.target.files[0];
      setCurrentFile(file);
      onUpdate?.(file);
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentFile(null);
    onUpdate?.(null);
  };

  const openFileBrowser = () => {
    fileInputRef.current?.click();
  };

  // Trường hợp không có ảnh nào hoặc default là URL
  const handleFileChangeDragger = (file: RcFile) => {
    // Logic của bạn sẽ nhận file trực tiếp từ beforeUpload
    setCurrentFile(file);
    onUpdate?.(file);
    return false;
  };

  const renderDragger = (
    <Dragger
      multiple={false}
      maxCount={1}
      accept={"image/*"}
      beforeUpload={handleFileChangeDragger}
      showUploadList={false}
      className={"idUploadDragger"}
    >
      <>
        <IconSvgLocal
          name={"IC_IMAGE_UPLOAD"}
          width={59}
          height={59}
          fill={"none"}
        />
        <Typography.Paragraph className={"idUploadDraggerDescription nm-typo"}>
          Kéo & thả tệp vào đây hoặc chọn tệp
        </Typography.Paragraph>
      </>
    </Dragger>
  );

  if (isNewFile || isDefaultFile) {
    return (
      <div className={"idUploadPreviewContainer"}>
        <Image
          src={previewUrl}
          alt={"CCCD/CMND"}
          preview={false}
          width={"100%"}
          className={"idUploadPreviewImg"}
        />
        <Button
          onClick={handleRemoveFile}
          icon={<CloseOutlined />}
          shape={"circle"}
          size={"small"}
          type={"primary"}
          className={"idUploadPreviewCloseBtn"}
        />
      </div>
    );
  } else if (isDefaultUrl) {
    // Trường hợp có ảnh mặc định là URL, dùng overlay
    return (
      <div
        className={"idUploadPreviewContainer idUploadPreview-hoverable"}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={openFileBrowser} // Dùng onClick để kích hoạt input
      >
        <Image
          src={previewUrl}
          alt={"CCCD/CMND"}
          preview={false}
          width={"100%"}
          className={"idUploadPreviewImg"}
        />
        {isHovered && (
          <div className="idUpload-overlay">
            <Button
              icon={<UploadOutlined />}
              shape={"circle"}
              size={"large"}
              type={"primary"}
            />
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
    );
  } else {
    // Trường hợp không có ảnh nào
    return renderDragger;
  }
}

export default AppIDUploadStep9;
