import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Alert,
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Input,
  Modal,
  Row,
  Space,
  Typography,
  message,
} from "antd";
import { ModalizeHelperVisible } from "@/src/data/base/models/base.types";
import { JobDetailComponentProps } from "../JobDetailScreen";
import RejectJobResultModal from "../../modals/RejectJobResultModal";
import AgreeJobResultModal from "../../modals/AgreeJobResultModal";
import JobDocuments from "./components/JobDocuments";
import Constants from "@/src/constants/Constants";
import JobHistories from "@/src/screens/JobScreen/JobDetailScreen/parts/components/JobHistories";
import { useBreakpoint } from "@/src/hooks/useBreakpoint";
import useRejectJobResult from "../../hooks/useRejectJobResult";
import { result } from "lodash";
import {
  ConfirmedProjectInfoResource,
  RejectJobResultParams,
} from "@/src/data/job/models/job.types";
import _ from "lodash";
import NumberUtils from "@/src/utils/NumberUtils";
import PriceUtils from "@/src/utils/PriceUtils";
import {
  Star,
  Award,
  MessageCircle,
  TrendingUp,
  BadgeDollarSign,
  Clock,
  ClipboardCheck,
} from "lucide-react";
import { CardHeader, CardTitle, CardContent } from "../components/ui/card";
import Images from "@/src/constants/Images";
import datetimeUtils from "@/src/utils/DatetimeUtils";
import { CancelFlowService } from "@/src/data/cancel/CancelFlow.service";

function JobReview(props: JobDetailComponentProps) {
  const { isDesktop, isMobile } = useBreakpoint();
  const agreeResultModalRef = useRef<ModalizeHelperVisible>(null);
  const rejectResultModalRef = useRef<ModalizeHelperVisible>(null);

  const { jobQuery, isPartner, isCreated } = props;
  const fullJobResource = jobQuery.data;

  const [fileStatuses, setFileStatuses] = useState<Record<number, number>>({});
  const [complaintLoading, setComplaintLoading] = useState<boolean>(false);

  const rejectMutation = useRejectJobResult(fullJobResource!?.jobId, {
    onSuccess: async () => {
      setFileStatuses({});
    },
  });

  const [payLoading, setPayLoading] = useState(false);

  const [paymentInfo, setPaymentInfo] = useState<{
    visible: boolean;
    complaintId?: number;
    feeId?: number;
    feeAmount?: number;
    message?: string;
  }>({ visible: false });

  const [transactionId, setTransactionId] = useState<string>("");

  const handleFileStatusChange = useCallback(
    (resultId: number, status: number) => {
      setFileStatuses((prev) => ({
        ...prev,
        [resultId]: status,
      }));
    },
    []
  );

  // check files status to enable/disable buttons
  const buttonStates = useMemo(() => {
    const results = fullJobResource?.results || [];

    if (results.length === 0) {
      return {
        canApprove: false,
        canReject: false,
        reason: "Không có dữ liệu",
      };
    }

    // check files
    let hasUncheckedFiles = false;
    let hasRejectFiles = false;
    let hasApprovedFiles = false;

    results.forEach((result) => {
      const currentStatus =
        fileStatuses[result.resultId] !== undefined
          ? fileStatuses[result.resultId]
          : result.status;

      switch (currentStatus) {
        case 0:
          hasUncheckedFiles = true;
          break;
        case 1:
          hasApprovedFiles = true;
          break;
        case 2:
          hasRejectFiles = true;
          break;
      }
    });

    // disable buttons
    if (hasUncheckedFiles) {
      return {
        canApprove: false,
        canReject: false,
        reason: `Vui lòng kiểm tra kỹ và lựa chọn "Chấp nhận" hoặc "Cần chỉnh sửa" từng tài liệu/sản phẩm được bàn giao. Sau khi kiểm tra toàn bộ tài liệu/sản phẩm, hãy lựa chọn "Đồng ý nghiệm thu" hoặc "Từ chối nghiệm thu" công việc để phản hồi cho Đối tác.`,
      };
    }

    if (hasRejectFiles) {
      return {
        canApprove: false,
        canReject: true,
        reason: "Có kết quả cần chỉnh sửa, không thể đồng ý nghiệm thu",
      };
    }

    if (hasApprovedFiles && !hasRejectFiles && !hasUncheckedFiles) {
      return {
        canApprove: true,
        canReject: false,
        reason: "Tất cả kết quả đã có thể được đồng ý",
      };
    }

    return {
      canApprove: false,
      canReject: false,
      reason: "Trạng thái không hợp lệ",
    };
  }, [fileStatuses, fullJobResource?.results]);

  const handleRejectResult = (description: string) => {
    const resultJobFiles =
      fullJobResource?.results.map((result) => {
        const localStatus = fileStatuses[result.resultId];
        return {
          id: result.resultId,
          status: localStatus !== undefined ? localStatus : result.status,
        };
      }) || [];

    const params: RejectJobResultParams = {
      description,
      result_job_file: resultJobFiles,
    };

    rejectMutation.mutate(params);
  };

  const overNumberAccept =
    (fullJobResource?.histories?.length || 0) -
    (fullJobResource?.numberAccept || 0);

  const clientInfo = fullJobResource?.userCreatedProject;
  let confirmedInfo: ConfirmedProjectInfoResource | null = null;
  try {
    if (fullJobResource?.confirmInfo) {
      confirmedInfo = JSON.parse(fullJobResource.confirmInfo);
    }
  } catch (error) {
    console.error("Error parsing confirmInfo:", error);
  }
  const partnerInfo = fullJobResource?.isApply;

  const handleFileAcceptanceComplaint = async () => {
    if (!fullJobResource) return;

    try {
      setComplaintLoading(true);
      const service = new CancelFlowService();

      // 2.2 – tạo khiếu nại nghiệm thu
      const res = await service.fileAcceptanceComplaint(fullJobResource.jobId, {
        description: "Kết quả không đúng yêu cầu trong hợp đồng",
        attachments: [], // TODO: sau này gắn list file đính kèm thực tế
      });

      if (!res.success) {
        message.error(res.message || "Nộp khiếu nại thất bại");
        return;
      }

      // hiển thị thông tin thanh toán
      message.success(res.message || "Khiếu nại đã được tạo");

      setPaymentInfo({
        visible: true,
        complaintId: res.complaint_id,
        feeId: res.fee_id,
        feeAmount: res.fee_amount,
        message: res.message,
      });

      // auto gợi ý 1 transaction id, user có thể sửa
      setTransactionId(`TXN-${Date.now()}`);
    } catch (err: any) {
      console.error(err);
      message.error(err?.message || "Có lỗi xảy ra khi gửi khiếu nại");
    } finally {
      setComplaintLoading(false);
    }
  };

  const handleConfirmPayFee = async () => {
    if (!paymentInfo.feeId) return;

    try {
      setPayLoading(true);
      const service = new CancelFlowService();

      const txId = transactionId?.trim() || `TXN-${Date.now()}`;

      const res = await service.payFee(paymentInfo.feeId, {
        transaction_id: txId,
      });

      if (res.success) {
        message.success(res.message || "Thanh toán phí khiếu nại thành công");
        setPaymentInfo((prev) => ({ ...prev, visible: false }));
        // nếu cần reload job:
        // await jobQuery.refetch();
      } else {
        // ví dụ: "Phí đã được thanh toán"
        message.warning(res.message || "Không thể thanh toán phí khiếu nại");
      }
    } catch (err: any) {
      message.error(err?.message || "Có lỗi xảy ra khi thanh toán phí");
    } finally {
      setPayLoading(false);
    }
  };

  return (
    <div>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <div className={"jobPartContainer"}>
            <Row
              gutter={[24, 24]}
              align={"middle"}
              justify={"space-between"}
              className={"jobPartTitleContainer"}
            >
              <Col>
                <div className="jobPartTitle">Kết quả công việc gần nhất </div>
                <div
                  style={{
                    ...(!isMobile
                      ? {}
                      : { marginTop: "8px", marginBottom: "8px" }),
                  }}
                >
                  <Typography.Text>
                    (Số lần nghiệm thu còn lại:{" "}
                    {Math.max(0, fullJobResource?.numberAcceptRemaining || 0)})
                  </Typography.Text>
                </div>
                <div>
                  {(fullJobResource?.numberAcceptRemaining ?? 0) <= 0 && (
                    <Alert
                      message={
                        <>
                          Bạn vẫn có thể duyệt kết quả.
                          <br />
                          {overNumberAccept > 0 && (
                            <span>
                              {" "}
                              Số lần nghiệm thu đã vượt quá{" "}
                              <b>{overNumberAccept} lần</b>.
                            </span>
                          )}
                        </>
                      }
                      type="warning"
                    />
                  )}
                </div>
              </Col>
              <Col>
                {/* {isCreated &&
                  [
                    Constants.JOB.STATUS.CHO_NGHIEM_THU,
                    Constants.JOB.STATUS.DA_NGHIEM_THU,
                  ].includes(fullJobResource!?.status) && (
                    <Button
                      type="primary"
                      loading={complaintLoading}
                      danger
                      onClick={handleFileAcceptanceComplaint}
                    >
                      Khiếu nại nghiệm thu
                    </Button>
                  )} */}
              </Col>
            </Row>

            <div className="jobPartContent">
              <JobDocuments
                {...props}
                job={fullJobResource!}
                data={
                  [
                    Constants.JOB.STATUS.CHO_NGHIEM_THU,
                    Constants.JOB.STATUS.DA_NGHIEM_THU,
                    Constants.JOB.STATUS.CHO_TAT_TOAN,
                    Constants.JOB.STATUS.THANH_TOAN_PARTNER,
                    Constants.JOB.STATUS.DUYET_HOAN_THANH_CV,
                  ].includes(fullJobResource!?.status)
                    ? fullJobResource!?.results
                    : []
                }
                loading={jobQuery.isFetching}
                canDownload={true}
                canEdit={false}
                canDelete={false}
                onStatusChange={handleFileStatusChange}
              />

              <Row gutter={[16, 16]} style={{ marginTop: 15 }}>
                {isCreated &&
                  [Constants.JOB.STATUS.CHO_NGHIEM_THU].includes(
                    fullJobResource!?.status
                  ) && (
                    <>
                      <Col xs={24} md={12} lg={14} xl={16}>
                        <div style={{ textAlign: "left" }}>
                          {!buttonStates.canApprove &&
                            !buttonStates.canReject && (
                              <Alert
                                message={buttonStates.reason}
                                type="info"
                                showIcon
                                style={{ marginBottom: 0 }}
                              />
                            )}

                          {!buttonStates.canApprove &&
                            buttonStates.canReject && (
                              <Alert
                                message={buttonStates.reason}
                                type="warning"
                                showIcon
                                style={{ marginBottom: 0 }}
                              />
                            )}
                        </div>
                      </Col>

                      <Col xs={24} md={12} lg={10} xl={8}>
                        <div style={{ textAlign: "right" }}>
                          <Space
                            size="middle"
                            direction={"vertical"}
                            style={{ width: !isDesktop ? "100%" : "auto" }}
                          >
                            <Button
                              type={"default"}
                              onClick={() =>
                                agreeResultModalRef.current?.open()
                              }
                              block={!isDesktop}
                              disabled={!buttonStates.canApprove}
                            >
                              Đồng ý nghiệm thu
                            </Button>

                            <Button
                              type="primary"
                              onClick={() =>
                                rejectResultModalRef.current?.open()
                              }
                              block={!isDesktop}
                              disabled={
                                !buttonStates.canReject ||
                                rejectMutation.isPending
                              }
                              loading={rejectMutation.isPending}
                            >
                              Từ chối nghiệm thu
                            </Button>
                          </Space>
                        </div>
                      </Col>
                    </>
                  )}
              </Row>
            </div>
          </div>

          {!_.isEmpty(fullJobResource?.histories) && (
            <div className={"jobPartContainer"}>
              <div className={"jobPartTitleContainer"}>
                <div className="jobPartTitle">Lịch sử nghiệm thu</div>
              </div>

              <div className="jobPartContent">
                <JobHistories job={fullJobResource!} />
              </div>
            </div>
          )}
        </Col>

        <Col xs={24} lg={8}>
          <Card
            style={{
              borderRadius: 8,
              overflow: "hidden",
              marginTop: 40,
            }}
          >
            {/* Partner info */}
            <CardHeader>
              <CardTitle
                style={{
                  color: "#000",
                  fontSize: 18,
                  fontWeight: 600,
                  paddingBottom: 5,
                }}
              >
                Đối Tác đang thực hiện
              </CardTitle>
            </CardHeader>

            <CardContent
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid #e5e7eb",
                }}
              />

              {/* Company */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    backgroundColor: "#09993E20",
                    borderRadius: 9999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Avatar
                    src={partnerInfo?.user?.avatarUrl || Images.ACCOUNT_DEFAULT}
                    size={"large"}
                    alt={"avatar"}
                    className={"customerAvatar"}
                    style={{
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div>
                  <p style={{ fontWeight: 500, color: "#000" }}>
                    {partnerInfo?.user?.fullName || "N/A"}
                  </p>
                </div>
              </div>

              {/* Rating */}
              {/* {clientInfo?.userReview.avgRate! > 0 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        style={{
                          width: 20,
                          height: 20,
                          fill:
                            star <= clientInfo?.userReview.avgRate!
                              ? "#facc15"
                              : "none",
                          color:
                            star <= clientInfo?.userReview.avgRate!
                              ? "#facc15"
                              : "#d1d5db",
                        }}
                      />
                    ))}
                  </div>
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      color: "#000",
                    }}
                  >
                    {NumberUtils.display(clientInfo?.userReview.avgRate)}
                  </span>
                  <span style={{ fontSize: 14, color: "#666" }}>
                    ({clientInfo?.userReview.total} đánh giá)
                  </span>
                </div>
              )} */}

              {/* Progressing time */}
              {(confirmedInfo?.Project.start_date! && confirmedInfo.Project.end_date!) && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <Clock style={{ width: 20, height: 20, color: "#09993E" }} />
                  <div>
                    <p style={{ fontWeight: 500, color: "#000" }}>
                      Thời gian thực hiện
                    </p>
                    <p
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        color: "#09993E",
                      }}
                    >
                      {datetimeUtils
                        .getMoment(confirmedInfo?.Project.start_date || "")
                        ?.format(datetimeUtils.LOCAL_DATE)}{" "}
                      -{" "}
                      {datetimeUtils
                        .getMoment(confirmedInfo?.Project.end_date || "")
                        ?.format(datetimeUtils.LOCAL_DATE)}
                    </p>
                  </div>
                </div>
              )}

              {/* Price */}
              {confirmedInfo?.Project.price !== null && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <BadgeDollarSign
                    style={{ width: 20, height: 20, color: "#0ea5e9" }}
                  />
                  <div>
                    <p style={{ fontWeight: 500, color: "#000" }}>
                      Giá đã xác nhận
                    </p>
                    <p style={{ color: "#0ea5e9" }}>
                      {PriceUtils.displayVND(confirmedInfo?.Project.price)}
                    </p>
                  </div>
                </div>
              )}

              {/* Number accept */}
              {confirmedInfo?.Project.number_accept! > 0 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <ClipboardCheck
                    style={{ width: 20, height: 20, color: "#f97316" }}
                  />
                  <div>
                    <p style={{ fontWeight: 500, color: "#000" }}>
                      Số lần nghiệm thu đã xác nhận
                    </p>
                    <p
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        color: "#f97316",
                      }}
                    >
                      {confirmedInfo?.Project.number_accept}
                    </p>
                  </div>
                </div>
              )}

              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid #e5e7eb",
                }}
              />
            </CardContent>
          </Card>
        </Col>
      </Row>
      <Modal
        open={paymentInfo.visible}
        title="Thanh toán phí khiếu nại"
        onCancel={() => setPaymentInfo((prev) => ({ ...prev, visible: false }))}
        onOk={handleConfirmPayFee}
        confirmLoading={payLoading}
        okText="Đồng ý thanh toán"
        cancelText="Đóng"
      >
        <Typography.Paragraph>
          {paymentInfo.message ||
            "Khiếu nại đã được tạo. Vui lòng thanh toán phí để hệ thống bắt đầu xử lý."}
        </Typography.Paragraph>

        <Descriptions column={1} size="small" bordered>
          <Descriptions.Item label="Mã khiếu nại">
            {paymentInfo.complaintId}
          </Descriptions.Item>
          <Descriptions.Item label="Mã phí">
            {paymentInfo.feeId}
          </Descriptions.Item>
          <Descriptions.Item label="Số tiền">
            {PriceUtils.displayVND(paymentInfo.feeAmount || 0)}
          </Descriptions.Item>
        </Descriptions>

        <div style={{ marginTop: 16 }}>
          <Typography.Text>Mã giao dịch (transaction_id)</Typography.Text>
          <Input
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="Nhập mã giao dịch (nếu có)"
          />
        </div>
      </Modal>

      <>
        <AgreeJobResultModal
          ref={agreeResultModalRef}
          data={fullJobResource!}
          onRefetch={jobQuery.refetch}
        />

        <RejectJobResultModal
          ref={rejectResultModalRef}
          onSubmit={handleRejectResult}
          data={fullJobResource!}
          onRefetch={jobQuery.refetch}
        />
      </>
    </div>
  );
}

export default JobReview;
