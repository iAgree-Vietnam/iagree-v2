"use client"
import React, { useState } from "react";
import { FormInstance } from "antd/lib/form/Form";
import {
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Upload,
  Button,
  Typography,
  Empty,
  Row,
  Col,
  Radio,
  Checkbox,
} from "antd";
import { UploadFile } from "antd/lib/upload/interface";
import TextArea from "antd/lib/input/TextArea";
import Constants from "@/src/constants/Constants";
import AppInputNumber from "@/src/components/AppInputNumber";
import datetimeUtils from "@/src/utils/DatetimeUtils";
import AppDatePicker from "@/src/components/date/DatePicker";
import dayjs from "dayjs";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false }) as any;

const { Option } = Select;
const { Title, Text } = Typography;

interface JobScopeAndBudgetStepsProps {
  form: FormInstance;
  partnerId: number | null | undefined;
}

interface DeliverableAttachment extends UploadFile {
  comment?: string;
  previewUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
}

const generateVideoThumbnail = (
  file: File
): Promise<{
  thumbnailUrl: string | undefined;
  duration: number | undefined;
}> => {
  return new Promise((resolve) => {
    if(typeof document !== "undefined"){const video = document.createElement("video");
    video.src = URL.createObjectURL(file);
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      if (video.duration === Infinity || isNaN(video.duration)) {
        resolve({ thumbnailUrl: undefined, duration: undefined });
        URL.revokeObjectURL(video.src);
        return;
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      video.currentTime = Math.min(1, video.duration / 2);

      video.onseeked = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          const thumbnailUrl = canvas.toDataURL("image/png");
          const duration = video.duration;

          URL.revokeObjectURL(video.src);
          resolve({ thumbnailUrl, duration });
        } else {
          URL.revokeObjectURL(video.src);
          resolve({ thumbnailUrl: undefined, duration: undefined });
        }
      };

      video.onerror = () => {
        URL.revokeObjectURL(video.src);
        resolve({ thumbnailUrl: undefined, duration: undefined });
      };
    };

    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      resolve({ thumbnailUrl: undefined, duration: undefined });
    };

    setTimeout(() => {
      if (video.readyState < 2) {
        URL.revokeObjectURL(video.src);
        resolve({ thumbnailUrl: undefined, duration: undefined });
      }
    }, 5000);}
  });
};

function JobScopeAndBudgetStep(props: JobScopeAndBudgetStepsProps) {
  const { form, partnerId } = props;

  const uploadProps = (add: (defaultValue: DeliverableAttachment) => void) => ({
    name: "file",
    multiple: true,
    beforeUpload: async (file: UploadFile) => {
      const tempPreviewUrl = URL.createObjectURL(file as any);

      const isVideoFile = file.type?.startsWith("video/");
      let thumbnailUrl: string | undefined = undefined;
      let duration: number | undefined = undefined;

      if (isVideoFile && file.originFileObj) {
        const {
          thumbnailUrl: generatedThumbnail,
          duration: generatedDuration,
        } = await generateVideoThumbnail(file.originFileObj as File);
        thumbnailUrl = generatedThumbnail;
        duration = generatedDuration;
      }

      add({
        uid: file.uid,
        name: file.name,
        status: "done",
        url: undefined,
        previewUrl: tempPreviewUrl,
        type: file.type,
        size: file.size,
        comment: "",
        originFileObj: file.originFileObj,
        thumbnailUrl: thumbnailUrl,
        duration: duration,
      } as DeliverableAttachment);
      return false;
    },
    showUploadList: false,
  });

  const maxLength = Constants.TEXT_MAX_LENGTH;
  const deliverableAttachments = Form.useWatch("deliverable_attachments", form);
  const currentLength = deliverableAttachments
    ? deliverableAttachments.length
    : 0;

  // 👇 Watch tách bạch 2 nhóm
  const deadlineType = Form.useWatch("deadline_type", form);
  const salaryType = Form.useWatch("salary_type", form);

  const jobDurationTypeOptions = [
    {
      label: "Ngày",
      value: Constants.JOB.DURATION_TYPE.DAYS,
    },
    {
      label: "Tuần",
      value: Constants.JOB.DURATION_TYPE.WEEKS,
    },
    {
      label: "Tháng",
      value: Constants.JOB.DURATION_TYPE.MONTHS,
    },
  ];

  const [selectedDateType, setSelectedDateType] = useState<number | null>(null);
  const handleMenuClick = ({ value }: { value: number }) => {
    setSelectedDateType(value);
  };
  const selectedLabel =
    jobDurationTypeOptions.find((item) => item.value === selectedDateType)
      ?.label || "Ngày";

  return (
    <div className={"formGroupContainer"} style={{ borderBottom: "none" }}>
      <div className={"formGroupContentContainer"}>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Loại công việc"
              name="job_type"
              initialValue={1}
              rules={[
                { required: true, message: "Vui lòng chọn loại công việc" },
              ]}
            >
              <Select size="large" disabled>
                <Option value={1}>Một lần</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            {/* <div style={{ marginBottom: "8px" }}>
              <Title level={5} style={{ margin: 0 }}>
                Số lần nghiệm thu{" "}
                <span style={{ color: "#E14141", fontSize: "14px" }}>*</span>
              </Title>
            </div> */}

            <Form.Item
              label="Số lần nghiệm thu"
              name={"number_accept"}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số lần nghiệm thu cho công việc",
                },
                {
                  validator(_, value) {
                    if (value === null || value === undefined || value === "") {
                      return Promise.resolve();
                    }

                    if (!Number.isInteger(Number(value))) {
                      return Promise.reject(
                        new Error("Số lần nghiệm thu phải là số nguyên")
                      );
                    }

                    if (value < 1 || value > 10) {
                      return Promise.reject(
                        new Error(
                          "Số lần nghiệm thu không được là số âm và không được lớn hơn 10 lần"
                        )
                      );
                    }

                    return Promise.resolve();
                  },
                },
              ]}
            >
              <AppInputNumber
                placeholder={"Nhập số lần nghiệm thu"}
                size={"large"}
                min={1}
                max={10}
                step={1}
                precision={0}
                inputMode="numeric"
                pattern="[0-9]*"
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

            <div style={{ textAlign: "left", marginTop: 5 }}>
              <Text
                type="secondary"
                style={{
                  color: "red",
                }}
              >
                {
                  "Lưu ý: Số lượt nghiệm thu chỉ mang tính chất tham khảo để dự tính khối lượng công việc của Đối tác. Trong quá trình thực hiện công việc, Khách hàng có thể đề xuất chỉnh sửa bổ sung ngoài số lượt đã quy định ban đầu nếu Đối tác chấp thuận."
                }
              </Text>
            </div>
            {/* <Form.Item
              label="Hạn hoàn thành mong muốn"
              required
              style={{ marginBottom: 0 }}
            >
              <Input.Group compact style={{ width: "100%" }}>
                <Form.Item
                  name="job_duration_type"
                  noStyle
                  initialValue={1}
                >
                  <Select
                    size="large"
                    options={jobDurationTypeOptions}
                    notFoundContent={null}
                    style={{ width: "20%" }}
                    onSelect={handleMenuClick}
                  />
                </Form.Item>

                <Form.Item
                  name="duration"
                  noStyle
                  rules={[{ required: true, message: "Vui lòng nhập số ngày" }]}
                >
                  <InputNumber
                    size="large"
                    style={{ width: "80%" }}
                    placeholder="Số ngày (1, 15, 30,...)"
                    min={1}
                  />
                </Form.Item>
              </Input.Group>
            </Form.Item> */}
          </Col>
        </Row>

        {/* // deadline */}
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label={"Loại thời gian"}
              name={"deadline_type"} // 👈 đổi từ salary_type → deadline_type
              initialValue={Constants.JOB.DEADLINE.AMOUNT}
              required
            >
              <Radio.Group
                options={[
                  {
                    value: Constants.JOB.DEADLINE.AMOUNT,
                    label: "Theo số ngày",
                  },
                  {
                    value: Constants.JOB.DEADLINE.CALENDAR,
                    label: "Ngày cụ thể",
                  },
                ]}
                optionType={"button"}
                buttonStyle={"solid"}
                className={"jobSalaryTypeContainer"}
                onChange={(e) => {
                  const val = e.target.value;
                  // Reset các trường của nhóm thời gian để tránh rác dữ liệu
                  if (val === Constants.JOB.DEADLINE.CALENDAR) {
                    form.setFieldsValue({
                      // deadline: undefined,
                      job_duration_type: 1,
                      duration: undefined,
                      start_date: undefined,
                      end_date: undefined,
                      deadline_type: val,
                    });
                  } else {
                    form.setFieldsValue({
                      // deadline: undefined,
                      job_duration_type: 1,
                      duration: undefined,
                      start_date: undefined,
                      end_date: undefined,
                      deadline_type: val,
                    });
                  }
                }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            {/* Theo số ngày → hiện Deadline */}
            {deadlineType === Constants.JOB.DEADLINE.AMOUNT && (
              // <Form.Item
              //   label={"Deadline"}
              //   name={"deadline"}
              //   rules={[
              //     { required: true, message: "Vui lòng nhập số ngày cho công việc" },
              //   ]}
              // >
              //   <AppInputNumber
              //     placeholder={"Nhập số ngày"}
              //     size={"large"}
              //     min={1}
              //   />
              // </Form.Item>

              <>
                <Form.Item
                  label="Hạn hoàn thành mong muốn"
                  required
                  style={{ marginBottom: 0 }}
                >
                  <Input.Group compact style={{ width: "100%" }}>
                    <Form.Item
                      name="job_duration_type"
                      noStyle
                      initialValue={1}
                    >
                      <Select
                        size="large"
                        options={jobDurationTypeOptions}
                        notFoundContent={null}
                        style={{ width: "20%" }}
                        onSelect={handleMenuClick}
                      />
                    </Form.Item>

                    <Form.Item
                      name="duration"
                      noStyle
                      rules={[
                        { required: true, message: "Vui lòng nhập số ngày" },
                        {
                          validator(_, value) {
                            if (
                              value === null ||
                              value === undefined ||
                              value === ""
                            ) {
                              return Promise.resolve();
                            }

                            if (!Number.isInteger(Number(value))) {
                              return Promise.reject(
                                new Error("Số ngày thực hiện phải là số nguyên")
                              );
                            }

                            if (value < 1) {
                              return Promise.reject(
                                new Error(
                                  "Số ngày thực hiện không được là số âm"
                                )
                              );
                            }

                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <InputNumber
                        size="large"
                        style={{ width: "80%" }}
                        placeholder="Số ngày (1, 15, 30,...)"
                        min={1}
                        step={1}
                        precision={0}
                        inputMode="numeric"
                        pattern="[0-9]*"
                      />
                    </Form.Item>
                  </Input.Group>
                </Form.Item>

                <div style={{ textAlign: "left", marginTop: 5 }}>
                  <Text
                    type="secondary"
                    style={{
                      color: "red",
                    }}
                  >
                    {
                      "Lưu ý: Hạn hoàn thành mong muốn là căn cứ xác định thời hạn cho lượt nghiệm thu đầu tiên, không phải tổng thời gian thực hiện công việc trên thực tế. Theo quy định, Khách hàng có thời hạn tối đa 3 ngày để xem xét và quyết định đồng ý hay từ chối kết quả của mỗi lượt nghiệm thu; Đối tác có thời hạn tối đa 3 ngày để chỉnh sửa kết quả của mỗi lượt nghiệm thu sau khi Khách hàng từ chối và yêu cầu điều chỉnh. Vui lòng cộng thêm các khoảng thời gian này nếu muốn dự kiến tổng thời gian hoàn thành công việc."
                    }
                  </Text>
                </div>
              </>
            )}

            {/* Ngày cụ thể → hiện Start/End */}
            {deadlineType === Constants.JOB.DEADLINE.CALENDAR && (
              <Row>
                <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                  <Form.Item
                    label={"Ngày bắt đầu"}
                    name={"start_date"}
                    getValueProps={(value) => ({
                      value:
                        value &&
                        datetimeUtils.getMoment(
                          value,
                          datetimeUtils.BACKEND_DATE_TIME
                        ),
                    })}
                    normalize={(value) =>
                      (value &&
                        value.format(datetimeUtils.BACKEND_DATE_TIME)) ||
                      ""
                    }
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập thời gian bắt đầu",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const max = getFieldValue("end_date");
                          if (
                            value !== undefined &&
                            max !== undefined &&
                            value > max
                          ) {
                            return Promise.reject(
                              new Error("Ngày bắt đầu phải trước ngày kết thúc")
                            );
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <AppDatePicker
                      size={"large"}
                      style={{ width: "100%" }}
                      placeholder="Chọn ngày bắt đầu"
                      format={"DD/MM/YYYY"}
                      disabledDate={(d) =>
                        !!d &&
                        d.startOf("day").valueOf() <
                          dayjs().startOf("day").valueOf()
                      }
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                  <Form.Item
                    label={"Ngày kết thúc"}
                    name={"end_date"}
                    getValueProps={(value) => ({
                      value:
                        value &&
                        datetimeUtils.getMoment(
                          value,
                          datetimeUtils.BACKEND_DATE_TIME
                        ),
                    })}
                    normalize={(value) =>
                      (value &&
                        value.format(datetimeUtils.BACKEND_DATE_TIME)) ||
                      ""
                    }
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập Ngày kết thúc",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const min = getFieldValue("start_date");
                          if (
                            value !== undefined &&
                            min !== undefined &&
                            value < min
                          ) {
                            return Promise.reject(
                              new Error(
                                "Ngày kết thúc phải sau hoặc bằng ngày bắt đầu"
                              )
                            );
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <AppDatePicker
                      size={"large"}
                      style={{ width: "100%" }}
                      placeholder="Chọn ngày kết thúc"
                      format={"DD/MM/YYYY"}
                      disabledDate={(d) =>
                        !!d &&
                        d.startOf("day").valueOf() <
                          dayjs().startOf("day").valueOf()
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
            )}
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label={"Ngân sách dự kiến"}
              name={"salary_type"} // 👈 giữ cho nhóm ngân sách
              initialValue={Constants.JOB.SALARY_TYPE.FIXED}
              required
            >
              <Radio.Group
                options={[
                  { value: Constants.JOB.SALARY_TYPE.FIXED, label: "Cố định" },
                  {
                    value: Constants.JOB.SALARY_TYPE.DEAL,
                    label: "Thỏa thuận",
                  },
                ]}
                optionType={"button"}
                buttonStyle={"solid"}
                className={"jobSalaryTypeContainer"}
                onChange={(e) => {
                  const val = e.target.value;
                  // Reset trường tiền khi đổi loại
                  if (val === Constants.JOB.SALARY_TYPE.FIXED) {
                    form.setFieldsValue({
                      price: undefined,
                      price_min: undefined,
                      price_max: undefined,
                      salary_type: val,
                    });
                  } else {
                    form.setFieldsValue({
                      price: undefined,
                      price_min: undefined,
                      price_max: undefined,
                      salary_type: val,
                    });
                  }
                }}
              />
            </Form.Item>

            {salaryType === Constants.JOB.SALARY_TYPE.DEAL && (
              <div style={{ marginBlock: "5px" }}>
                <Text type="secondary" style={{ color: "red" }}>
                  Hãy điền ngân sách giới hạn của bạn khi thoả thuận để chúng
                  tôi kết nối với đối tác phù hợp nhất, ngân sách này sẽ không
                  được iAgree public
                </Text>
              </div>
            )}
          </Col>

          <Col xs={24} md={12}>
            {/* Cố định → Số tiền */}
            {salaryType === Constants.JOB.SALARY_TYPE.FIXED && (
              <Form.Item
                label={"Số tiền (VNĐ)"}
                name={"price"}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số tiền cho công việc",
                  },
                  {
                    validator(_, value) {
                      if (value < 10000) {
                        return Promise.reject(
                          new Error("Số tiền không được nhỏ hơn 10 nghìn")
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
                <AppInputNumber
                  placeholder={"Nhập số tiền"}
                  size={"large"}
                  min={1000}
                />
              </Form.Item>
            )}

            {/* Thỏa thuận → Từ/Đến */}
            {salaryType === Constants.JOB.SALARY_TYPE.DEAL && (
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                  <Form.Item
                    label={"Từ (VNĐ)"}
                    name={"price_min"}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số tiền thấp nhất",
                      },
                      {
                        validator(_, value) {
                          if (value < 10000) {
                            return Promise.reject(
                              new Error("Số tiền không được nhỏ hơn 10 nghìn")
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
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const max = getFieldValue("price_max");
                          if (
                            value !== undefined &&
                            max !== undefined &&
                            value >= max
                          ) {
                            return Promise.reject(
                              new Error(
                                "Số tiền thấp nhất phải nhỏ hơn số tiền cao nhất"
                              )
                            );
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <AppInputNumber
                      size={"large"}
                      placeholder={"Nhập số tiền thấp nhất"}
                      min={1000}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                  <Form.Item
                    label={"Đến (VNĐ)"}
                    name={"price_max"}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số tiền cao nhất",
                      },
                      {
                        validator(_, value) {
                          if (value < 10000) {
                            return Promise.reject(
                              new Error("Số tiền không được nhỏ hơn 10 nghìn")
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
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const min = getFieldValue("price_min");
                          if (
                            value !== undefined &&
                            min !== undefined &&
                            value <= min
                          ) {
                            return Promise.reject(
                              new Error(
                                "Số tiền cao nhất phải lớn hơn số tiền thấp nhất"
                              )
                            );
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <AppInputNumber
                      size={"large"}
                      placeholder={"Nhập số tiền cao nhất"}
                      min={2000}
                    />
                  </Form.Item>
                </Col>
              </Row>
            )}
          </Col>
        </Row>

        {/* <Row gutter={16}>
          <Col xs={24} md={12}>
            <div style={{ marginBottom: "8px" }}>
              <Title level={5} style={{ margin: 0 }}>
                Số lần nghiệm thu{" "}
                <span style={{ color: "#E14141", fontSize: "14px" }}>*</span>
              </Title>
            </div>

            <Form.Item
              name={"number_accept"}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số lần nghiệm thu cho công việc",
                },
              ]}
            >
              <AppInputNumber
                placeholder={"Nhập số lần nghiệm thu"}
                size={"large"}
                min={1}
              />
            </Form.Item>
          </Col>
        </Row> */}

        <Form.Item
          name="deliverable_attachments"
          label="Sản phẩm đầu ra mong muốn"
          rules={[
            {
              max: maxLength,
              message: `Mô tả sản phẩm đầu ra mong muốn không được vượt quá ${maxLength} ký tự.`,
            },
          ]}
        >
          {/* <TextArea
            rows={5}
            placeholder={
              "Ví dụ: “01 file hợp đồng dạng Word + PDF, có chú thích”, hoặc “Thiết kế logo + hướng dẫn sử dụng”"
            }
            size={"large"}
          /> */}
          <ReactQuill
            placeholder={`Ví dụ: “01 file hợp đồng dạng Word + PDF, có chú thích”, hoặc “Thiết kế logo + hướng dẫn sử dụng”`}
            defaultValue={""} // nội dung mặc định
            // style={{ height: 0 }} // chiều cao editor (150px ~ vài hàng)
            theme="snow"
            modules={{
              toolbar: [
                [{ header: "1" }, { header: "2" }, { font: [] }],
                [{ list: "ordered" }, { list: "bullet" }],
                ["bold", "italic", "underline"],
                [{ align: [] }],
                ["link"],
              ],
            }}
            onChange={(v: string) => form.setFieldsValue({ deliverable_attachments: v })}
            style={{ minHeight: 180 }} // chiều cao tổng thể của editor
          />
        </Form.Item>

        <div style={{ textAlign: "right", marginTop: "-12px" }}>
          <Text
            type="secondary"
            style={{ color: currentLength > maxLength ? "red" : undefined }}
          >
            ({`${currentLength} / ${maxLength}`})
          </Text>
        </div>

        {partnerId !== 0 && (
          <Form.Item name="is_public" valuePropName="checked" label={null}>
            <Checkbox>
              Bạn có muốn đăng công việc này để các đối tác khác có thể ứng
              tuyển trong trường hợp đối tác được bạn mời từ chối lời mời này.
            </Checkbox>
          </Form.Item>
        )}
      </div>
    </div>
  );
}

export default JobScopeAndBudgetStep;
