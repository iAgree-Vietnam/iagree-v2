
import {
  Modal,
  Typography,
  Row,
  Col,
  Divider,
  Tooltip,
  Button,
} from "antd";
import {
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FilePptOutlined,
  FileTextOutlined,
  FileZipOutlined,
  FileOutlined,
} from "@ant-design/icons";

const { Title, Paragraph, Text,  } = Typography;
import { FeaturedProjectUploadItem,  } from "@/src/data/typical-projects/models/typicalProjects.types";
import datetimeUtils from "@/src/utils/DatetimeUtils";

interface ViewPartnerFeaturedProjectsModalProps {
  visible: boolean;
  project: FeaturedProjectUploadItem | null;
  onCancel: () => void;
}

// Hàm xác định icon file theo extension/type
const getFileIcon = (fileName: string, fileType: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  const iconStyle = { fontSize: "22px", color: "#1890ff" };

  // if (fileType?.startsWith("video/")) {
  //   return <PlayCircleOutlined style={{ ...iconStyle, color: "#ff4d4f" }} />;
  // }

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

// const formatFileSize = (bytes: number) => {
//   if (bytes === 0) return "0 Bytes";
//   const k = 1024;
//   const sizes = ["Bytes", "KB", "MB", "GB"];
//   const i = Math.floor(Math.log(bytes) / Math.log(k));
//   return (
//     Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
//   );
// };

export function ViewPartnerFeaturedProjectsModal({
  visible,
  project,
  onCancel,
}: ViewPartnerFeaturedProjectsModalProps) {
  if (!project) return null;

  return (
    <Modal
      title={`Chi tiết dự án: ${project.name}`}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={1000}
      style={{ top: 20 }}
    >
      <Row gutter={24}>
        <Col span={12}>
          {/* Role */}
          <Text strong style={{ display: "block", marginTop: 8 }}>
            Vai trò: {project.role || "(Chưa cập nhật)"}
          </Text>
          
          {/* Dates */}
          <Text type="secondary" style={{ marginTop: 8, display: "block" }}>
            Thời gian thực hiện: &nbsp;
            {datetimeUtils
                      .getMoment(
                        project.start_date,
                        datetimeUtils.BACKEND_DATE_TIME
                      )
                      ?.format(datetimeUtils.LOCAL_DATE_WITHOUT_DAY)
            } - 
            {datetimeUtils
                      .getMoment(
                        project.start_date,
                        datetimeUtils.BACKEND_DATE_TIME
                      )
                      ?.format(datetimeUtils.LOCAL_DATE_WITHOUT_DAY)
            }
          </Text>

          {/* Cover Image */}
          {project.image ? (
            <img
              src={project.image}
              alt={project.name}
              style={{
                width: "100%",
                height: 350,
                borderRadius: 8,
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: 180,
                backgroundColor: "#f0f0f0",
                borderRadius: 8,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#aaa",
              }}
            >
              Không có hình bìa
            </div>
          )}

          {/* Technologies */}
          {/* <div style={{ marginTop: 8 }}>
            <Text strong>Công nghệ sử dụng: </Text>
            {project.technologies.length ? (
              project.technologies.map((tech) => (
                <Tag key={tech} style={{ marginBottom: 4 }}>
                  {tech}
                </Tag>
              ))
            ) : (
              <Text type="secondary">(Chưa cập nhật)</Text>
            )}
          </div> */}

          {/* Project URL */}
          {/* {project.projectUrl && (
            <div style={{ marginTop: 12 }}>
              <Link
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Xem trang dự án <EyeOutlined />
              </Link>
            </div>
          )} */}
        </Col>
        <Col span={12}>
          {/* Description */}
          <Title level={5}>Mô tả dự án</Title>
          <div
            style={{
              border: "0.5px solid #D4D4D4",
              borderRadius: 8,
              padding: 8,
              maxHeight: 250,
              overflowY: "auto",
              whiteSpace: "pre-wrap",
            }}
          >
            <Paragraph style={{ whiteSpace: "pre-wrap" }}>
              {project.description}
            </Paragraph>
          </div>

          {/* Achievements */}
          <Divider />
          <Title level={5}>Thành tựu nổi bật</Title>
          <div
            style={{
              border: "0.5px solid #D4D4D4",
              borderRadius: 8,
              padding: 8,
              maxHeight: 250,
              overflowY: "auto",
              whiteSpace: "pre-wrap",
            }}
          >
            <Paragraph style={{ whiteSpace: "pre-wrap" }}>
              {project.achievements || "(Chưa cập nhật)"}
            </Paragraph>
          </div>

          {/* Files */}
          <Divider />
          <Title level={5}>Tài liệu & File đính kèm</Title>
          {project.files && project.files.length > 0 ? (
            <div
              style={{
                maxHeight: 320,
                overflowY: "auto",
                border: "0.5px solid #D4D4D4",
                borderRadius: 8,
                padding: 8,
              }}
            >
              {project?.files?.map((file) => (
                <div
                  key={file.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 12,
                    cursor: file.filePath ? "pointer" : "default",
                  }}
                  onClick={() => {
                    if (file.filePath) window.open(file.filePath, "_blank");
                  }}
                  title="Click để xem/tải file"
                >
                  <div
                    style={{
                      marginRight: 16,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      backgroundColor: "#f0f0f0",
                      flexShrink: 0,
                    }}
                  >
                    {getFileIcon(file.fileName, file.type)}
                  </div>
                  <div style={{ flex: 1, overflow: "hidden" }}>
                    <Tooltip title={file.fileName}>
                      <Text ellipsis style={{ fontWeight: 500 }}>
                        {file.fileName}
                      </Text>
                    </Tooltip>
                    {/* <div style={{ fontSize: 12, color: "#888" }}>
                      {formatFileSize(file.size)}
                    </div> */}
                  </div>
                  <Button
                    type="link"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!file.filePath) return;
                      const link = document.createElement("a");
                      link.href = file.filePath;
                      link.download = file.fileName;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    Tải xuống
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <Text type="secondary">Không có file đính kèm</Text>
          )}
        </Col>
      </Row>
    </Modal>
  );
}
