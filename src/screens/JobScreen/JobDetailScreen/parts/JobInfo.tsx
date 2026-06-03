import React, { useState } from "react";
import { Col, Row, Space, Typography, Modal, Button } from "antd";
import {
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FileImageOutlined,
  FileOutlined,
  EyeOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import Constants from "@/src/constants/Constants";
import { FullJobResource } from "../../../../data/job/models/job.types";
import { JobDetailComponentProps } from "../JobDetailScreen";
import { JobParseUtils } from "@/src/data/job/utils/JobParseUtils";
import { IconSvgLocal } from "@/src/components/icon-svg-local";

const getFileIconAndColor = (fileName: string) => {
  const fileExtension = fileName.split(".").pop()?.toLowerCase() || "";

  if (fileExtension === "pdf") {
    return { icon: <FilePdfOutlined />, color: "#FF4D4F" };
  } else if (fileExtension === "doc" || fileExtension === "docx") {
    return { icon: <FileWordOutlined />, color: "#1890FF" };
  } else if (fileExtension === "xls" || fileExtension === "xlsx") {
    return { icon: <FileExcelOutlined />, color: "#52C41A" };
  } else if (["jpg", "jpeg", "png", "gif"].includes(fileExtension)) {
    return { icon: <FileImageOutlined />, color: "#FAAD14" };
  } else {
    return { icon: <FileOutlined />, color: "#BFBFBF" };
  }
};

// --- Danh sách các loại tệp có thể xem trước ---
const PREVIEWABLE_EXTENSIONS = [
  "pdf",
  "jpg",
  "jpeg",
  "png",
  "gif",
  "doc",
  "docx",
];

// --- Component chính ---
function JobInfo(props: JobDetailComponentProps) {
  const { jobQuery, isPartner } = props;
  const fullJobResource: FullJobResource | undefined = jobQuery.data;

  // State để quản lý Modal xem trước
  const [previewModal, setPreviewModal] = useState({
    visible: false,
    fileUrl: "",
    fileName: "",
    fileType: "",
  });

  // Tạo danh sách attachments dummy với kích thước tệp và URL được sửa
  // const dummyAttachments = [
  //   {
  //     fileName: "Báo cáo dự án.pdf",
  //     url: "https://file-examples.com/storage/fee48e07fe689cbc9976855/2017/10/file-sample_150kB.pdf",
  //     fileSize: "150kB",
  //   },
  //   {
  //     fileName: "Kế hoạch marketing.docx",
  //     url: "https://file-examples.com/wp-content/storage/2017/02/file-sample_100kB.docx",
  //     fileSize: "100kB",
  //   },
  //   {
  //     fileName: "Dữ liệu kinh doanh Q3.xlsx",
  //     url: "https://file-examples.com/wp-content/storage/2017/02/file_example_XLSX_10.xlsx",
  //     fileSize: "10kB",
  //   },
  //   {
  //     fileName: "Hình ảnh sản phẩm.png",
  //     url: "https://file-examples.com/wp-content/storage/2017/10/file_example_PNG_500kB.png",
  //     fileSize: "500kB",
  //   },
  //   {
  //     fileName: "Tài liệu khác.zip",
  //     url: "https://file-examples.com/wp-content/storage/2017/02/zip_2MB.zip",
  //     fileSize: "2MB",
  //   },
  // ];

  const isShowApply =
    !props.isCreated &&
    [
      Constants.JOB.STATUS.DUYET_DANG_TUYEN,
      Constants.JOB.STATUS.CHO_UNG_TUYEN,
    ].includes(
      fullJobResource?.status !== undefined ? fullJobResource?.status : 0
    );

  // Xử lý sự kiện mở Modal xem trước
  const handlePreview = (url: string, fileName: string) => {
    const fileExtension = fileName.split(".").pop()?.toLowerCase() || "";
    setPreviewModal({
      visible: true,
      fileUrl: url,
      fileName,
      fileType: fileExtension,
    });
  };

  // Xử lý sự kiện tải xuống tệp với Modal xác nhận
  const handleDownload = (url: string, fileName: string) => {
    Modal.confirm({
      title: "Xác nhận tải xuống",
      content: `Bạn có chắc chắn muốn tải tệp "${fileName}" xuống không?`,
      okText: "Tải xuống",
      cancelText: "Hủy",
      onOk() {
        window.open(url, "_blank");
      },
    });
  };

  // Render nội dung xem trước dựa trên loại tệp
  const renderPreviewContent = () => {
    if (["pdf", "doc", "docx"].includes(previewModal.fileType)) {
      const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(
        previewModal.fileUrl
      )}&embedded=true`;
      return (
        <iframe
          src={googleViewerUrl}
          width="100%"
          height="100%"
          style={{ border: "none", minHeight: "60vh" }}
          title={previewModal.fileName}
        />
      );
    } else if (["jpg", "jpeg", "png", "gif"].includes(previewModal.fileType)) {
      return (
        <div style={{ textAlign: "center" }}>
          <img
            src={previewModal.fileUrl}
            alt={previewModal.fileName}
            style={{ maxWidth: "100%", maxHeight: "70vh" }}
          />
        </div>
      );
    }
    return <Typography.Text>Không thể xem trước tệp này.</Typography.Text>;
  };

  let jobDurationType = "";
  if (fullJobResource?.jobDurationType === Constants.JOB.DURATION_TYPE.DAYS) {
    jobDurationType = "Ngày";
  } else if (
    fullJobResource?.jobDurationType === Constants.JOB.DURATION_TYPE.WEEKS
  ) {
    jobDurationType = "Tuần";
  } else if (
    fullJobResource?.jobDurationType === Constants.JOB.DURATION_TYPE.MONTHS
  ) {
    jobDurationType = "Tháng";
  }
  const jobDuration = `${fullJobResource?.duration} ${jobDurationType}`;

  return (
    <div>
      <div style={{ marginTop: 24 }} className={""}>
        <div className="jobPartTitleContainer" style={{ marginBottom: 20 }}>
          <div className="jobPartTitle">
            Số lần nghiệm thu: {fullJobResource?.numberAccept}
          </div>
        </div>

        {fullJobResource?.deliverableAttachments && (
          <div style={{ display: "flex", gap: "4px" }}>
            <div className="jobPartTitle">Sản phẩm đầu ra mong muốn:</div>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "normal",
                letterSpacing: "-0.176px",
                // marginBottom: "40px",
                color: "gray",
              }}
              dangerouslySetInnerHTML={{
                __html: fullJobResource?.deliverableAttachments || "",
              }}
            />
          </div>
        )}

        {fullJobResource?.projectAttachmentFiles &&
          fullJobResource.projectAttachmentFiles.length > 0 && (
            <div style={{ marginTop: !fullJobResource?.note ? 20 : 0 }}>
              <div className="jobPartTitleContainer">
                <div className="jobPartTitle">Tệp đính kèm</div>
              </div>
              <div
                style={{
                  marginTop: 20,
                }}
                className="jobPartContentContainer"
              >
                <ul style={{ listStyleType: "none", padding: 0 }}>
                  {fullJobResource?.projectAttachmentFiles?.map(
                    (attachment, index) => {

                      const { icon, color } = getFileIconAndColor(
                        attachment.fileName
                      );
                      const fileExtension =
                        attachment.fileName.split(".").pop()?.toLowerCase() ||
                        "";
                      const canPreview =
                        PREVIEWABLE_EXTENSIONS.includes(fileExtension);

                      return (
                        <li key={index} style={{ marginBottom: 16 }}>
                          <div
                            style={{
                              border: "1px solid #d9d9d9",
                              borderRadius: "8px",
                              paddingInline: "24px",
                              paddingBlock: "16px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Space size={"middle"}>
                              <div style={{ color, fontSize: 24 }}>{icon}</div>
                              <Space
                                direction="vertical"
                                size={0}
                                style={{ marginLeft: 4 }}
                              >
                                <Typography.Text>
                                  {attachment.fileName}
                                </Typography.Text>
                                {/* <Typography.Text
                              type="secondary"
                              style={{ fontSize: 12 }}
                            >
                              {attachment.fileSize}
                            </Typography.Text> */}
                              </Space>
                            </Space>
                            <div>
                              {canPreview && (
                                <EyeOutlined
                                  style={{ marginRight: 20, cursor: "pointer" }}
                                  onClick={() =>
                                    handlePreview(
                                      attachment.fileUrl,
                                      attachment.fileName
                                    )
                                  }
                                />
                              )}
                              <DownloadOutlined
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  handleDownload(
                                    attachment.fileUrl,
                                    attachment.fileName
                                  )
                                }
                              />
                            </div>
                          </div>
                        </li>
                      );
                    }
                  )}
                </ul>
              </div>
            </div>
          )}
      </div>

      {/* --- Phần Tệp đính kèm --- */}

      {/* Modal xem trước tệp */}
      <Modal
        title={previewModal.fileName}
        open={previewModal.visible}
        onCancel={() => setPreviewModal({ ...previewModal, visible: false })}
        footer={null}
        width={800}
        style={{ top: 20 }}
      >
        {renderPreviewContent()}
      </Modal>

      {/* <div className={"jobPartContainer"}>
        <div className="jobPartTitleContainer">
          <div className="jobPartTitle">Thông tin chung</div>
        </div>

        <div className="jobPartContentContainer">
          <Row
            gutter={[24, 24]}
            justify={"space-between"}
            style={{ paddingTop: "8px" }}
          >
            <Col span={isShowApply ? 12 : "none"}>
              <Space size={"middle"} align={"center"}>
                <div className={"iconWrapper"}>
                  <IconSvgLocal name={"IC_BAG"} width={24} height={24} />
                </div>
                <div>
                  <Typography.Paragraph className={"infoTitle"}>
                    Lĩnh vực
                  </Typography.Paragraph>
                  <Typography.Paragraph className={"infoContent"}>
                    {fullJobResource?.categories
                      ?.map((item) => item.name)
                      .join(", ")}
                  </Typography.Paragraph>
                </div>
              </Space>
            </Col>

            <Col span={isShowApply ? 12 : "none"}>
              <Space size={"middle"} align={"center"}>
                <div className={"iconWrapper"}>
                  <IconSvgLocal name={"IC_MONEY_BAG"} width={24} height={24} />
                </div>
                <div>
                  <Typography.Paragraph className={"infoTitle"}>
                    Thù lao công việc
                  </Typography.Paragraph>
                  <Typography.Paragraph className={"infoContent"}>
                    {fullJobResource
                      ? JobParseUtils.renderSalaryText(fullJobResource)
                      : "..."}
                  </Typography.Paragraph>
                </div>
              </Space>
            </Col>

            <Col span={isShowApply ? 12 : "none"}>
              <Space size={"middle"} align={"center"}>
                <div className={"iconWrapper"}>
                  <IconSvgLocal
                    name={"IC_CALENDAR"}
                    fill={"none"}
                    stroke={"#25272D"}
                    width={24}
                    height={24}
                  />
                </div>
                <div>
                  <Typography.Paragraph className={"infoTitle"}>
                    Thời gian thực hiện công việc
                  </Typography.Paragraph>
                  <Typography.Paragraph className={"infoContent"}>
                    {jobDuration}
                  </Typography.Paragraph>
                </div>
              </Space>
            </Col>

            <Col span={isShowApply ? 12 : "none"}>
              <Space size={"middle"} align={"center"}>
                <div className={"iconWrapper"}>
                  <IconSvgLocal
                    name={"IC_CLOCK"}
                    fill={"none"}
                    stroke={"#25272D"}
                    width={24}
                    height={24}
                  />
                </div>
                <div>
                  <Typography.Paragraph className={"infoTitle"}>
                    Thời hạn ứng tuyển
                  </Typography.Paragraph>
                  <Typography.Paragraph className={"infoContent"}>
                    {fullJobResource?.postingEndDate || "Không xác định"}
                  </Typography.Paragraph>
                </div>
              </Space>
            </Col>
          </Row>
        </div>
      </div> */}
      {/* {isPartner && (
        <div className={"jobPartContainer"}>
          <div className="jobPartTitleContainer">
            <div className="jobPartTitle">Thông tin ứng tuyển</div>
          </div>

          <div className="jobPartContentContainer">
            <Row>
              <Col span={12}>
                <Typography.Paragraph className={"infoTitle"}>
                  Giá đề xuất
                </Typography.Paragraph>
                <Typography.Paragraph
                  className={"infoContent"}
                ></Typography.Paragraph>
              </Col>
              <Col span={12}>
                <Typography.Paragraph className={"infoTitle"}>
                  Đề xuất
                </Typography.Paragraph>
                <Typography.Paragraph className={"infoContent"}>
                  {fullJobResource?.endDate}
                </Typography.Paragraph>
              </Col>
            </Row>
          </div>
        </div>
      )} */}
    </div>
  );
}

export default JobInfo;
