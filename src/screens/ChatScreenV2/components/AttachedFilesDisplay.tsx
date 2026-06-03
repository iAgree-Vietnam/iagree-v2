import { Button, Typography } from "antd"
import { X, ImageIcon, Video, File, FileText } from "lucide-react"

interface AttachedFile {
  id: string
  name: string
  size: number
  type: string
  file: File
}
export const AttachedFilesDisplay: React.FC<{
  attachedFiles: AttachedFile[]
  onRemoveFile: (fileId: string) => void
}> = ({ attachedFiles, onRemoveFile }) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (type: string, size = 20) => {
    if (type.startsWith("image/")) {
      return <ImageIcon size={size} style={{ color: "#52c41a" }} />
    } else if (type.startsWith("video/")) {
      return <Video size={size} style={{ color: "#722ed1" }} />
    } else if (type === "application/pdf") {
      return <FileText size={size} style={{ color: "#ff4d4f" }} />
    } else if (type.includes("word") || type === "text/plain") {
      return <FileText size={size} style={{ color: "#1890ff" }} />
    } else {
      return <File size={size} style={{ color: "#8c8c8c" }} />
    }
  }

  if (attachedFiles.length === 0) return null

  return (
    <div
      style={{
        padding: "16px",
        paddingBottom: "8px",
        backgroundColor: "#fafafa",
        borderTop: "1px solid #f0f0f0",
      }}
    >
      <Typography.Text style={{ fontSize: "13px", color: "#8c8c8c", marginBottom: "8px", display: "block" }}>
        Tệp đính kèm ({attachedFiles.length}):
      </Typography.Text>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {attachedFiles.map((file) => (
          <div
            key={file.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 12px",
              backgroundColor: "white",
              border: "1px solid #d9d9d9",
              borderRadius: "6px",
              maxWidth: "250px",
            }}
          >
            {getFileIcon(file.type, 16)}
            <div style={{ flex: 1, minWidth: 0 }}>
              <Typography.Text
                style={{
                  fontSize: "13px",
                  display: "block",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {file.name}
              </Typography.Text>
              <Typography.Text style={{ fontSize: "11px", color: "#8c8c8c" }}>
                {formatFileSize(file.size)}
              </Typography.Text>
            </div>
            <Button
              type="text"
              size="small"
              icon={<X size={14} />}
              onClick={() => onRemoveFile(file.id)}
              style={{
                color: "#8c8c8c",
                padding: "0",
                minWidth: "auto",
                height: "auto",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
