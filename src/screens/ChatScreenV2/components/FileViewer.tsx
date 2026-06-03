"use client"

import React from "react"
import { X, ChevronLeft, ChevronRight, FileText } from "lucide-react"
import { Button } from "antd"

interface FileViewerProps {
  files: Array<{
    id: string
    name: string
    type: string
    url: string
  }>
  currentIndex: number
  isOpen: boolean
  onClose: () => void
  onNext: () => void
  onPrevious: () => void
  onFileSelect: (index: number) => void
}

export const FileViewer: React.FC<FileViewerProps> = ({
  files,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrevious,
  onFileSelect,
}) => {
  if (!isOpen || files.length === 0) return null

  const currentFile = files[currentIndex]

  // Kiểm tra loại file có thể xem trực tiếp (ở đây ví dụ chỉ hỗ trợ PDF)
  const canViewDirectly = currentFile.type === "application/pdf"

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        zIndex: 1000,
        display: "flex",
      }}
      onClick={onClose}
    >
      {/* Sidebar danh sách file */}
      <div
        style={{
          width: "300px",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          padding: "20px",
          overflowY: "auto",
          borderRight: "1px solid rgba(255, 255, 255, 0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ color: "white", fontSize: "16px", fontWeight: "bold", marginBottom: "16px" }}>
          Tệp đính kèm ({files.length})
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {files.map((file, index) => (
            <div
              key={file.id}
              style={{
                cursor: "pointer",
                border: index === currentIndex ? "2px solid #09993E" : "2px solid transparent",
                borderRadius: "8px",
                padding: "8px",
                backgroundColor: index === currentIndex ? "rgba(9, 153, 62, 0.1)" : "transparent",
                color: "white",
                fontWeight: "bold",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={file.name}
              onClick={() => onFileSelect(index)}
            >
              {file.name}
            </div>
          ))}
        </div>
      </div>

      {/* Phần hiển thị file chính */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px",
            color: "white",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <div>
            <div style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "4px" }}>
              {currentFile.name}
            </div>
            <div style={{ fontSize: "14px", opacity: 0.7 }}>
              {currentIndex + 1} / {files.length}
            </div>
          </div>
          <Button
            type="text"
            shape="circle"
            icon={<X size={24} />}
            onClick={onClose}
            style={{
              color: "white",
              border: "none",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              width: "48px",
              height: "48px",
            }}
          />
        </div>

        {/* Container hiển thị nội dung file */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            padding: "20px 80px",
            minHeight: 0,
            color: "white",
            fontSize: "16px",
            textAlign: "center",
            userSelect: "none",
          }}
        >
          {canViewDirectly ? (
            <iframe
              src={currentFile.url}
              style={{ width: "100%", height: "80vh", border: "none", borderRadius: 8 }}
              title={currentFile.name}
            />
          ) : (
            <div>
              <FileText size={64} style={{ marginBottom: 16, color: "#faad14" }} />
              <p>Không thể xem trực tiếp loại file này.</p>
              <a
                href={currentFile.url}
                download={currentFile.name}
                style={{
                  color: "#09993E",
                  fontWeight: "bold",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                Tải xuống {currentFile.name}
              </a>
            </div>
          )}
        </div>

        {/* Nút điều hướng Previous */}
        {files.length > 1 && (
          <Button
            type="text"
            shape="circle"
            icon={<ChevronLeft size={24} />}
            onClick={onPrevious}
            style={{
              position: "absolute",
              left: "20px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "white",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              border: "none",
              width: "48px",
              height: "48px",
              transition: "background-color 0.2s ease",
            }}
            disabled={currentIndex === 0}
          />
        )}

        {/* Nút điều hướng Next */}
        {files.length > 1 && (
          <Button
            type="text"
            shape="circle"
            icon={<ChevronRight size={24} />}
            onClick={onNext}
            style={{
              position: "absolute",
              right: "20px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "white",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              border: "none",
              width: "48px",
              height: "48px",
              transition: "background-color 0.2s ease",
            }}
            disabled={currentIndex === files.length - 1}
          />
        )}
      </div>
    </div>
  )
}
