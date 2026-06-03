import React, { useRef, useMemo } from "react";
import { Alert, Avatar, Button, Card, Col, Modal, Row, Space, Typography } from "antd";
import { CheckCircleOutlined, UploadOutlined } from "@ant-design/icons";
import UploadDocumentModal, {
  JobDocumentModalizeHelperVisible,
} from "../../modals/UploadDocumentModal";
import {
  FullJobResource,
  JobResultResource,
} from "@/src/data/job/models/job.types";
import { JobDetailComponentProps } from "../JobDetailScreen";
import useJobSendResult from "../hooks/useJobSendResult";
import JobDocuments from "./components/JobDocuments";
import dialogUtils from "@/src/utils/DialogUtils";
import _ from "lodash";
import Constants from "@/src/constants/Constants";
import JobHistories from "@/src/screens/JobScreen/JobDetailScreen/parts/components/JobHistories";
import { withThemeRevert } from "@/theme";
import { useBreakpoint } from "@/src/hooks/useBreakpoint";
import { CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Star, Award, MessageCircle, TrendingUp } from "lucide-react";
import Images from "@/src/constants/Images";
import NumberUtils from "@/src/utils/NumberUtils";
import PriceUtils from "@/src/utils/PriceUtils";

function JobReport(props: JobDetailComponentProps) {
  const { isDesktop } = useBreakpoint();

  const uploadDocumentModalRef = useRef<JobDocumentModalizeHelperVisible>(null);

  const { jobQuery, isPartner, setStepName } = props;
  const fullJobResource: FullJobResource | undefined = jobQuery.data;
  const sendResultMutation = useJobSendResult(fullJobResource!?.jobId, {
    // onSuccess: () => setStepName(Constants.JOB.TAB.JOB_REVIEW),
    onSuccess: async () => {
      await jobQuery.refetch?.();
    },
  });

  function onDocumentEdit(resultResource: JobResultResource) {
    uploadDocumentModalRef.current?.open(resultResource);
  }

  const canNotEditOrDeleteDocument = useMemo(() => {
    return (
      fullJobResource?.status === Constants.JOB.STATUS.DA_NGHIEM_THU ||
      fullJobResource?.status === Constants.JOB.STATUS.DUYET_HOAN_THANH_CV ||
      fullJobResource?.status === Constants.JOB.STATUS.CANCELED
    );
  }, [fullJobResource]);

  // Create a derived query result with correct type for UploadDocumentModal
  const definedJobQuery = {
    ...jobQuery,
    data: fullJobResource!,
  } as any; // as DefinedUseQueryResult<FullJobResource>

  const overNumberAccept =
    (fullJobResource?.histories?.length || 0) -
    (fullJobResource?.numberAccept || 0);

  const clientInfo = fullJobResource?.userCreatedProject;

  return (
    <div>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <div className={"jobPartContainer"}>
            {isPartner &&
              [Constants.JOB.STATUS.CHO_NGHIEM_THU].includes(
                fullJobResource!?.status
              ) && (
                <Alert
                  showIcon={true}
                  type={"success"}
                  message={"Bạn đã gửi kết quả công việc."}
                  description={
                    "Gửi kết quả công việc thành công. Vui lòng chờ phản hồi từ khách hàng"
                  }
                  className={"jobAlertReport"}
                />
              )}
            <Row
              gutter={[24, 24]}
              align={"middle"}
              justify={"space-between"}
              className={"jobPartTitleContainer"}
            >
              <Col>
                <div className="jobPartTitle">Kết quả công việc gần nhất</div>
                <div>
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
                          Bạn vẫn có thể gửi kết quả nghiệm thu, số lần đã vượt quá <b>{overNumberAccept} lần</b>.
                          <br />
                          Đảm bảo bạn đã kiểm tra trước khi gửi cho khách hàng.
                        </>
                      }
                      type="warning"
                    />
                  )}
                </div>
              </Col>

              {isPartner &&
                [Constants.JOB.STATUS.DA_KY_HOP_DONG].includes(
                  fullJobResource!?.status
                ) && (
                  <Col flex={!isDesktop ? 1 : 0}>
                    <Alert
                      message={"Bấm nút 'Gửi kết quả' để khách hàng có thể xem"}
                      type="info"
                      style={{ marginBottom: "10px" }}
                    />
                    
                    <Space
                      size={"middle"}
                      direction={!isDesktop ? "vertical" : "horizontal"}
                      className={"d-flex"}
                    >
                      <Button
                        icon={<UploadOutlined />}
                        onClick={() => uploadDocumentModalRef.current?.open(null)}
                        block
                      >
                        Tải lên tài liệu
                      </Button>
                      {withThemeRevert(
                        <Button
                          icon={<CheckCircleOutlined />}
                          type={"primary"}
                          disabled={
                            sendResultMutation.isPending ||
                            _.isEmpty(fullJobResource?.results)
                          }
                          // onClick={() =>
                          //     dialogUtils
                          //         .showConfirmDialog('Bạn có chắc muốn gửi kết quả')
                          //         .then(() => sendResultMutation.mutate())
                          // }
                          onClick={() => {
                            Modal.confirm({
                              title: "Xác nhận",
                              content: "Lưu ý: Tài liệu, sản phẩm nghiệm thu sẽ không thể thu hồi hay điều chỉnh sau khi Khách hàng đã xem hoặc tải về.",
                              okText: "Gửi",
                              cancelText: "Hủy",
                              onOk: () => {
                                sendResultMutation.mutate();
                              },
                            });
                          }}
                          block
                        >
                          Gửi kết quả
                        </Button>
                      )}
                    </Space>
                  </Col>
                )}
            </Row>

            <div className="jobPartContent">
              <JobDocuments
                {...props}
                job={fullJobResource!}
                data={fullJobResource!?.results}
                loading={jobQuery.isFetching}
                canDownload={true}
                canEdit={!canNotEditOrDeleteDocument}
                canDelete={!canNotEditOrDeleteDocument}
                onEdit={onDocumentEdit}
              />
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
            <CardHeader>
              <CardTitle
                style={{
                  color: "#000",
                  fontSize: 18,
                  fontWeight: 600,
                  paddingBottom: 5,
                }}
              >
                Thông tin khách hàng
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
                    src={clientInfo?.user.avatar || Images.ACCOUNT_DEFAULT}
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
                    {clientInfo?.user.userName}
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

              {/* Hire Count */}
              {clientInfo?.totalJobs! > 0 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <Award style={{ width: 20, height: 20, color: "#09993E" }} />
                  <div>
                    <p style={{ fontWeight: 500, color: "#000" }}>
                      Số công việc đã thuê thành công
                    </p>
                    <p
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        color: "#09993E",
                      }}
                    >
                      {clientInfo?.totalJobs} công việc
                    </p>
                  </div>
                </div>
              )}

              {/* Response Speed */}
              {clientInfo?.replyChat !== null && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <MessageCircle
                    style={{ width: 20, height: 20, color: "#0ea5e9" }}
                  />
                  <div>
                    <p style={{ fontWeight: 500, color: "#000" }}>
                      Tốc độ phản hồi
                    </p>
                    <p style={{ color: "#000" }}>
                      Trong vòng {clientInfo?.replyChat}
                    </p>
                  </div>
                </div>
              )}

              {/* Total Spent */}
              {clientInfo?.totalSpent.totalSpent! > 0 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <TrendingUp
                    style={{ width: 20, height: 20, color: "#f97316" }}
                  />
                  <div>
                    <p style={{ fontWeight: 500, color: "#000" }}>
                      Tổng tiền chi trên iAgree
                    </p>
                    <p
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        color: "#f97316",
                      }}
                    >
                      {PriceUtils.displayVND(clientInfo?.totalSpent.totalSpent)}
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

      <>
        <UploadDocumentModal
          ref={uploadDocumentModalRef}
          {...props}
          jobQuery={definedJobQuery}
          data={fullJobResource!}
        />
      </>
    </div>
  );
}

export default JobReport;
