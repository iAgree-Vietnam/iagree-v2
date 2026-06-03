/* eslint-disable import/no-unused-modules */
import React, { useState } from "react";
import { Modal, Typography, Button,  Row, Col } from "antd";
import { LeftOutlined, RightOutlined, FileOutlined, DownloadOutlined } from "@ant-design/icons";
import { FeaturedProjectUploadItem } from "@/src/data/typical-projects/models/typicalProjects.types";
import datetimeUtils from "@/src/utils/DatetimeUtils";

interface ViewFeaturedProjectsModalProps {
  open: boolean;
  project: FeaturedProjectUploadItem | null;
  onClose: () => void;
}

export const ViewFeaturedProjectsModal: React.FC<
  ViewFeaturedProjectsModalProps
> = ({ open, project, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isAchievementsExpanded, setIsAchievementsExpanded] = useState(false);

  if (!project) return null;

  // Get all project images (cover image + files that are images)
  const isImageFiles = (file: any) => {
    return file.type?.startsWith('image/') || 
        file.fileName?.match(/\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i);
  };

  const projectImages = [
    project.image, // Cover image
    ...(project.files?.filter(file => isImageFiles(file)).map(file => file.filePath) || [])
  ].filter(Boolean); // Remove any null/undefined values

  // Get all projects documents (not images in files)
  const nonImageFiles = project.files?.filter(file => !isImageFiles(file)) || [];

  const totalImages = projectImages.length;

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const nextImage = () => {
    if (currentImageIndex < totalImages - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  }

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  const toggleAchievements = () => {
    setIsAchievementsExpanded(!isAchievementsExpanded);
  };

  // Helper function to format file size
  // const formatFileSize = (bytes: number) => {
  //   if (bytes === 0) return "0 Bytes";
  //   const k = 1024;
  //   const sizes = ["Bytes", "KB", "MB", "GB"];
  //   const i = Math.floor(Math.log(bytes) / Math.log(k));
  //   return (
  //     Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  //   );
  // };

  // Helper function to check if description needs expand/collapse
  const needsDescriptionExpansion = project.description && 
    project.description.split("\n").length > 5;

  // Helper function to check if achievements needs expand/collapse
  const needsAchievementsExpansion = project.achievements && 
    project.achievements.split("\n").length > 5;

  return (
    <>
      {/* CSS nội tuyến cho hiệu ứng hover nút điều hướng */}
      <style>{`
        .image-container:hover .nav-button {
          opacity: 1 !important;
          pointer-events: auto !important;
        }
        .file-item {
          display: flex;
          align-items: center;
          padding: 8px 12px;
          border: 1px solid #d9d9d9;
          border-radius: 6px;
          margin-bottom: 8px;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .file-item:hover {
          border-color: #09993E;
          background-color: #f6ffed;
        }
      `}</style>

      <Modal
        title={project.name}
        open={open}
        onCancel={() => {
          onClose();
          setCurrentImageIndex(0);
          setIsDescriptionExpanded(false);
          setIsAchievementsExpanded(false);
        }}
        footer={null}
        width={900}
        centered
      >
        <Typography.Paragraph
          style={{ display: "block", marginBottom: 8, width: "100%" }}
        >
          <strong>Vai trò:</strong> {project.role || "Chưa cập nhật."}
        </Typography.Paragraph>

        <Typography.Paragraph
          style={{ marginBottom: 16, width: "100%" }}
        >
          <strong>Thời gian thực hiện:</strong>{" "}
          {project.start_date && project.end_date ? (
            <>
              {datetimeUtils
                .getMoment(project.start_date, datetimeUtils.BACKEND_DATE_TIME)
                ?.format(datetimeUtils.LOCAL_DATE_WITHOUT_DAY)}
              {" - "}
              {datetimeUtils
                .getMoment(project.end_date, datetimeUtils.BACKEND_DATE_TIME)
                ?.format(datetimeUtils.LOCAL_DATE_WITHOUT_DAY)}
            </>
          ) : (
            "Chưa cập nhật"
          )}
        </Typography.Paragraph>

        {/* Phần mô tả với expand/collapse */}
        <Typography.Title level={5} style={{ marginBottom: 12 }}>
          Mô tả
        </Typography.Title>
        <div
          style={{
            marginBottom: 16,
            width: "100%",
            paddingRight: 8,
          }}
        >
          <Typography.Paragraph
            style={{
              whiteSpace: "pre-wrap",
              marginBottom: 0,
              display: "-webkit-box",
              WebkitLineClamp: isDescriptionExpanded ? "none" : 5,
              WebkitBoxOrient: "vertical",
              overflow: isDescriptionExpanded ? "visible" : "hidden",
              lineHeight: "1.5em",
              transition: "all 0.3s ease",
            }}
          >
            {project.description || "Không có mô tả."}
            {!isDescriptionExpanded && needsDescriptionExpansion && <span>... </span>}
            {needsDescriptionExpansion && (
              <span
                onClick={toggleDescription}
                style={{
                  color: "#09993E",
                  cursor: "pointer",
                  fontWeight: "500",
                  marginLeft: "4px",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#007a32";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#09993E";
                }}
              >
                {isDescriptionExpanded ? "Thu gọn" : "Xem thêm"}
              </span>
            )}
          </Typography.Paragraph>
        </div>

        {/* Phần thành tựu với expand/collapse */}
        <Typography.Title level={5} style={{ marginBottom: 12 }}>
          Thành tựu nổi bật
        </Typography.Title>
        <div
          style={{
            marginBottom: 24,
            width: "100%",
            paddingRight: 8,
          }}
        >
          <Typography.Paragraph
            style={{
              whiteSpace: "pre-wrap",
              marginBottom: 0,
              display: "-webkit-box",
              WebkitLineClamp: isAchievementsExpanded ? "none" : 5,
              WebkitBoxOrient: "vertical",
              overflow: isAchievementsExpanded ? "visible" : "hidden",
              lineHeight: "1.5em",
              transition: "all 0.3s ease",
            }}
          >
            {project.achievements || "Chưa cập nhật."}
            {!isAchievementsExpanded && needsAchievementsExpansion && <span>... </span>}
            {needsAchievementsExpansion && (
              <span
                onClick={toggleAchievements}
                style={{
                  color: "#09993E",
                  cursor: "pointer",
                  fontWeight: "500",
                  marginLeft: "4px",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#007a32";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#09993E";
                }}
              >
                {isAchievementsExpanded ? "Thu gọn" : "Xem thêm"}
              </span>
            )}
          </Typography.Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} sm={24} lg={8} key={project.id}>
            {/* Phần tài liệu liên quan */}
            {nonImageFiles.length > 0 && (
              <>
                <Typography.Title level={5} style={{ marginBottom: 12 }}>
                  Tài liệu liên quan ({nonImageFiles.length} tệp)
                </Typography.Title>
                <div style={{ marginBottom: 16 }}>
                  {nonImageFiles.map((file, index) => (
                    <div key={index} className="file-item">
                      <FileOutlined
                        style={{
                          fontSize: 16,
                          color: "#1890ff",
                          marginRight: 12,
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: 500,
                            marginBottom: 2,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {file.fileName}
                        </div>
                      </div>
                      {file.filePath && (
                        <Button
                          type="text"
                          size="small"
                          icon={<DownloadOutlined />}
                          onClick={() => {
                            // Open file in new tab for download/view
                            window.open(file.filePath, '_blank');
                          }}
                          style={{
                            color: "#09993E",
                            marginLeft: 8,
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </Col>

          <Col xs={24} sm={24} lg={16} key={project.id}>
            {/* Phần ảnh với nút điều hướng */}
            {projectImages.length > 0 && (
              <>
                <Typography.Title level={5} style={{ marginBottom: 12 }}>
                  Hình ảnh dự án
                </Typography.Title>
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "400px",
                    borderRadius: 8,
                    overflow: "hidden",
                    cursor: "pointer",
                    marginBottom: 24,
                  }}
                  className="image-container"
                >
                  <img
                    src={projectImages[currentImageIndex]}
                    alt={`${project.name} - ${currentImageIndex + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      userSelect: "none",
                      display: "block",
                    }}
                    draggable={false}
                  />

                  {/* Nút Previous */}
                  {totalImages > 1 && currentImageIndex > 0 && (
                    <Button
                      onClick={prevImage}
                      shape="circle"
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: 8,
                        transform: "translateY(-50%)",
                        borderColor: "#09993E",
                        backgroundColor: "#fff",
                        color: "#000",
                        borderWidth: 2,
                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                        zIndex: 10,
                        opacity: 0,
                        pointerEvents: "none",
                        transition: "opacity 0.3s ease",
                      }}
                      aria-label="Previous image"
                      icon={<LeftOutlined style={{ fontWeight: "bold" }} />}
                      className="nav-button prev-button"
                    />
                  )}

                  {/* Nút Next */}
                  {totalImages > 1 && currentImageIndex < totalImages - 1 && (
                    <Button
                      onClick={nextImage}
                      shape="circle"
                      style={{
                        position: "absolute",
                        top: "50%",
                        right: 8,
                        transform: "translateY(-50%)",
                        borderColor: "#09993E",
                        backgroundColor: "#fff",
                        color: "#000",
                        borderWidth: 2,
                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                        zIndex: 10,
                        opacity: 0,
                        pointerEvents: "none",
                        transition: "opacity 0.3s ease",
                      }}
                      aria-label="Next image"
                      icon={<RightOutlined style={{ fontWeight: "bold" }} />}
                      className="nav-button next-button"
                    />
                  )}

                  {/* Chỉ số trang ảnh */}
                  {totalImages > 1 && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 12,
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "rgba(0,0,0,0.35)",
                        color: "#fff",
                        borderRadius: 12,
                        padding: "2px 12px",
                        fontSize: 14,
                        zIndex: 10,
                        pointerEvents: "none",
                      }}
                    >
                      {currentImageIndex + 1} / {totalImages}
                    </div>
                  )}
                </div>
              </>
            )}
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default ViewFeaturedProjectsModal;