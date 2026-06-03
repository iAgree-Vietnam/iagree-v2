"use client";
import React, {
  useImperativeHandle,
  useState,
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  Button,
  Form,
  Input,
  Modal,
  Row,
  Typography,
  Col,
  InputNumber,
  DatePicker,
  message,
  Alert,
  Checkbox,
  Radio,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import Constants from "@/src/constants/Constants";
import useSendOffer from "../hooks/useSendOffer";
import { FullJobResource, SendOfferParams } from "@/src/data/job/models/job.types";
import { toNumber } from "lodash";
import { useAccountContext } from "@/src/contexts/AccountContext";
import { useClientInfo } from "@/src/screens/VerifyOtpScreenV2/hooks/useClientInfo";
import { useJob } from "@/src/hooks/useJobs";
import { RawUserProjectDealResource } from "@/src/data/job/models/job.raw";
import _ from "lodash";
import useCalculateFee from "../../JobApplyFormScreen/hooks/useCalculateFee";
import AppDatePicker from "@/src/components/date/DatePicker";
import moment from "moment";

const { Text } = Typography;
const { TextArea } = Input;

const PriceUtils = {
  displayWithoutUnitVND: (value: number) => `${value.toLocaleString()}`,
};

interface ConfirmInfoResource {
  userId: number | undefined | null;
  partnerId: number | undefined | null;
  partnerName: string | undefined | null;
  projectName: string | undefined | null;
  startDate: string;
  endDate: string;
  negotiatePrice: number;
  numberAccept: number;
  description: string | undefined;
  suggestion: string | undefined | null;
  deviceId: string;
  deviceName: string;
  platform: string;
}

type SendOfferToPartnerModalProps = {
  job?: FullJobResource;
  onSuccess?: () => void;
  open: boolean;
  title?: string;
  setOpen: (val: any) => void;
  latestDeal: RawUserProjectDealResource | null;
};

export interface ClientConfirmOfferModalHelperVisible {
  open: (confirmInfo?: ConfirmInfoResource) => void;
  close: () => void;
}

type FormShape = {
  jobName?: string;
  startDate?: Dayjs | null;
  endDate?: Dayjs | null;
  price?: number;
  numberAccept?: number;
  jobSuggestion?: string;
  jobDescription?: string;
};

const SendOfferToPartnerModalV2 = React.forwardRef<
  ClientConfirmOfferModalHelperVisible,
  SendOfferToPartnerModalProps
>(({ job, onSuccess, title, open, setOpen, latestDeal }, ref) => {  
  const [form] = Form.useForm<FormShape>();
  const [submitText, setSubmitText] = useState<string>("Đồng ý");
  const [originalInfo, setOriginalInfo] = useState<any>(null);
  const [edited, setEdited] = useState(false);
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [enabledResend, setEnabledResend] = useState(false);
  const [shouldDisableForm, setShouldDisableForm] = useState(false);
  const [isResendMode, setIsResendMode] = useState(false);

  const maxLength = Constants.TEXT_MAX_LENGTH ?? 1500;
  const jobSuggestion = Form.useWatch("jobSuggestion", form);
  const currentLength = jobSuggestion?.length ?? 0;

  const { mutateAsync: sendOffer, isPending } = useSendOffer(
    toNumber(job?.jobId),
    ''
  );

  const { auth: userInfo } = useAccountContext();
  const { clientIp, browserInfo } = useClientInfo();
  
  const { isCanReply } = useJob(job, userInfo);

  // const isClient = job?.createdByUserId === userInfo?.userId;

  const getSubmitButtonText = () => {
    if (
      latestDeal?.type === Constants.JOB.OFFER.TYPE.PARTNER && 
      latestDeal?.deal_status === Constants.JOB.OFFER.DEAL_STATUS.ACCEPTED
    ) {
      return "Đồng ý";
    }
    return edited ? "Gửi đề xuất" : "Đồng ý";
  };

  const initialValues: FormShape = useMemo(
    () => {
      if (!job) return {};

      const userProjectBid = job?.userProjectBids?.find(
        (bid) => bid.userId === userInfo?.userId
      );
      
      if (userProjectBid?.userProjectDeals && userProjectBid.userProjectDeals.length > 0) {
        const latestDeal = userProjectBid.userProjectDeals[0];
        return {
          jobName: job.name ?? "",
          startDate: latestDeal.startDate ? dayjs(latestDeal.startDate) : null,
          endDate: latestDeal.endDate ? dayjs(latestDeal.endDate) : null,
          price: latestDeal.negotiatePrice ?? 0,
          numberAccept: Number.isFinite(Number(latestDeal.numberAccept))
            ? toNumber(latestDeal.numberAccept)
            : 0,
          jobSuggestion: latestDeal.description ?? "",
          jobDescription: job.description ?? "",
        };
      }

      return {
        jobName: job.name ?? "",
        partnerName: userInfo?.fullName ?? "",
        startDate: job?.startDate ? dayjs(job.startDate) : null,
        endDate: job?.endDate ? dayjs(job.endDate) : null,
        price: job?.price ?? 0,
        numberAccept: Number.isFinite(Number(job?.numberAccept))
          ? toNumber(job?.numberAccept)
          : 0,
        jobSuggestion: job?.description ?? "",
        jobDescription: job?.description ?? "",
      };
    }, [job, userInfo]
  );

  const normalizeValues = (values: any) => ({
    jobSuggestion: values.jobSuggestion || "",
    jobDescription: values.jobDescription || "",
    jobName: values.jobName || "",
    partnerName: values.partnerName || "",
    startDate: values.startDate && dayjs(values.startDate).isValid()
      ? dayjs(values.startDate).format("YYYY-MM-DD")
      : "",
    endDate: values.endDate && dayjs(values.endDate).isValid()
      ? dayjs(values.endDate).format("YYYY-MM-DD") 
      : "",
    numberAccept:
      values.numberAccept !== undefined && values.numberAccept !== null
        ? Number(values.numberAccept)
        : 1,
    price:
      values.price !== undefined && values.price !== null
        ? Number(values.price)
        : 0,
  });

  const [priceError, setPriceError] = useState<string>("");
  const platformFeeMutation = useCalculateFee();
  const debouncedCalculateFee = useRef(
    _.debounce((value: number) => {
      platformFeeMutation.mutate({
        type: Constants.JOB.PLATFORM_FEE.TYPE.PARTNER,
        price: value
      });
    }, 800)
  ).current;

  useEffect(() => {
    if (open && job) {
      form.setFieldsValue(initialValues);
      setOriginalInfo(normalizeValues(initialValues));
      setEdited(false);
      setIsFormDisabled(true);
      // setShouldDisableForm(!isCanReply);
      setEnabledResend(false);
      setIsResendMode(false);

      const defaultPrice = form.getFieldValue('price');
      if (defaultPrice && defaultPrice !== 0) {
        if (defaultPrice >= 10000) {
          setPriceError('');
          debouncedCalculateFee(defaultPrice);
        } else {
          setPriceError('Giá phải lớn hơn 10,000 VNĐ');
        }
      }
    }
  }, [open, job, form, initialValues, debouncedCalculateFee]);

  const handleClose = () => {
    setOpen(false);
    setSubmitText("Đồng ý");
    setEdited(false);
    // form.resetFields(); // bật nếu muốn reset form
  };

  const validateStartDate = async (_: any, value?: Dayjs | null) => {
    if (!value) return Promise.resolve();
    const today = dayjs().startOf("day");
    const startDate = value.startOf("day");
    const endDate = form.getFieldValue("endDate") as Dayjs | null;

    if (startDate.isBefore(today)) {
      return Promise.reject(
        new Error("Ngày bắt đầu không được nhỏ hơn ngày hiện tại")
      );
    }
    if (endDate && dayjs(endDate).isValid()) {
      const endDateParsed = endDate.startOf("day");
      if (startDate.isAfter(endDateParsed)) {
        return Promise.reject(
          new Error("Ngày bắt đầu không được lớn hơn ngày kết thúc")
        );
      }
    }
    return Promise.resolve();
  };

  const validateEndDate = async (_: any, value?: Dayjs | null) => {
    if (!value) return Promise.resolve();
    const today = dayjs().startOf("day");
    const endDate = value.startOf("day");
    const startDate = form.getFieldValue("startDate") as Dayjs | null;

    if (endDate.isBefore(today)) {
      return Promise.reject(
        new Error("Ngày kết thúc không được nhỏ hơn ngày hiện tại")
      );
    }
    if (startDate && dayjs(startDate).isValid()) {
      const startDateParsed = startDate.startOf("day");
      if (
        // endDate.isSame(startDateParsed) ||
        endDate.isBefore(startDateParsed)
      ) {
        return Promise.reject(
          new Error("Ngày kết thúc phải lớn hơn ngày bắt đầu")
        );
      }
    }
    return Promise.resolve();
  };

  const onFinish = async (values: FormShape) => {
    const payload = {
      user_id: userInfo?.userId,
      price: values.price,
      description: values.jobSuggestion,
      number_accept: values.numberAccept,
      deal_status: edited ? 0 : 1,
      negotiate_price: values.price,
      start_date: values.startDate
        ? dayjs(values.startDate).format("YYYY-MM-DD")
        : null,
      end_date: values.endDate
        ? dayjs(values.endDate).format("YYYY-MM-DD")
        : null,
      client_ip: clientIp,
      device_name: browserInfo?.browser,
      platform: "WEB",
    };

    try {
      await sendOffer(payload as any);
      setSubmitText("Đề xuất"); // reset lại sau khi submit
      setEdited(false);
      handleClose();
      onSuccess?.();
    } catch (e: any) {
      message.error(e?.message || "Gửi đề xuất thất bại");
    }
  };

  const onFinishFailed = ({ errorFields }: any) => {
    if (errorFields?.length) {
      form.scrollToField(errorFields[0]?.name);
    }
  };

  const getAlertMessage = (latestDeal: RawUserProjectDealResource | null) => {
    if (!latestDeal) return "";

    if (
      latestDeal.type === Constants.JOB.OFFER.TYPE.CLIENT && 
      latestDeal.status === Constants.JOB.OFFER.STATUS.NOT_RESPONSE
    ) {
      return "Dưới đây là đề xuất mới nhất của khách hàng, nếu bạn muốn đề xuất lại hãy nhập điều chỉnh các thông tin này.";
    }

    if (
      latestDeal.type === Constants.JOB.OFFER.TYPE.PARTNER && 
      latestDeal.status === Constants.JOB.OFFER.STATUS.NOT_RESPONSE
    ) {
      return "Bạn đã gửi đề xuất cho khách hàng. Vui lòng chờ phản hồi từ khách hàng.";
    }

    return "";
  }

  const getAlertType = (latestDeal: RawUserProjectDealResource | null) => {
    if (!latestDeal) return "info";

    if (
      latestDeal.type === Constants.JOB.OFFER.TYPE.PARTNER && 
      latestDeal.status === Constants.JOB.OFFER.STATUS.NOT_RESPONSE
    ) {
      return "warning";
    }

    return "info";
  }

  const renderForm = () => {
    const alertMessage = getAlertMessage(latestDeal);
    const alertType = getAlertType(latestDeal);

    return (
      <>
        {alertMessage && (
          <div style={{
            marginBottom: "20px",
            position: "sticky",
            top: "0",
            zIndex: 1000
          }}>
            <Alert
              message={alertMessage}
              type={alertType as any}
              showIcon
              style={{
                padding: "12px 14px",
                borderRadius: "12px",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08)",
                fontSize: "15px",
                lineHeight: "1.6",
                transform: "translateY(-2px)",
              }}
            />
          </div>
        )}

        <Form<FormShape>
          form={form}
          layout="vertical"
          initialValues={initialValues}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          // khi bất kỳ field nào thay đổi → đổi text nút thành "Đồng ý"
          onValuesChange={(_, changedValues) => {
            if (!originalInfo) return;

            setTimeout(() => {
              const normalizedCurrent = normalizeValues(form.getFieldsValue());
              const currentStr = JSON.stringify(normalizedCurrent);
              const originalStr = JSON.stringify(originalInfo);

              const hasChanged = currentStr !== originalStr;

              setEdited(hasChanged);
              setSubmitText(hasChanged ? "Đề xuất" : "Đồng ý");

              // if (changedValues && 'price' in changedValues) {
              //   const price = changedValues.price as number;
              //   if (typeof price === 'number') {
              //     if (price >= 10000) {
              //       setPriceError('');
              //       debouncedCalculateFee(price);
              //     } else if (price > 0) {
              //       setPriceError('Giá phải lớn hơn 10,000 VNĐ');
              //     }
              //   }
              // }
            }, 0);
          }}
        >
          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item label="Tên công việc" name="jobName">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Ngày bắt đầu"
                name="startDate"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày bắt đầu" },
                  { validator: validateStartDate },
                ]}
              >
                <AppDatePicker
                  // disabled={!isCanReply}
                  disabled={isFormDisabled}
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY"
                  allowClear={false}
                  onChange={() => form.validateFields(["endDate"])}
                  disabledDate={(d) => d.isBefore(moment(), "date")}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Ngày kết thúc"
                name="endDate"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày kết thúc" },
                  { validator: validateEndDate },
                ]}
              >
                <AppDatePicker
                  // disabled={!isCanReply}
                  disabled={isFormDisabled}
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY"
                  allowClear={false}
                  onChange={() => form.validateFields(["startDate"])}
                  disabledDate={(d) => d.isBefore(moment(), "date")}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Giá (VNĐ)"
                name="price"
                rules={[
                  { required: true },
                  {
                    validator: (_rule, value) => {
                      if (value === undefined || value === null) {
                        return Promise.reject(new Error("Vui lòng nhập giá"));
                      }
                      if (value < 10000) {
                        return Promise.reject(new Error("Số tiền không được nhỏ hơn 10 nghìn"));
                      }
                      if (value < 0) {
                        return Promise.reject(new Error("Giá không được âm!"));
                      }
                      if (value && value > 500000000) {
                        return Promise.reject(new Error("Số tiền không được vượt quá 500 triệu"));
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <InputNumber
                  // disabled={!isCanReply}
                  disabled={isFormDisabled}
                  min={0}
                  style={{ width: "100%" }}
                  formatter={(v) =>
                    v !== undefined && v !== null
                      ? PriceUtils.displayWithoutUnitVND(Number(v))
                      : "0"
                  }
                  placeholder="0 VNĐ"
                  onChange={(value) => {
                    if (value && value >= 10000) {
                      setPriceError('');
                      debouncedCalculateFee(value);
                    } else if (value && value < 10000) {
                      setPriceError('Giá phải lớn hơn 10,000 VNĐ');
                    }
                  }}
                />
              </Form.Item>

              {priceError && (
                <div style={{ textAlign: "left", marginTop: -12 }}>
                  <Typography.Text type="danger">
                    {priceError}
                  </Typography.Text>
                </div>
              )}

              {form.getFieldValue("price") &&
                platformFeeMutation.isPending &&
                !priceError && (
                  <div style={{ textAlign: "left", marginTop: -12 }}>
                    <Typography.Text type="secondary">
                      Đang tính phí nền tảng...
                    </Typography.Text>
                  </div>
                )
              }

              {form.getFieldValue("price") &&
                platformFeeMutation.data &&
                !priceError && (
                  <div style={{ textAlign: "left", marginTop: -12 }}>
                    <Typography.Text type="success">
                      {platformFeeMutation.data.message}
                    </Typography.Text>
                  </div>
                )
              }

              {form.getFieldValue("price") &&
                platformFeeMutation.isError &&
                !priceError && (
                  <div style={{ textAlign: "left", marginTop: -12 }}>
                    <Typography.Text type="danger">
                      Không thể tính phí nền tảng
                    </Typography.Text>
                  </div>
                )
              }
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Số lần nghiệm thu"
                name="numberAccept"
                rules={[
                  { required: true, message: "Vui lòng nhập số lần nghiệm thu" },
                  {
                    validator: (_rule, value) => {
                      // if (value === undefined || value === null)
                      //   return Promise.reject(
                      //     new Error("Vui lòng nhập số lần nghiệm thu")
                      //   );
                      if (value < 0)
                        return Promise.reject(
                          new Error("Số lần nghiệm thu không được âm!")
                        );
                      return Promise.resolve();
                    },
                  },
                  { 
                    type: "number",
                    max: 10,
                    message: "Số lần nghiệm thu không được vượt quá 10"
                  }
                ]}
              >
                <InputNumber
                  // disabled={!isCanReply} 
                  disabled={isFormDisabled}
                  min={1}
                  max={10}
                  style={{ width: "100%" }} 
                />
              </Form.Item>

              <div style={{ textAlign: "left", marginTop: -12 }}>
                <Text
                  type="secondary"
                  style={{
                    color: "red",
                  }}
                >
                  {"* Số lần nghiệm thu không được vượt quá 10"}
                </Text>
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item 
                label="Đề xuất" 
                name="jobSuggestion"
                rules={[
                  { required: true, message: "Vui lòng nhập đề xuất" },
                  {
                    max: maxLength,
                    message: `Đề xuất không được vượt quá ${maxLength} ký tự.`,
                  },
                ]}
              >
                <TextArea 
                  // disabled={!isCanReply}
                  disabled={isFormDisabled}
                  rows={5} 
                  maxLength={maxLength} 
                />
              </Form.Item>

              <div style={{ textAlign: "right", marginTop: -12 }}>
                <Text
                  type="secondary"
                  style={{ color: currentLength > maxLength ? "red" : undefined }}
                >
                  {`${currentLength} / ${maxLength}`}
                </Text>
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24}>
              {/* <Checkbox
                checked={enabledResend}
                disabled={shouldDisableForm}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setEnabledResend(checked);

                  if (checked) {
                    // Enable form
                    setIsFormDisabled(false);
                    setIsResendMode(true);
                  } else {
                    // Reset to original values
                    setIsFormDisabled(true);
                    setIsResendMode(false);
                    if (originalInfo) {
                      const restoredValues = {
                        ...originalInfo,
                        startDate: originalInfo.startDate && originalInfo.startDate !== ""
                          ? dayjs(originalInfo.startDate)
                          : null,
                        endDate: originalInfo.endDate && originalInfo.endDate !== ""
                          ? dayjs(originalInfo.endDate)
                          : null,
                      };
                      form.setFieldsValue(restoredValues);
                      setEdited(false);
                    }
                  }
                }}
              >
                <Typography.Text strong>
                  {!isCanReply
                    ? "Đã gửi đề xuất"
                    : (isResendMode
                      ? "Không gửi đề xuất"
                      : "Gửi đề xuất")
                  }
                </Typography.Text>
              </Checkbox> */}

              <Radio.Group
                value={
                  shouldDisableForm
                    ? "sent"
                    : (enabledResend ? "edit" : "agree")
                }
                onChange={(e) => {
                  const value = e.target.value;

                  if (value === 'edit') {
                    setEnabledResend(true);
                    setIsFormDisabled(false);
                    setIsResendMode(true);
                    setEdited(true);
                  } else if (value === 'agree') {
                    setEnabledResend(false);
                    setIsFormDisabled(true);
                    setIsResendMode(false);
                    if (originalInfo) {
                      const restoredValues = {
                        ...originalInfo,
                        startDate: 
                          originalInfo.startDate && 
                          originalInfo.startDate !== ""
                            ? dayjs(originalInfo.startDate)
                            : null,
                        endDate: 
                          originalInfo.endDate && 
                          originalInfo.endDate !== ""
                            ? dayjs(originalInfo.endDate)
                            : null,
                      };
                      form.setFieldsValue(restoredValues);
                      setEdited(false);
                    }
                  }
                }}
                disabled={shouldDisableForm}
              >
                {shouldDisableForm ? (
                  <Radio value="sent" disabled>
                    <Typography.Text strong>
                      Đã gửi đề xuất
                    </Typography.Text>
                  </Radio>
                ) : (
                  <>
                    <Radio value="edit">
                      <Typography.Text strong>
                        Chỉnh sửa và gửi lại đề xuất
                      </Typography.Text>
                    </Radio>

                    <Radio value="agree">
                      <Typography.Text strong>
                        Đồng ý, không chỉnh sửa
                      </Typography.Text>
                    </Radio>
                  </>
                )}
              </Radio.Group>
            </Col>
          </Row>

          <Row justify="center" style={{ marginTop: 24 }}>
            <Button onClick={handleClose} size="large" style={{ marginRight: 12 }}>
              Hủy
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={isPending}
              size="large"
              disabled={!isCanReply}
            >
              {!isCanReply ? "Đã gửi đề xuất" : getSubmitButtonText()}
            </Button>
          </Row>
        </Form>
      </>
    )
  };

  return (
    <>
      <Modal
        title="Xác nhận công việc"
        open={open}
        onCancel={handleClose}
        width={900}
        destroyOnClose
        footer={null}
      >
        {renderForm()}
      </Modal>
    </>
  );
});

SendOfferToPartnerModalV2.displayName = "SendOfferToPartnerModalV2";
export default SendOfferToPartnerModalV2;
