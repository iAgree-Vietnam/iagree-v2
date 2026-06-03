import { useState } from "react";
import {
  Space,
  Typography,
  Rate,
  Image,
  Row,
  Col,
  Divider,
  Tag,
  Button,
  Modal,
} from "antd";

import datetimeUtils from "@/src/utils/DatetimeUtils";
import { UserReviewAttachmentsResource } from "@/src/data/partner/models/partner.types";
import Images from "@/src/constants/Images";
import Constants from "@/src/constants/Constants";
import { DownloadOutlined } from "@ant-design/icons";
import { RawReviewResource } from "@/src/data/partner/models/partner.raw";
import AttachmentsPreview from "./AttachmentsPreview";

export interface ReviewItemProps {
  reviewData: RawReviewResource;
}

export function ReviewItem({ reviewData }: ReviewItemProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] =
    useState<UserReviewAttachmentsResource | null>(null);
  const [iframeError, setIframeError] = useState(false);

  const projectStatus = (projectStatus: number) => {
    const isCompleted =
      projectStatus === Constants.JOB.STATUS.DUYET_HOAN_THANH_CV;

    return (
      <Tag
        color={
          reviewData?.project?.badge_info?.badge_color 
          // || isCompleted
          //   ? "#09993E"
          //   : "#979797"
        }
        style={{
          marginInlineEnd: 0,
          width: "88px",
          textAlign: "center",
        }}
      >
        {/* {isCompleted ? "Hoàn tất" : "Chưa hoàn tất"} */}
        {reviewData?.project?.badge_info?.badge_label }
      </Tag>
    );
  };

  const isImageFile = (fileName: string) => {
    const imageExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".bmp",
      ".webp",
      ".svg",
    ];
    const extension = fileName
      .toLowerCase()
      .substring(fileName.lastIndexOf("."));

    return imageExtensions.includes(extension);
  };

  const canDisplayInIframe = (fileName: string) => {
    const iframeCompatibleExtensions = [
      ".pdf",
      ".txt",
      ".html",
      ".htm",
      ".doc",
      ".docx",
      ".xls",
      ".xlsx",
      ".ppt",
      ".pptx",
    ];
    const extension = fileName
      .toLowerCase()
      .substring(fileName.lastIndexOf("."));

    return iframeCompatibleExtensions.includes(extension);
  };

  const openFileModal = (file: UserReviewAttachmentsResource) => {
    setSelectedFile(file);
    setModalVisible(true);
    setIframeError(false);
  };

  const handleIframeError = () => {
    setIframeError(true);
  };

  const downloadFile = (file: UserReviewAttachmentsResource) => {
    const link = document.createElement("a");
    link.href = file.fileUrl || "";
    link.download = file.fileName || "download";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderModalContent = () => {
    if (!selectedFile) return null;

    const fileName = selectedFile?.fileName || "";
    const fileUrl = selectedFile?.fileUrl || "";

    // Display images directly
    if (isImageFile(fileName)) {
      return (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Image
            src={fileUrl}
            alt={fileName}
            style={{ maxWidth: "100%", maxHeight: "500px" }}
          />
        </div>
      );
    }

    // Display files in iframe
    if (canDisplayInIframe(fileName) && !iframeError) {
      return (
        <div style={{ textAlign: "center", padding: "10px" }}>
          <iframe
            src={`${fileUrl}#view=FitH&navpanes=0&pagemode=none&zoom=page-width`}
            title={fileName}
            width="100%"
            height="500px"
            style={{ border: "1px solid #d9d9d9", borderRadius: "4px" }}
            onError={handleIframeError}
            onLoad={(e) => {
              try {
                const iframe = e.target as HTMLIFrameElement;
                if (!iframe?.contentDocument && !iframe?.contentWindow) {
                  handleIframeError();
                }
              } catch (error) {
                handleIframeError();
              }
            }}
          />
          {iframeError && (
            <div style={{ marginTop: "10px", textAlign: "center" }}>
              <Typography.Text type="secondary">
                Không thể xem trước file này.
              </Typography.Text>
            </div>
          )}
        </div>
      );
    }

    // Fallback: Display file info and download button
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <div
          style={{ fontSize: "48px", marginBottom: "16px", color: "#8c8c8c" }}
        >
          📄
        </div>

        <Typography.Title level={4} style={{ marginBottom: "8px" }}>
          {fileName}
        </Typography.Title>

        <Typography.Text
          type="secondary"
          style={{ display: "block", marginBottom: "20px" }}
        >
          Không thể xem trước file này
        </Typography.Text>

        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={() => downloadFile(selectedFile)}
        >
          Tải xuống
        </Button>
      </div>
    );
  };


  return (
    <>
      <Row gutter={30} align={"top"}>
        <Col>
          <Image
            preview={false}
            width={64}
            height={64}
            src={reviewData?.user?.avatar || ""}
            fallback={Images.ACCOUNT_DEFAULT}
            alt="User review avatar"
            className="partnerAvatar"
          />
        </Col>
        <Col flex="auto">
          <Space direction="vertical" size={12} className="full-width">
            <Space direction="vertical" size={6} className="full-width">
              <Typography.Title level={5} className={"fullName nm-typo"}>
                {reviewData?.user?.name}
              </Typography.Title>

              <Typography.Text className="font-bold">
                {reviewData?.project_name || reviewData?.project?.name} -{" "}
                {projectStatus(reviewData?.project_status)}
              </Typography.Text>

              <Space size={0}>
                <Rate
                  style={{ fontSize: "16px" }}
                  disabled={true}
                  value={reviewData?.rate}
                />

                <Divider type={"vertical"} style={{ borderColor: "#D4D4D4" }} />

                <Typography.Paragraph className={"time nm-typo"}>
                  {datetimeUtils
                    .getMoment(reviewData?.created_at)
                    ?.format(datetimeUtils.LOCAL_DATE)}
                </Typography.Paragraph>
              </Space>
            </Space>

            <Typography.Paragraph className={"description nm-typo"}>
              {reviewData?.description}
            </Typography.Paragraph>

            <div>
              {
                // renderAttachments()
                <AttachmentsPreview
                  attachments={reviewData?.user_review_attachments}
                  // onPreviewFile={(file) => openFileModal(file)} // pdf/docx/other
                />
              }
            </div>
          </Space>
        </Col>
      </Row>

      <Modal
        title={selectedFile?.fileName}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setSelectedFile(null);
          setIframeError(false);
        }}
        footer={[
          <Button key={"close"} onClick={() => setModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={900}
        style={{ top: 20 }}
      >
        {renderModalContent()}
      </Modal>
    </>
  );
}
