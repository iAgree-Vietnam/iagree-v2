import React, {
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import {
  Button,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Rate,
  Row,
  Select,
  Typography,
  Upload,
} from "antd";
import { FullJobResource } from "../../../data/job/models/job.types";
import useAgreeJobResult from "../hooks/useAgreeJobResult";
import { withThemeRevert } from "@/theme";
import { UploadOutlined } from "@ant-design/icons";
import Constants from "@/src/constants/Constants";
import type { UploadFile } from "antd/lib/upload/interface";
import { includes } from "lodash";
import {
  ApiResponse,
  CancelFlowService,
  CancellationInfo,
} from "@/src/data/cancel/CancelFlow.service";
import datetimeUtils from "@/src/utils/DatetimeUtils";

const { Text } = Typography;

export enum UserRoleEnum {
  PARTNER = "partner",
  CUSTOMER = "customer",
}

type CancelJobModalProps = {
  data: FullJobResource;
  onRefetch?: () => Promise<any>;
  step: number;
  reason?: string;
  dataSttCancel?: CancellationInfo;
  userRole: UserRoleEnum.CUSTOMER | UserRoleEnum.PARTNER;
  refetch?: () => void;
};

export type CancelJobFormValues = {
  /** * Lý do hủy công việc.
   * REQUIRED theo rules của Ant Design Form.
   */
  description: string;

  /**
   * Danh sách các tệp đính kèm được tải lên.
   * Optional vì người dùng có thể không đính kèm tệp.
   */
  attachment_files?: UploadFile[];

  /** * Giá trị thanh lý (số tiền hoặc phần trăm).
   * Optional (chỉ hiển thị khi step > 2)
   */
  settlement_value?: string;

  /** * Loại giá trị thanh lý: "%" hoặc "VND".
   * Optional (có initialValue là "%")
   */
  settlement_type?: "%" | "VND";

  /** * Điểm đánh giá chất lượng công việc (từ 1 đến 5).
   * Optional (chỉ hiển thị khi shouldDisplayRateForm() là true)
   */
  rate?: number;
};

const CancelJobModal = React.forwardRef((props: CancelJobModalProps, ref) => {
  const [form] = Form.useForm();
  const [isOpen, setOpen] = useState(false);
  const step = props?.step;
  const reason = props?.reason;
  const userRole = props.userRole || UserRoleEnum.CUSTOMER;
  const projectInfo = useMemo(
    () => props?.dataSttCancel,
    [JSON.stringify(props?.dataSttCancel)]
  );

  const can_cancel_before_execution = projectInfo?.can_cancel_before_execution;
  const can_quick_cancel = projectInfo?.can_quick_cancel;
  const can_request_cancellation = projectInfo?.can_request_cancellation;
  const can_file_acceptance_complaint =
    projectInfo?.can_file_acceptance_complaint;
  const has_pending_cancellation = projectInfo?.has_pending_cancellation;
  const has_pending_complaint = projectInfo?.has_pending_complaint;

  // 🕒 Các mốc thời gian / Deadlines
  const hours_since_start = projectInfo?.hours_since_start;
  const days_since_delivery = projectInfo?.days_since_delivery;
  const started_at = projectInfo?.started_at;
  const delivered_at = projectInfo?.delivered_at;
  const quick_cancel_deadline = projectInfo?.quick_cancel_deadline;
  const acceptance_complaint_deadline =
    projectInfo?.acceptance_complaint_deadline;

  // ✨ Gợi ý hành động
  const suggested_action = projectInfo?.suggested_action; // 1. Phân tích cú pháp ngày tạo

  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);

  useImperativeHandle(
    ref,
    useCallback(() => ({ open, close }), [open, close])
  );

  const fullJobResource = props.data;

  const handleBeforeUpload = (file: File) => {
    const maxFileSize = Constants.MAX_FILE_SIZE;

    const currentFiles: UploadFile[] =
      form.getFieldValue("attachment_files") || [];

    const isDuplicate = currentFiles.some(
      (existingFile) =>
        existingFile.name === file.name && existingFile.size === file.size
    );

    if (isDuplicate) {
      message.warning(`Tệp ${file.name} đã tồn tại!`);
      return Upload.LIST_IGNORE;
    }

    if (file.size > maxFileSize) {
      message.error(
        `File ${file.name} vượt quá ${maxFileSize / 1024 / 1024} MB`
      );
      return Upload.LIST_IGNORE;
    }

    const updatedFiles = [...currentFiles, file];
    form.setFieldValue("attachment_files", updatedFiles);

    return false;
  };

  const maxLength = Constants.TEXT_MAX_LENGTH;
  const description = Form.useWatch("description", form);
  const currentDescriptionLength = description ? description.length : 0;
  const cancelFlowService = new CancelFlowService();
  // Check if rate form should be displayed for DA_KY_HOP_DONG status
  const shouldDisplayRateForm = () => {
    if (fullJobResource.status !== Constants.JOB.STATUS.DA_KY_HOP_DONG) {
      return false;
    }

    const startDate = fullJobResource.startDate;
    const endDate = fullJobResource.endDate;

    if (!startDate || !endDate) {
      return false;
    }

    // Parse DD/MM/YYYY format
    const parseDateDDMMYYYY = (dateString: any) => {
      const [day, month, year] = dateString.split("/");
      // Month is 0-indexed in JavaScript Date (0 = January, 11 = December)
      return new Date(year, month - 1, day);
    };

    const start = parseDateDDMMYYYY(startDate);
    const end = parseDateDDMMYYYY(endDate);

    const currentDate = new Date();

    // Calculate total duration between startDate and endDate
    const totalDuration = end.getTime() - start.getTime();

    // Calculate elapsed time from startDate to currentDate
    const elapsedTime = currentDate.getTime() - start.getTime();

    // Calculate 25% of total duration
    const quarterDuration = totalDuration * 0.25;

    // If elapsed time is greater than 25% of duration -> show rate form
    return elapsedTime > quarterDuration;
  };
  const [isLoading, setIsLoading] = useState(false);
  const isOver24Hours = datetimeUtils.isTimeExceeds(24, hours_since_start);
  const step1 = can_cancel_before_execution;

  const step3 = !isOver24Hours && can_request_cancellation;
  // step gửi hủy & thương lượng
  const step2 = isOver24Hours && can_request_cancellation;

  return (
    <Modal
      title={"Hủy công việc"}
      open={isOpen}
      className={"agreeJobModalContainer"}
      footer={null}
      onCancel={close}
      width={"672px"}
    >
      <Form
        form={form}
        layout={"vertical"}
        initialValues={{
          rate: null,
          description: null,
        }}
        onFinish={async (formValues) => {
          // Ant Design Form đã truyền dữ liệu đã validate vào formValues
          const value = formValues;
          const reason = value?.description || "Lý do không rõ.";
          setIsLoading(true);

          // 1. Dùng CONST và IIFE để gán giá trị API Call một lần duy nhất
          const apiCall = await (() => {
            // const step1 = can_cancel_before_execution;

            if (step1) {
              // Điều kiện 1: Hủy sớm (Chưa có bids)
              return cancelFlowService.cancelBeforeExecution(
                fullJobResource.jobId,
                { reason }
              );
            }

            if (step2) {
              //   // Điều kiện 2: Hủy trong vòng 24h
              return cancelFlowService.quickCancel(fullJobResource.jobId, {
                reason: form.getFieldsValue()?.description,
                user_role: userRole,
                refund_percentage: form.getFieldsValue()?.settlement_value,
                // reason:form.getFieldsValue()?.description,
              });
            }
            if (step3) {
              //   // Điều kiện 2: Hủy trong vòng 24h
              return cancelFlowService.requestCancellation(
                fullJobResource.jobId,
                {
                  reason: form.getFieldsValue()?.description,
                  user_role: userRole,
                  refund_percentage: form.getFieldsValue()?.settlement_value,
                  // reason:form.getFieldsValue()?.description,
                }
              );
            }

            // Trường hợp mặc định (Step 0 hoặc Step > 2)
            return Promise.resolve("Thao tác mặc định hoàn thành.");

            // Trường hợp bạn muốn đảm bảo mọi path đều trả về Promise:
            // throw new Error("Thao tác không được hỗ trợ.");
          })()
            .then((value: any) => {
              if (value?.success) {
                message.success(value.message);
                if (props.refetch) props.refetch();
              } else {
                message.error(value.message);
              }
              form.resetFields();
            })
            .catch((error) => {

              const errorMessage =
                error?.message || "Đã xảy ra lỗi không xác định từ API.";
              message.error(errorMessage);
            })
            .finally(() => {
              // TẮT LOADING DÙ THÀNH CÔNG HAY THẤT BẠI
              setIsLoading(false);
            }); // Gọi hàm ngay lập tức
        }}
        // Phân
      >
        <Form.Item
          label={"Lý do hủy"}
          name={"description"}
          rules={[
            { required: true, message: "Vui lòng nhập lý do hủy" },
            {
              max: maxLength,
              message: `Lý do hủy không được vượt quá ${maxLength} ký tự.`,
            },
          ]}
        >
          <Input.TextArea
            size={"large"}
            placeholder={"Hãy nhập lý do hủy của bạn"}
            rows={5}
          />
        </Form.Item>

        <div style={{ textAlign: "right", marginTop: -12 }}>
          <Text
            type="secondary"
            style={{
              color: currentDescriptionLength > maxLength ? "red" : undefined,
            }}
          >
            ({`${currentDescriptionLength} / ${maxLength}`})
          </Text>
        </div>

        {!includes([step1, step2], true) && (
          <>
            <Form.Item
              label={"Tải tệp"}
              name={"attachment_files"}
              valuePropName={"fileList"}
              getValueFromEvent={(e) => e.fileList}
            >
              <Upload
                beforeUpload={(file) => handleBeforeUpload(file)}
                onRemove={(file) => {
                  const currentFiles =
                    form.getFieldValue("attachment_files") || [];
                  const updatedFiles = currentFiles.filter(
                    (f: any) => f.uid !== file.uid
                  );
                  form.setFieldValue("attachment_files", updatedFiles);
                }}
                maxCount={5}
                multiple={true}
                className={"uploadFullWidth"}
              >
                <Row
                  className={"uploadDropzoneContainer"}
                  justify={"space-between"}
                  align={"middle"}
                >
                  <Typography.Paragraph
                    type={"secondary"}
                    className={"nm-typo"}
                  >
                    Hỗ trợ tệp PDF, CSV..
                  </Typography.Paragraph>

                  <Button size={"small"} icon={<UploadOutlined />}>
                    Tải tài liệu
                  </Button>
                </Row>
              </Upload>
            </Form.Item>
            {/* đề xuất thanh lý */}
            <Form.Item
              label="Đề xuất thanh lý"
              required
              style={{
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  border: "1px solid #d9d9d9",
                  borderRadius: 6,
                  padding: "6px 10px",
                  background: "#fafafa",
                  transition: "all 0.2s ease",
                }}
                className="settlement-input-group"
              >
                <Form.Item
                  name="settlement_value"
                  noStyle
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập giá trị thanh lý",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const type = getFieldValue("settlement_type");
                        if (type === "%" && value && Number(value) > 100) {
                          return Promise.reject(
                            new Error("Phần trăm không được vượt quá 100%")
                          );
                        }
                        if (value && isNaN(value)) {
                          return Promise.reject(
                            new Error("Giá trị phải là số")
                          );
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <Input
                    allowClear
                    placeholder="Nhập giá trị thanh lý"
                    style={{
                      flex: 1,
                      border: "none",
                      background: "transparent",
                      boxShadow: "none",
                    }}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9.]/g, "");
                      form.setFieldValue("settlement_value", val);
                    }}
                  />
                </Form.Item>

                <Divider
                  type="vertical"
                  style={{
                    height: 26,
                    margin: 0,
                    backgroundColor: "#d9d9d9",
                  }}
                />

                <Form.Item name="settlement_type" noStyle initialValue="%">
                  <Select
                    style={{
                      width: 90,
                      border: "none",
                      background: "transparent",
                    }}
                    onChange={(value) => {
                      form.setFieldValue("settlement_type", value);
                      const current = form.getFieldValue("settlement_value");
                      if (value === "%" && current && Number(current) > 100) {
                        form.setFieldValue("settlement_value", "100");
                      }
                    }}
                    options={[
                      { label: "%", value: "%" },
                      { label: "VNĐ", value: "VND" },
                    ]}
                  />
                </Form.Item>
              </div>

              <Text type="secondary" style={{ fontSize: 13 }}>
                Nếu chọn %, tối đa là 100%. Nếu chọn VNĐ, nhập số tiền cụ thể.
              </Text>
            </Form.Item>{" "}
          </>
        )}
        {shouldDisplayRateForm() && (
          <>
            {/* <Form.Item
              label={"Đánh giá chất lượng công việc"}
              name={"rate"}
              rules={[{ required: true, message: "Vui lòng nhập đánh giá" }]}
            >
              <Rate style={{ color: "#09993E" }} />
            </Form.Item> */}

            {/* <Form.Item
              label={"Đánh giá"}
              name={"description"}
              rules={[{ required: true, message: "Vui lòng nhập đánh giá" }]}
            >
              <Input.TextArea
                size={"large"}
                placeholder={"Hãy nhập đánh giá của bạn"}
                rows={5}
              />
            </Form.Item> */}

            {/* <Form.Item
              label={"Tải tệp"}
              name={"attachment_files"}
              valuePropName={"fileList"}
              getValueFromEvent={(e) => e.fileList}
            >
              <Upload
                beforeUpload={(file) => handleBeforeUpload(file)}
                onRemove={(file) => {
                  const currentFiles =
                    form.getFieldValue("attachment_files") || [];
                  const updatedFiles = currentFiles.filter(
                    (f: any) => f.uid !== file.uid
                  );
                  form.setFieldValue("attachment_files", updatedFiles);
                }}
                maxCount={5}
                multiple={true}
                className={"uploadFullWidth"}
              >
                <Row
                  className={"uploadDropzoneContainer"}
                  justify={"space-between"}
                  align={"middle"}
                >
                  <Typography.Paragraph
                    type={"secondary"}
                    className={"nm-typo"}
                  >
                    Hỗ trợ tệp PDF, CSV..
                  </Typography.Paragraph>

                  <Button size={"small"} icon={<UploadOutlined />}>
                    Tải tài liệu
                  </Button>
                </Row>
              </Upload>
            </Form.Item> */}
          </>
        )}
      </Form>
      <Row justify={"center"}>
        {withThemeRevert(
          <Button
            onClick={form.submit}
            loading={isLoading}
            disabled={isLoading}
            type={"primary"}
          >
            {isLoading ? "Đang xác nhận, xin đợi..." : "Hủy công việc"}
          </Button>
        )}
      </Row>
    </Modal>
  );
});

CancelJobModal.displayName = "CancelJobModal";

export default CancelJobModal;
