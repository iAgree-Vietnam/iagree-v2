/* ===================== MessageInput (refactor: TextArea autosize, enter to send) ===================== */

import {
  Button,
  Dropdown,
  Input,
  Tooltip,
  Upload,
  Tag,
  message,
  Typography,
} from "antd";
import type { UploadProps } from "antd";
import {
  SmileOutlined,
  PaperClipOutlined,
  DeleteOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { Send } from "lucide-react";
import Picker from "@emoji-mart/react";
import type { RcFile } from "antd/es/upload";

const { TextArea } = Input;

export const FilePreview: React.FC<{
  files: RcFile[];
  removeFile: (index: number) => void;
}> = ({ files, removeFile }) => {
  return (
    <div
      style={{
        display: "flex",
        maxHeight: "70px",
        overflowY: "auto",
        flexDirection: "column",
        gap: 8,
      }}
    >
      {files.map((file, idx) => {
        const ext = file.name.split(".").pop()?.toUpperCase() || "FILE";
        return (
          <div
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              border: "1px solid #f0f0f0",
              padding: "8px 12px",
              borderRadius: 6,
              background: "#fafafa",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <FileOutlined style={{ color: "#1677ff" }} />
              <Typography.Text
                style={{
                  maxWidth: 220,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                title={file.name}
              >
                {file.name}
              </Typography.Text>
              <Tag color="default">{ext}</Tag>
              <Typography.Text style={{ fontSize: 12, color: "#666" }}>
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </Typography.Text>
            </div>
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => removeFile(idx)}
              danger
            />
          </div>
        );
      })}
    </div>
  );
};
export const MessageInput: React.FC<{
  messageText: string;
  onMessageTextChange: (text: string) => void;
  onSendMessage: (files: RcFile[]) => void;
  onKeyPress?: (e: React.KeyboardEvent) => void; // optional
  partnerName: string;
  attachmentDropdownOpen: boolean;
  setAttachmentDropdownOpen: (open: boolean) => void;
  files: RcFile[];
  setFiles: (file: RcFile[]) => void;
  disabled?: boolean;
}> = ({
  messageText,
  onMessageTextChange,
  onSendMessage,
  onKeyPress,
  partnerName,
  attachmentDropdownOpen, // (chưa dùng, vẫn giữ API)
  setAttachmentDropdownOpen, // (chưa dùng, vẫn giữ API)
  files,
  setFiles,
  disabled,
}) => {
  const ALLOWED_EXT = new Set(["jpg", "jpeg", "png", "pdf", "doc", "docx"]);
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB

  const validateFile = (file: RcFile) => {
    const ext = (file.name.split(".").pop() || "").toLowerCase();
    if (!ALLOWED_EXT.has(ext)) {
      message.error(`Chỉ cho phép JPG, JPEG, PNG, PDF, DOC, DOCX.`);
      return false;
    }
    if (file.size > MAX_SIZE) {
      message.error(`"${file.name}" vượt quá 5MB.`);
      return false;
    }
    return true;
  };

  const beforeUpload: UploadProps["beforeUpload"] = (file) => {
    const rc = file as RcFile;
    if (!validateFile(rc)) return Upload.LIST_IGNORE;
    const exists = files.some((f) => f.name === rc.name && f.size === rc.size);
    if (exists) {
      message.warning(`"${rc.name}" đã được chọn.`);
      return Upload.LIST_IGNORE;
    }
    setFiles([...files, rc]);
    return Upload.LIST_IGNORE; // chặn upload tự động
  };

  const removeFile = (index: number) => {
    const next = [...files];
    next.splice(index, 1);
    setFiles(next);
  };

  const canSend = messageText.trim().length > 0 || files.length > 0;

  const handleSend = () => {
    if (!canSend) {
      message.info("Vui lòng nhập tin nhắn hoặc chọn tệp.");
      return;
    }
    onSendMessage?.(files);
    onMessageTextChange("");
    setFiles([]);
  };

  // Enter để gửi | Shift+Enter xuống dòng
  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (
    e
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
      return;
    }
    onKeyPress?.(e as unknown as React.KeyboardEvent);
  };

  const handleEmojiClick = (emojiObject: any) => {
    const emoji = emojiObject?.native;
    if (emoji) onMessageTextChange(messageText + emoji);
  };

  const emojiDropdown = (
    <div style={{ width: 300 }}>
      <Picker onEmojiSelect={handleEmojiClick} />
    </div>
  );

  return (
    <div
      style={{
        padding: 16,
        borderTop: "1px solid #f0f0f0",
        backgroundColor: "white",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Preview (styled giống message attachments) */}
        {files.length > 0 && (
          <FilePreview files={files} removeFile={removeFile} />
        )}

        <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                border: "1px solid #d9d9d9",
                borderRadius: 8,
                padding: 8,
                background: disabled ? "#fafafa" : "#fff",
              }}
            >
              <Dropdown
                trigger={["click"]}
                placement="topLeft"
                dropdownRender={() => emojiDropdown}
              >
                <SmileOutlined
                  style={{ fontSize: 18, color: "#8c8c8c", cursor: "pointer" }}
                />
              </Dropdown>

              <TextArea
                placeholder={
                  disabled
                    ? "Cuộc trò chuyện đã bị vô hiệu"
                    : "Nhập tin nhắn (Shift+Enter xuống dòng, Enter để gửi)"
                }
                value={messageText}
                onChange={(e) => onMessageTextChange(e.target.value)}
                onKeyDown={handleKeyDown}
                autoSize={{ minRows: 1, maxRows: 4 }}
                disabled={disabled}
                style={{
                  flex: 1,
                  border: "none",
                  boxShadow: "none",
                  resize: "none",
                  padding: "6px 8px",
                }}
              />

              <Upload
                multiple
                showUploadList={false}
                beforeUpload={beforeUpload}
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                disabled={disabled}
              >
                <Button
                  type="text"
                  icon={<PaperClipOutlined />}
                  style={{
                    fontSize: 18,
                    color: "#8c8c8c",
                  }}
                />
              </Upload>
            </div>
          </div>

          <Tooltip title={`Gửi tin nhắn đến ${partnerName}`}>
            <Button
              type="primary"
              shape="circle"
              icon={<Send size={16} />}
              onClick={handleSend}
              disabled={!canSend || disabled}
              style={{
                backgroundColor: "#09993E",
                borderColor: "#09993E",
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
