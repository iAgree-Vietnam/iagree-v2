import React, { useEffect, useRef, useState } from "react";
import RootLayout from "@/src/layouts/RootLayout";
import {
  Breadcrumb,
  Button,
  Col,
  Form,
  Input,
  Row,
  Spin,
  Typography,
  DatePicker,
} from "antd";
import Head from "next/head";
import dynamic from "next/dynamic";
import { FullJobResource } from "@/src/data/job/models/job.types";
import Constants from "@/src/constants/Constants";
import useSelectedJob from "../JobDetailScreen/hooks/useSelectedJob";
import _ from "lodash";
import AppInputNumber from "@/src/components/AppInputNumber";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import JobRouteUtils from "@/src/data/job/utils/JobRouteUtils";
import { useAccountContext } from "@/src/contexts/AccountContext";
import useJobApply from "../JobDetailScreen/hooks/useJobApply";
import { useFetchPartnerDetails } from "../../PartnerScreen/hooks/useFetchPartnerDetails";
import BackButton from "@/src/components/BackButton";
import { useBreakpoint } from "@/src/hooks/useBreakpoint";
import datetimeUtils from "@/src/utils/DatetimeUtils";
import JobApplyAttachmentUpload from "./components/JobApplyAttachmentUpload";
import useCalculateFee from "./hooks/useCalculateFee";
import PriceUtils from "@/src/utils/PriceUtils";
import dayjs, { Dayjs } from "dayjs";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const { Text } = Typography;
const DATE_FMT = "DD/MM/YYYY";

interface JobApplyFormScreenProps {
  jobId?: number | null | undefined;
}

function JobApplyFormScreen(props: JobApplyFormScreenProps) {
  const { jobId } = props;
  const { isDesktop } = useBreakpoint();
  const { auth: userInfo } = useAccountContext();

  useFetchPartnerDetails(userInfo?.partner?.id || 0);

  const [form] = Form.useForm();

  const jobQuery = useSelectedJob(jobId as number, { initData: undefined });
  const fullJobResource: FullJobResource | undefined = jobQuery.data;

  const applyMutation = useJobApply(fullJobResource as FullJobResource);
  const isLoading = jobQuery.isFetching || !fullJobResource;

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

  // Đếm ký tự
  const maxLength = Constants.TEXT_MAX_LENGTH;
  const letter = Form.useWatch("letter", form);
  const currentLetterLength = letter ? letter.length : 0;
  const description = Form.useWatch("description", form);
  const currentDescriptionLength = description ? description.length : 0;

  // ===== DEFAULTS (dayjs) =====
  const defaultPrice =
    typeof fullJobResource?.priceMax === "number"
      ? fullJobResource?.priceMax
      : null;

  // Nếu BE trả ISO "YYYY-MM-DD" thì dùng dayjs(fullJobResource.startDate) là được.
  const defaultStart: Dayjs | null = fullJobResource?.startDate
    ? dayjs(fullJobResource.startDate, DATE_FMT)
    : null;

  const defaultEnd: Dayjs | null = fullJobResource?.endDate
    ? dayjs(fullJobResource.endDate, DATE_FMT)
    : null;

  // Prefill khi đã có data
  useEffect(() => {
    if (!fullJobResource) return;

    form.setFieldsValue({
      negotiatePrice: defaultPrice,
      startDate: defaultStart,
      endDate: defaultEnd,
      numberAccept: fullJobResource?.numberAccept ?? null,
      // giữ các field khác nếu cần
    });

    if (defaultPrice != null && defaultPrice !== 0) {
      if (defaultPrice >= 10000) {
        // Clear previous error nếu có
        setPriceError("");
        debouncedCalculateFee(defaultPrice);
      } else {
        // Set error nếu defaultPrice < 10000
        setPriceError("Giá đàm phán phải lớn hơn 10,000 VNĐ");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullJobResource]);

  return (
    <RootLayout>
      <Head>
        <title>Ứng tuyển công việc</title>
      </Head>

      <section className={"breadcrumbContainer"}>
        <div className="contentWrapper">
          <Breadcrumb
            items={[
              {
                title: (
                  <>
                    <IconSvgLocal name={"IC_HOME"} />
                    <span>Trang chủ</span>
                  </>
                ),
                href: "/",
              },
              {
                title: "Công việc",
                href: JobRouteUtils.toJobsSearchScreen({}),
              },
              {
                title: fullJobResource?.name || "",
                href: fullJobResource
                  ? JobRouteUtils.toDetailUrl(fullJobResource)
                  : "#",
              },
              { title: "Ứng tuyển công việc" },
            ]}
          />
        </div>
      </section>

      <section className={"sectionContainer"}>
        <BackButton />
        <div className={"jobFormSectionContainer hasBack"}>
          {isLoading ? (
            <Row align="middle" justify="center">
              <Spin size="large" />
            </Row>
          ) : (
            <div className={"contentWrapper"}>
              <Typography.Title className={"jobFormSubtitle"} level={5}>
                Bạn đang ứng tuyển công việc
              </Typography.Title>

              <div className={"jobFormTitleContainer"}>
                <Row gutter={16} align="top" style={{ width: "100%" }}>
                  <Col flex="5">
                    <Typography.Title className={"jobFormTitle"} level={3}>
                      {fullJobResource?.name}
                    </Typography.Title>
                  </Col>
                  <Col flex="1">
                    <Typography.Text
                      style={{
                        float: "right",
                        fontSize: 18,
                        color: "#09993E",
                        fontWeight: 500,
                      }}
                    >
                      {fullJobResource?.connect ?? 0} Cơ Hội
                    </Typography.Text>
                  </Col>
                </Row>
              </div>

              {/* ✅ Một Form duy nhất */}
              <Form
                form={form}
                layout="vertical"
                initialValues={{
                  letter: null,
                  negotiatePrice: null,
                  attachments: [],
                  numberAccept: fullJobResource?.numberAccept ?? null,
                  startDate: null,
                  endDate: null,
                }}
                onFinish={(values) => {
                  if (fullJobResource) {
                    applyMutation.mutate(values);
                  }
                }}
                className={"jobFormContainer"}
                onValuesChange={(changed) => {
                  if ("negotiatePrice" in changed) {
                    const v = changed.negotiatePrice as number | null | undefined;
                    if (typeof v === "number") {
                      if (v < 10000) {
                        setPriceError("Giá đàm phán phải lớn hơn 10,000 VNĐ");
                      } else {
                        setPriceError("");
                        debouncedCalculateFee(v);
                      }
                    }
                  }
                }}
              >
                {/* --- Nhóm: Thông tin công việc hiện tại --- */}
                <div className={"formGroupContainer"}>
                  <div className={"formGroupTitleContainer"}>
                    <h3>Thông tin công việc hiện tại</h3>
                  </div>

                  <div
                    style={{ marginBottom: 20, marginTop: 20 }}
                    dangerouslySetInnerHTML={{
                      __html: fullJobResource?.description || "",
                    }}
                  />
                </div>

                {/* --- Nhóm: Nội dung đề xuất --- */}
                <div className={"formGroupContainer"}>
                  <div className={"formGroupTitleContainer"}>
                    <h3 className={"formGroupTitle"}>Nội dung đề xuất</h3>
                  </div>

                  <div className={"formGroupContentContainer"}>
                    <Row gutter={20}>
                      <Col lg={12}>
                        <Form.Item
                          name="negotiatePrice"
                          label={
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span>Giá đàm phán (VNĐ)</span>
                             
                            </div>
                          }
                        
                          rules={[
                            { required: true, message: "Vui lòng nhập giá đàm phán" },
                          ]}
                        >
                          <AppInputNumber
                            size="large"
                            placeholder={
                              defaultPrice != null
                                ? `VD: ${PriceUtils.displayVND(defaultPrice)}`
                                : "Nhập giá bạn muốn trả"
                            }
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
                          )
                        }

                        {form.getFieldValue("negotiatePrice") &&
                          platformFeeMutation.data &&
                          !priceError && (
                            <div style={{ textAlign: "left", marginTop: -12 }}>
                              <Typography.Text type="success">
                                {platformFeeMutation.data.message}
                              </Typography.Text>
                            </div>
                          )
                        }

                        {form.getFieldValue("negotiatePrice") &&
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

                      <Col lg={12}>
                        <Form.Item
                          label={"Số lần nghiệm thu"}
                          name={"numberAccept"}
                          rules={[
                            { required: true, message: "Vui lòng nhập số lần nghiệm thu" },
                            { 
                              type: "number",
                              max: 10, 
                              message: "Số lần nghiệm thu không được vượt quá 10" 
                            }
                          ]}
                        >
                          <AppInputNumber
                            min={1}
                            max={10}
                            size="large"
                            placeholder={"Nhập số lần nghiệm thu"}
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

                    <Row gutter={20}>
                      <Col lg={12}>
                        <Form.Item
                          name="startDate"
                          label={
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span>Thời gian bắt đầu</span>
                            
                            </div>
                          }
                          extra={defaultStart ? `Mặc định: ${defaultStart.format(DATE_FMT)}` : undefined}
                          rules={[{ required: true, message: "Vui lòng nhập thời gian bắt đầu" }]}
                        >
                          <DatePicker
                            format={DATE_FMT}
                            className="full-width"
                            disabledDate={(d) =>
                              !!d &&
                              d.startOf("day").valueOf() < dayjs().startOf("day").valueOf()
                            }
                            placeholder={
                              defaultStart
                                ? defaultStart.format(DATE_FMT)
                                : datetimeUtils.LOCAL_DATE.toLowerCase()
                            }
                          />
                        </Form.Item>
                      </Col>

                      <Col lg={12}>
                        <Form.Item
                          name="endDate"
                          label={
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span>Thời gian kết thúc</span>
                             
                            </div>
                          }
                          extra={defaultEnd ? `Mặc định: ${defaultEnd.format(DATE_FMT)}` : undefined}
                          dependencies={["startDate"]}
                          rules={[
                            { required: true, message: "Vui lòng nhập thời gian kết thúc" },
                            ({ getFieldValue }) => ({
                              validator(_, value: Dayjs | null) {
                                const start: Dayjs | null = getFieldValue("startDate");
                                if (!value || !start) return Promise.resolve();
                                return value.startOf("day").valueOf() >=
                                  start.startOf("day").valueOf()
                                  ? Promise.resolve()
                                  : Promise.reject(new Error("Ngày kết thúc phải sau hoặc bằng ngày bắt đầu"));
                              },
                            }),
                          ]}
                        >
                          <DatePicker
                            format={DATE_FMT}
                            className="full-width"
                            disabledDate={(d) =>
                              !!d &&
                              d.startOf("day").valueOf() < dayjs().startOf("day").valueOf()
                            }
                            placeholder={
                              defaultEnd
                                ? defaultEnd.format(DATE_FMT)
                                : datetimeUtils.LOCAL_DATE.toLowerCase()
                            }
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item
                      label={"Đề xuất"}
                      name={"description"}
                      rules={[
                        { required: true, message: "Vui lòng nhập đề xuất" },
                        {
                          max: maxLength,
                          message: `Đề xuất không được vượt quá ${maxLength} ký tự.`,
                        },
                      ]}
                    >
                      <Input.TextArea
                        size="large"
                        placeholder={"Nhập đề xuất của bạn cho công việc này"}
                        rows={4}
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

                    <Form.Item label={"File CV/Portfolio/Proposal"} name={"attachments"}>
                      <JobApplyAttachmentUpload />
                    </Form.Item>

                    <Form.Item 
                      label={"Thư giới thiệu"} 
                      name={"letter"}
                      rules={[
                        {
                          max: maxLength,
                          message: `Thư giới thiệu không được vượt quá ${maxLength} ký tự.`,
                        },
                      ]}
                    >
                      <Input.TextArea
                        size="large"
                        placeholder={"Tham khảo hướng dẫn của chúng tôi bên dưới"}
                        rows={4}
                      />
                    </Form.Item>

                    <div style={{ textAlign: "right", marginTop: -12 }}>
                      <Text
                        type="secondary"
                        style={{
                          color: currentLetterLength > maxLength ? "red" : undefined,
                        }}
                      >
                        ({`${currentLetterLength} / ${maxLength}`})
                      </Text>
                    </div>

                    <Typography.Paragraph>
                      (*) Viết ngắn gọn về bản thân (điểm mạnh, điểm yếu), kinh nghiệm làm việc, vì sao bạn phù hợp với công việc này? Bạn có kế hoạch thực hiện công việc này như thế nào?
                    </Typography.Paragraph>

                    <Row justify="center">
                      <Button
                        onClick={form.submit}
                        loading={applyMutation.isPending && !!fullJobResource}
                        disabled={applyMutation.isPending || !fullJobResource}
                        type="primary"
                        style={{
                          marginTop: 20,
                          minWidth: !isDesktop ? "0" : "480px",
                        }}
                      >
                        {applyMutation.isPending && !!fullJobResource
                          ? "Đang nộp hồ sơ ứng tuyển"
                          : "Nộp hồ sơ ứng tuyển"}
                      </Button>
                    </Row>
                  </div>
                </div>
              </Form>
            </div>
          )}
        </div>
      </section>
    </RootLayout>
  );
}

export default JobApplyFormScreen;