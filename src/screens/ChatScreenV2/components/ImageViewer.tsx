"use client"

import type React from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "antd"

interface ImageViewerProps {
  images: Array<{
    id: string
    name: string
    url: string
  }>
  currentIndex: number
  isOpen: boolean
  onClose: () => void
  onNext: () => void
  onPrevious: () => void
  onImageSelect: (index: number) => void
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrevious,
  onImageSelect,
}) => {
  if (!isOpen || images.length === 0) return null

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
      {/* Left sidebar - Image list */}
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
          Hình ảnh ({images.length})
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {images.map((image, index) => (
            <div
              key={image.id}
              style={{
                cursor: "pointer",
                border: index === currentIndex ? "2px solid #09993E" : "2px solid transparent",
                borderRadius: "8px",
                overflow: "hidden",
                transition: "border-color 0.2s ease",
              }}
              onClick={() => onImageSelect(index)}
            >
              <img
                src={image.url || "/placeholder.svg"}
                alt={image.name}
                style={{
                  width: "100%",
                  height: "80px",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Right side - Main image viewer */}
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
              {images[currentIndex]?.name}
            </div>
            <div style={{ fontSize: "14px", opacity: 0.7 }}>
              {currentIndex + 1} / {images.length}
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

        {/* Main image container */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            padding: "20px 80px",
            minHeight: 0,
          }}
        >
          <img
            src={images[currentIndex]?.url || "/placeholder.svg"}
            alt={images[currentIndex]?.name}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              width: "auto",
              height: "auto",
              objectFit: "contain",
              borderRadius: "8px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
            }}
          />

          {/* Previous button */}
          {images.length > 1 && (
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

          {/* Next button */}
          {images.length > 1 && (
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
              disabled={currentIndex === images.length - 1}
            />
          )}
        </div>
      </div>
    </div>
  )
}
