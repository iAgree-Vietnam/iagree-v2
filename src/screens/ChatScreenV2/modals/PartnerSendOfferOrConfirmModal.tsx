"use client";
import React, {
  useCallback,
  useImperativeHandle,
  useState,
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Modal,
  Row,
  Typography,
  Col,
  InputNumber,
  DatePicker,
  Steps,
  message,
  Spin,
  Alert,
  Radio,
} from "antd";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import Constants from "@/src/constants/Constants";
import { FullJobResource } from "@/src/data/job/models/job.types";
import { useJob } from "@/src/hooks/useJobs";
import { useAccountContext } from "@/src/contexts/AccountContext";
import { filter, max, toNumber } from "lodash";
import { useClientInfo } from "@/src/screens/VerifyOtpScreenV2/hooks/useClientInfo";
import _ from "lodash";
import moment from "moment";
import AppDatePicker from "@/src/components/date/DatePicker";
import { usePathname, useRouter } from "next/navigation";
import ProjectBidTable from "../../JobScreen/JobDetailScreen/components/ProjectBidTable";
import useConfirmPartner from "../../JobScreen/JobDetailScreen/hooks/useConfirmPartner";
import useSendOffer from "../../JobScreen/JobDetailScreen/hooks/useSendOffer";
import useCalculateFee from "../../JobScreen/JobApplyFormScreen/hooks/useCalculateFee";
import { UserProjectBidsResource } from "@/src/data/message/models/message.types";
import JobRouteUtils from "@/src/data/job/utils/JobRouteUtils";
import useIsMobile from "../../HomeScreen/hooks/useIsMobile";

const { Title, Text } = Typography;
const { TextArea } = Input;

// Mock utils
const withThemeRevert = (component: React.ReactNode) => component;
const PriceUtils = {
  displayVND: (value: number | undefined) => `${value?.toLocaleString()} VNĐ`,
  displayWithoutUnitVND: (value: number) => `${value.toLocaleString()}`,
  display: (value: number | undefined) =>
    value ? `${value.toLocaleString()} VNĐ` : "0 VNĐ",
};

// Dynamic import PDFViewer
const PDFViewer = dynamic(
  async () => {
    const { Document, Page, pdfjs } = await import("react-pdf");
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

    return function PDFViewerComponent({
      fileUrl,
      onReachEnd,
    }: {
      fileUrl: string;
      onReachEnd?: () => void;
    }) {
      const [numPages, setNumPages] = useState(0);
      const [loading, setLoading] = useState(true);
      const scrollRef = useRef<HTMLDivElement>(null);

      const handleScroll = () => {
        const div = scrollRef.current;
        if (div && onReachEnd) {
          const { scrollTop, scrollHeight, clientHeight } = div;
          if (scrollTop + clientHeight >= scrollHeight - 10) {
            onReachEnd();
          }
        }
      };

      const baseUrl = process.env.BASE_URL;

      return (
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className={"hide-scroll"}
          style={{
            height: "500px",
            overflowY: "auto",
            border: "1px solid #d9d9d9",
            padding: "8px",
            margin: 0,
          }}
        >
          {/* {loading && (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <Spin />
            </div>
          )} */}
          {/* <Document
            file={fileUrl}
            onLoadSuccess={({ numPages }) => {
              setNumPages(numPages);
              setLoading(false);
            }}
            onLoadError={(err) => {
              console.error("Error loading PDF:", err);
              setLoading(false);
            }}
            loading=""
          >
            {Array.from(new Array(numPages), (_, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                width={940}
              />
            ))}
          </Document> */}

          <iframe
            src={`${baseUrl}/policy/serviceProvideContract.html`}
            style={{
              width: "100%",
              height: "100%",

              border: "none",
              borderRadius: 8,
            }}
            title={"form-khach-hang"}
          />
          {/* <ClientConfirmContract/> */}
        </div>
      );
    };
  },
  { ssr: false }
);

interface ConfirmInfoResource {
  userId: number | undefined | null;
  partnerId: number | undefined | null;
  partnerName: string | undefined | null;
  projectName: string | undefined | null;
  startDate: string | null | undefined;
  endDate: string | null | undefined;
  negotiatePrice: number;
  numberAccept: number;
  description: string | undefined;
  jobSuggestion: string | undefined | null;
  deviceId: string;
  deviceName: string;
  platform: string;
}

type SendOfferToPartnerModalProps = {
  jobId?: number;
  onSuccess?: () => void;
  fullJobResource?: FullJobResource;
  isPartnerRole?: boolean;
  userProjectBids?: UserProjectBidsResource | null;
  projectId?: number;
  projectName?: string;
  roomId: string;
};

export interface PartnerSendOfferOrConfirmModalHelperVisible {
  // open: (confirmInfo: ConfirmInfoResource) => void;
  // close: () => void;
  open: (chatReceiverInfo: any) => void;
  close: () => void;
}

const PartnerSendOfferOrConfirmModal = React.forwardRef<
  PartnerSendOfferOrConfirmModalHelperVisible,
  SendOfferToPartnerModalProps
>(
  (
    {
      jobId,
      onSuccess,
      fullJobResource,
      isPartnerRole,
      userProjectBids,
      projectId,
      projectName,
      roomId,
    },
    ref
  ) => {
    const [form] = Form.useForm();
    const router = useRouter();

    const formScrollRef = useRef<HTMLDivElement>(null);
    const [confirmInfo, setConfirmInfo] = useState<ConfirmInfoResource | null>(
      null
    );
    const [currentStep, setCurrentStep] = useState(0);
    // const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [originalInfo, setOriginalInfo] = useState<any>(null);
    const [edited, setEdited] = useState(false);
    const [isFormDisabled, setIsFormDisabled] = useState(false);
    const [enabledResend, setEnabledResend] = useState(false);
    const [shouldDisableForm, setShouldDisableForm] = useState(false);
    const [isResendMode, setIsResendMode] = useState(false);

    const maxLength = Constants.TEXT_MAX_LENGTH;
    const suggestion = Form.useWatch("jobSuggestion", form);
    const currentLength = suggestion ? suggestion.length : 0;

    const [canAgree, setCanAgree] = useState(false);
    const [pdfUrl, setPdfUrl] = useState<string>("");

    const baseUrl = process.env.BASE_URL;
    const pdfLink = `${baseUrl}/policy/serviceProvideContract.html`;
    const { auth: userInfo } = useAccountContext();
    const { clientIp, browserInfo } = useClientInfo();

    const normalizeValues = (values: any) => ({
      jobSuggestion: values.jobSuggestion || "",
      jobDescription: values.jobDescription || "",
      jobName: values.jobName || "",
      partnerName: values.partnerName || "",
      startDate:
        values.startDate && dayjs(values.startDate).isValid()
          ? dayjs(values.startDate).format("YYYY-MM-DD")
          : "",
      endDate:
        values.endDate && dayjs(values.endDate).isValid()
          ? dayjs(values.endDate).format("YYYY-MM-DD")
          : "",
      numberAccept:
        values.numberAccept !== undefined && values.numberAccept !== null
          ? Number(values.numberAccept)
          : 1,
      negotiatePrice:
        values.negotiatePrice !== undefined && values.negotiatePrice !== null
          ? Number(values.negotiatePrice)
          : 0,
    });

    const [priceError, setPriceError] = useState<string>("");
    const platformFeeMutation = useCalculateFee();
    const debouncedCalculateFee = useRef(
      _.debounce((value: number) => {
        platformFeeMutation.mutate({
          type: Constants.JOB.PLATFORM_FEE.TYPE.CLIENT,
          price: value,
        });
      }, 800)
    ).current;

    useEffect(() => {
      if (confirmInfo) {
        const isPartner = isPartnerRole;

        const userProjectBid = userProjectBids;

        let values = {};
        let shouldDisableForm = false;

        if (
          userProjectBid?.userProjectDeals &&
          userProjectBid.userProjectDeals.length > 0
        ) {
          const latestDeal = userProjectBid.userProjectDeals[0];

          const isValidStartDate =
            latestDeal.startDate &&
            latestDeal.startDate !== "0000-00-00" &&
            dayjs(latestDeal.startDate).isValid();

          const isValidEndDate =
            latestDeal.endDate &&
            latestDeal.endDate !== "0000-00-00" &&
            dayjs(latestDeal.endDate).isValid();

          values = {
            jobName: confirmInfo.projectName,
            partnerName: confirmInfo.partnerName,
            startDate:
              latestDeal.startDate && dayjs(latestDeal.startDate).isValid()
                ? dayjs(latestDeal.startDate)
                : null,
            endDate:
              latestDeal.endDate && dayjs(latestDeal.endDate).isValid()
                ? dayjs(latestDeal.endDate)
                : null,
            jobDescription: confirmInfo.description,
            negotiatePrice: latestDeal.negotiatePrice,
            numberAccept: latestDeal.numberAccept,
            jobSuggestion: latestDeal.description,
          };

          if (isPartner) {
            // partner không thể edit khi có deal từ partner đang chờ (type = 2, status = 0)
            shouldDisableForm =
              (latestDeal.type === Constants.JOB.OFFER.TYPE.PARTNER &&
                latestDeal.status === Constants.JOB.OFFER.STATUS.NOT_RESPONSE)
          } else {
            // client không thể edit khi có deal từ client đang chờ (type = 1, status = 0)
            shouldDisableForm =
              latestDeal.type === Constants.JOB.OFFER.TYPE.CLIENT &&
              latestDeal.status === Constants.JOB.OFFER.STATUS.NOT_RESPONSE;
          }
        } else {
          const isValidStartDate =
            userProjectBids?.startDate &&
            userProjectBids?.startDate !== "" &&
            userProjectBids?.startDate !== "0000-00-00" &&
            dayjs(userProjectBids?.startDate).isValid();

          const isValidEndDate =
            userProjectBids?.endDate &&
            userProjectBids?.endDate !== "" &&
            userProjectBids?.endDate !== "0000-00-00" &&
            dayjs(userProjectBids?.endDate).isValid();

          values = {
            jobName: confirmInfo.projectName,
            partnerName: confirmInfo.partnerName,
            startDate: isValidStartDate ? dayjs(userProjectBids?.startDate) : null,
            endDate: isValidEndDate ? dayjs(userProjectBids?.endDate) : null,
            jobDescription: userProjectBids?.description || "",
            negotiatePrice:
              userProjectBids?.negotiatePrice || fullJobResource?.priceMax,
            numberAccept:
              userProjectBids?.numberAccept || fullJobResource?.numberAccept || 1,
            jobSuggestion: userProjectBids?.description || "",
          };
        }

        form.setFieldsValue(values);
        setOriginalInfo(normalizeValues(form.getFieldsValue()));
        setEdited(false);
        setIsFormDisabled(true);
        setShouldDisableForm(shouldDisableForm);
        setEnabledResend(false);
        setIsResendMode(false);

        const defaultPrice = form.getFieldValue("negotiatePrice");
        if (defaultPrice && defaultPrice !== 0) {
          if (defaultPrice >= 10000) {
            setPriceError("");
            debouncedCalculateFee(defaultPrice);
          } else {
            setPriceError("Giá phải lớn hơn 10,000 VNĐ");
          }
        }
      }
    }, [confirmInfo, form, fullJobResource, userInfo, debouncedCalculateFee]);

    const open = useCallback((info: ConfirmInfoResource) => {
      setConfirmInfo(info);
      setCurrentStep(0);
      setPdfUrl("");
      setAgreeToTerms(false);
    }, []);

    const close = useCallback(() => {
      setConfirmInfo(null);
      setCurrentStep(0);
      form.resetFields();
      // setPdfFile(null);
      setPdfUrl("");
      setAgreeToTerms(false);
    }, [form]);

    useImperativeHandle(ref, () => ({ open, close }), [open, close]);

    const handleNextStep = useCallback(() => {
      if (currentStep === 0) {
        form
          .validateFields()
          .then(() => {
            setCurrentStep(1);
            setTimeout(() => setPdfUrl(pdfLink), 100);
          })
          .catch((err) => console.error("Validation failed:", err));
      }
    }, [currentStep, form, pdfLink]);

    const handlePrevStep = useCallback(() => {
      if (currentStep === 1) {
        setCurrentStep(0);
        setPdfUrl("");
        setEdited(false);
      }
    }, [currentStep]);

    async function mapFormValuesToApi(values: any, dealStatus: number) {
      return {
        user_id: userProjectBids?.userId,
        start_date:
          values.startDate && dayjs(values.startDate).isValid()
            ? dayjs(values.startDate).format("YYYY-MM-DD")
            : null,
        end_date:
          values.endDate && dayjs(values.endDate).isValid()
            ? dayjs(values.endDate).format("YYYY-MM-DD")
            : null,
        negotiate_price: values.negotiatePrice || 0,
        number_accept: values.numberAccept || 0,
        description: values.jobSuggestion || "",
        deal_status: dealStatus,
        client_ip: clientIp,
        device_name: browserInfo?.browser,
        platform: "WEB",
      };
    }

    const { mutateAsync: sendOffer } = useSendOffer(
      toNumber(projectId),
      roomId
    );
    const handleSendOffer = useCallback(async () => {
      try {
        const values = await form.validateFields();

        const normalizedCurrent = normalizeValues(values);
        const originalStr = JSON.stringify(originalInfo);
        const editedFlag = JSON.stringify(normalizedCurrent) !== originalStr;

        let dealStatus = 0; // default: gửi đề xuất mới
        const partnerBid = userProjectBids;
        const isPartner = isPartnerRole;

        if (partnerBid?.userProjectDeals && partnerBid.userProjectDeals.length > 0) {
          const latestDeal = partnerBid.userProjectDeals[0];

          // Nếu có deal từ client và user là partner, và không edit → đồng ý (dealStatus = 1)
          if (
            isPartner && 
            latestDeal?.type === Constants.JOB.OFFER.TYPE.CLIENT &&
            latestDeal.status === Constants.JOB.OFFER.STATUS.NOT_RESPONSE &&
            !editedFlag
          ) {
            dealStatus = 1; // Đồng ý với đề xuất từ client
          } else {
            dealStatus = 0; // Gửi đề xuất mới
          }
        }

        if (editedFlag) {
          dealStatus = 0;
        }

        const dataToSubmit = await mapFormValuesToApi(values, dealStatus);

        if (projectId) {

          await sendOffer(dataToSubmit as any);
          close();
          onSuccess?.();
        } else {
          message.error("Không thể gửi đề xuất cho công việc!");
        }
      } catch (err) {
        console.error("Validation failed:", err);
      }
    }, [
      form,
      originalInfo,
      userProjectBids, 
      isPartnerRole,
      normalizeValues,
      close, 
      agreeToTerms, 
      confirmInfo,
      projectId, 
      onSuccess, 
      sendOffer,
    ]);

    // ============ RENDER =============
    const getAlertMessage = (latestDeal: any) => {
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
    };

    const getAlertType = (latestDeal: any) => {
      if (!latestDeal) return "info";

      if (
        latestDeal.type === Constants.JOB.OFFER.TYPE.PARTNER &&
        latestDeal.status === Constants.JOB.OFFER.STATUS.NOT_RESPONSE
      ) {
        return "warning";
      }

      return "info";
    };

    const formContainerStyle = {
      maxHeight: "500px",
      overflowY: "auto" as const,
      padding: "0 8px",
    };

    const renderStep1Content = () => {
      const userProjectBid = userProjectBids;
      const latestDeal = userProjectBid?.userProjectDeals?.[0];

      const alertMessage = getAlertMessage(latestDeal);
      const alertType = getAlertType(latestDeal);

      return (
        <>
          {alertMessage && (
            <div
              style={{
                marginBottom: "20px",
                position: "sticky",
                top: "0",
                zIndex: 1000,
              }}
            >
              <Alert
                message={alertMessage}
                type={alertType as any}
                showIcon
                style={{
                  padding: "12px 14px",
                  borderRadius: "12px",
                  boxShadow:
                    "0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08)",
                  fontSize: "15px",
                  lineHeight: "1.6",
                  transform: "translateY(-2px)",
                }}
              />
            </div>
          )}

          <div ref={formScrollRef} style={formContainerStyle}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSendOffer}
              onValuesChange={(_, changedValues) => {
                if (!originalInfo) return;

                setTimeout(() => {
                  const normalizedCurrent = normalizeValues(
                    form.getFieldsValue()
                  );
                  const currentStr = JSON.stringify(normalizedCurrent);
                  const originalStr = JSON.stringify(originalInfo);

                  const hasChanged = currentStr !== originalStr;
                  setEdited(hasChanged);

                  // if (changedValues && 'negotiatePrice' in changedValues) {
                  //   const price = changedValues.negotiatePrice as number;
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
              {/* Tên công việc + Đối tác */}
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item label="Tên công việc" name="jobName">
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Tên đối tác" name="partnerName">
                    <Input disabled />
                  </Form.Item>
                </Col>
              </Row>

              {/* Ngày bắt đầu - kết thúc */}
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Ngày bắt đầu"
                    name="startDate"
                    rules={[
                      { required: true, message: "Vui lòng chọn ngày bắt đầu" },
                      {
                        validator: (_, value) => {
                          if (!value) return Promise.resolve();
                          const today = dayjs().startOf("day");
                          const startDate = dayjs(value).startOf("day");
                          const endDate = form.getFieldValue("endDate");

                          if (startDate.isBefore(today)) {
                            return Promise.reject(
                              new Error(
                                "Ngày bắt đầu không được nhỏ hơn ngày hiện tại"
                              )
                            );
                          }
                          if (endDate && dayjs(endDate).isValid()) {
                            const endDateParsed = dayjs(endDate).startOf("day");
                            if (startDate.isAfter(endDateParsed)) {
                              return Promise.reject(
                                new Error(
                                  "Ngày bắt đầu không được sau ngày kết thúc"
                                )
                              );
                            }
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <AppDatePicker
                      disabled={isFormDisabled}
                      style={{ width: "100%" }}
                      format="DD/MM/YYYY"
                      placeholder={"DD/MM/YYYY"}
                      onChange={() => {
                        form.validateFields(["endDate"]);
                      }}
                      disabledDate={(d) => d.isBefore(moment(), "date")}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Ngày kết thúc"
                    name="endDate"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn ngày kết thúc",
                      },
                      {
                        validator: (_, value) => {
                          if (!value) return Promise.resolve();
                          const today = dayjs().startOf("day");
                          const endDate = dayjs(value).startOf("day");
                          const startDate = form.getFieldValue("startDate");

                          if (endDate.isBefore(today)) {
                            return Promise.reject(
                              new Error(
                                "Ngày kết thúc không được nhỏ hơn ngày hiện tại"
                              )
                            );
                          }
                          if (startDate && dayjs(startDate).isValid()) {
                            const startDateParsed =
                              dayjs(startDate).startOf("day");
                            if (endDate.isBefore(startDateParsed)) {
                              return Promise.reject(
                                new Error(
                                  "Ngày kết thúc không được trước ngày bắt đầu"
                                )
                              );
                            }
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <AppDatePicker
                      disabled={isFormDisabled}
                      style={{ width: "100%" }}
                      format="DD/MM/YYYY"
                      placeholder={"DD/MM/YYYY"}
                      onChange={() => {
                        form.validateFields(["startDate"]);
                      }}
                      disabledDate={(d) => d.isBefore(moment(), "date")}
                    />
                  </Form.Item>
                </Col>
              </Row>

              {/* Giá */}
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Giá (VNĐ)"
                    name="negotiatePrice"
                    rules={[
                      { required: true },
                      {
                        validator: (_, value) => {
                          if (value === undefined || value === null) {
                            return Promise.reject(
                              new Error("Vui lòng nhập giá")
                            );
                          }
                          if (value < 10000) {
                            return Promise.reject(new Error("Số tiền không được nhỏ hơn 10 nghìn"));
                          }
                          if (value < 0) {
                            return Promise.reject(
                              new Error("Giá không được âm!")
                            );
                          }
                          if (value && value > 500000000) {
                            return Promise.reject(
                              new Error("Số tiền không được vượt quá 500 triệu")
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <InputNumber<number>
                      disabled={isFormDisabled}
                      style={{ width: "100%" }}
                      formatter={(v) =>
                        v ? PriceUtils.displayWithoutUnitVND(Number(v)) : "0"
                      }
                      parser={(v) => Number((v || "0").replace(/[^\d]/g, ""))}
                      onChange={(value) => {
                        if (value && value >= 10000) {
                          setPriceError("");
                          debouncedCalculateFee(value);
                        } else if (value && value < 10000) {
                          setPriceError("Giá phải lớn hơn 10,000 VNĐ");
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

                  {form.getFieldValue("negotiatePrice") &&
                    platformFeeMutation.isPending &&
                    !priceError && (
                      <div style={{ textAlign: "left", marginTop: -12 }}>
                        <Typography.Text type="secondary">
                          Đang tính phí nền tảng...
                        </Typography.Text>
                      </div>
                    )}

                  {form.getFieldValue("negotiatePrice") &&
                    platformFeeMutation.data &&
                    !priceError && (
                      <div style={{ textAlign: "left", marginTop: -12 }}>
                        <Typography.Text type="success">
                          {platformFeeMutation.data.message}
                        </Typography.Text>
                      </div>
                    )}

                  {form.getFieldValue("negotiatePrice") &&
                    platformFeeMutation.isError &&
                    !priceError && (
                      <div style={{ textAlign: "left", marginTop: -12 }}>
                        <Typography.Text type="danger">
                          Không thể tính phí nền tảng
                        </Typography.Text>
                      </div>
                    )}
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Số lần nghiệm thu"
                    name="numberAccept"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số lần nghiệm thu",
                      },
                      {
                        validator: (_, value) => {
                          if (value < 0) {
                            return Promise.reject(
                              new Error("Số lần nghiệm thu không được âm!")
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                      {
                        type: "number",
                        max: 10,
                        message: "Số lần nghiệm thu không được vượt quá 10",
                      },
                    ]}
                  >
                    <InputNumber<number>
                      disabled={isFormDisabled}
                      min={1}
                      max={10}
                      style={{ width: "100%" }}
                      placeholder=""
                      onChange={() => {}}
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

              {/* Mô tả */}
              <Row gutter={16}>
                <Col xs={24} md={24}>
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
                      disabled={isFormDisabled}
                      rows={5}
                      onChange={() => {}}
                    />
                  </Form.Item>

                  <div style={{ textAlign: "right", marginTop: "-12px" }}>
                    <Text
                      type="secondary"
                      style={{
                        color: currentLength > maxLength ? "red" : undefined,
                      }}
                    >
                      ({`${currentLength} / ${maxLength}`})
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
                  >
                    <Typography.Text strong>
                      {shouldDisableForm
                        ? "Đã gửi đề xuất"
                        : isResendMode
                        ? "Không gửi đề xuất"
                        : "Gửi đề xuất"}
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

              <Row gutter={16}>
                <Col span={24}>
                  <ProjectBidTable
                    title="Lịch sử đề xuất"
                    jobQuery={
                      {
                        data: {
                          ...fullJobResource,
                          userProjectBids: [userProjectBids],
                        },
                        refetch: () => Promise.resolve(),
                      } as any
                    }
                    isDisplayResponse={false}
                  />
                </Col>
              </Row>
            </Form>
          </div>
        </>
      );
    };

    const getButtonText = () => {
      const isPartner = isPartnerRole;

      if (!confirmInfo) return "Gửi đề xuất";

      const partnerBid = userProjectBids;

      // Fixed: Check for invited partners WITHOUT deals FIRST
      if (
        partnerBid?.bidType === Constants.JOB.BID.TYPE.INVITED &&
        (!partnerBid?.userProjectDeals ||
          partnerBid.userProjectDeals.length === 0)
      ) {
        return "Gửi đề xuất";
      }

      // Check if partner has any deals (applies to both invited and regular partners)
      if (partnerBid?.userProjectDeals?.length! > 0) {
        // If invited partner has deals, follow the same logic as regular partners
        const latestDeal = partnerBid?.userProjectDeals?.[0];

        if (isPartner) {
          if (
            latestDeal?.type === Constants.JOB.OFFER.TYPE.PARTNER &&
            latestDeal.status === Constants.JOB.OFFER.STATUS.NOT_RESPONSE
          ) {
            return "Đã gửi đề xuất";
          }

          if (
            latestDeal?.type === Constants.JOB.OFFER.TYPE.PARTNER &&
            latestDeal.dealStatus === Constants.JOB.OFFER.DEAL_STATUS.ACCEPTED
          ) {
            return "Đã đồng ý";
          }
        } else {
          if (
            latestDeal?.type === Constants.JOB.OFFER.TYPE.CLIENT &&
            latestDeal.status === Constants.JOB.OFFER.STATUS.NOT_RESPONSE
          ) {
            return "Đã gửi đề xuất";
          }
        }
      }

      // For partners with deals: check if edited or can sign contract
      return edited ? "Gửi đề xuất" : "Đồng ý";
    };

    const getButtonDisabled = () => {
      if (!confirmInfo) return false;

      const isPartner = isPartnerRole;

      const partnerBid = userProjectBids;

      if (partnerBid?.userProjectDeals?.length! > 0) {
        const latestDeal = partnerBid?.userProjectDeals?.[0];

        if (isPartner) {
          return (
            latestDeal?.type === Constants.JOB.OFFER.TYPE.PARTNER &&
            latestDeal.status === Constants.JOB.OFFER.STATUS.NOT_RESPONSE
          );
        } else {
          return (
            latestDeal?.type === Constants.JOB.OFFER.TYPE.CLIENT &&
            latestDeal.status === Constants.JOB.OFFER.STATUS.NOT_RESPONSE
          );
        }
      }

      return false;
    };

    const isTablet = useIsMobile(768);
    const isMobile = useIsMobile(450);

    const renderButtons = () => {
      const isButtonDisabled = getButtonDisabled();
      const buttonSize = isTablet ? "middle" : "large";

      if (currentStep === 0) {
        return (
          <Row justify="center" style={{ marginTop: 24 }}>
            <Button
              onClick={close}
              size={buttonSize}
              style={{ marginRight: 12 }}
            >
              Hủy
            </Button>
            {withThemeRevert(
              <Button
                onClick={() => {
                  handleSendOffer();
                }}
                type="primary"
                size={buttonSize}
                disabled={isButtonDisabled}
              >
                {getButtonText()}
              </Button>
            )}
          </Row>
        );
      }
    };

    return (
      <Modal
        title="Xác nhận công việc"
        open={Boolean(confirmInfo)}
        footer={null}
        onCancel={close}
        width={900}
      >
        {renderStep1Content()}
        {renderButtons()}
      </Modal>
    );
  }
);

PartnerSendOfferOrConfirmModal.displayName = "PartnerSendOfferOrConfirmModal";
export default PartnerSendOfferOrConfirmModal;
