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
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import { UploadFile } from "antd/lib/upload/interface";
import FilePreviewWithComment from "../scope_and_budget_step/FilePreviewWithComment";
import TextArea from "antd/lib/input/TextArea";
import Constants from "@/src/constants/Constants";
import AppInputNumber from "@/src/components/AppInputNumber";

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
    const video = document.createElement("video");
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
        // console.error("Error loading video for thumbnail generation.");
        URL.revokeObjectURL(video.src);
        resolve({ thumbnailUrl: undefined, duration: undefined });
      };
    };

    video.onerror = () => {
      // console.error("Error loading video metadata for thumbnail generation.");
      URL.revokeObjectURL(video.src);
      resolve({ thumbnailUrl: undefined, duration: undefined });
    };

    setTimeout(() => {
      if (video.readyState < 2) {
        // console.warn("Video metadata load timeout, cannot generate thumbnail.");
        URL.revokeObjectURL(video.src);
        resolve({ thumbnailUrl: undefined, duration: undefined });
      }
    }, 5000);
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
  const currentLength = deliverableAttachments ? deliverableAttachments.length : 0;

  const salaryType = Form.useWatch('salary_type', form);

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
    }
  ];

  const [selectedDateType, setSelectedDateType] = useState<number | null>(null);
  const handleMenuClick = ({ value }: { value: number }) => {
    setSelectedDateType(value);
  };
  const selectedLabel = jobDurationTypeOptions.find(
    (item) => item.value === selectedDateType
  )?.label || 'Ngày';

  return (
    <div className={"formGroupContainer"} style={{ borderBottom: "none" }}>
      <div className={"formGroupContentContainer"}>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Loại công việc"
              name="job_type"
              initialValue={1}
              rules={[{ required: true, message: "Vui lòng chọn loại công việc" }]}
            >
              <Select size="large" disabled>
                <Option value={1}>Một lần</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Hạn hoàn thành mong muốn"
              required
              style={{ marginBottom: 0 }}
            >
              <Input.Group compact style={{ width: '100%' }}>
                <Form.Item
                  name="job_duration_type"
                  noStyle
                  initialValue={1}
                  // rules={[{ required: true, message: "Vui lòng chọn loại" }]}
                >
                  <Select
                    size="large"
                    options={jobDurationTypeOptions}
                    notFoundContent={null}
                    style={{ width: '20%' }}
                    onSelect={handleMenuClick}
                    // disabled
                  />
                </Form.Item>

                <Form.Item
                  name="duration"
                  noStyle
                  rules={[
                    { required: true, message: "Vui lòng nhập số ngày" }
                  ]}
                >
                  <InputNumber
                    size="large"
                    style={{ width: '80%' }}
                    placeholder="Số ngày (1, 15, 30,...)"
                    min={1}
                  />
                </Form.Item>
              </Input.Group>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item 
              label={'Ngân sách dự kiến'} 
              name={'salary_type'}
              initialValue={Constants.JOB.SALARY_TYPE.FIXED}
              required
            >
              <Radio.Group
                options={[
                  {
                    value: Constants.JOB.SALARY_TYPE.FIXED,
                    label: 'Cố định',
                  },
                  {
                    value: Constants.JOB.SALARY_TYPE.DEAL,
                    label: 'Thỏa thuận',
                  },
                ]}
                value={salaryType}
                optionType={'button'}
                buttonStyle={'solid'}
                className={'jobSalaryTypeContainer'}
                onChange={(e) => {
                  const val = e.target.value;
                  const currentValues = form.getFieldsValue();

                  if (val === Constants.JOB.SALARY_TYPE.FIXED) {
                    form.setFieldsValue({ 
                      price_min: undefined, 
                      price_max: undefined,
                      salary_type: val
                    });
                  } else if (val === Constants.JOB.SALARY_TYPE.DEAL) {
                    form.setFieldsValue({ 
                      price: undefined,
                      salary_type: val
                    });
                  }
                  form.setFieldsValue({ salary_type: val });
                }}
              />
            </Form.Item>

            {salaryType === Constants.JOB.SALARY_TYPE.DEAL && (
              <div style={{ marginBlock: "5px" }}>
                <Text
                  type="secondary"
                  style={{
                    color: "red",
                  }}
                >
                  Hãy điền ngân sách giới hạn của bạn khi thoả thuận để chúng tôi kết nối với đối tác phù hợp nhất, ngân sách này sẽ không được iAgree public
                </Text>
              </div>
            )}
          </Col>

          <Col xs={24} md={12}>
            {salaryType === Constants.JOB.SALARY_TYPE.FIXED && (
              <Form.Item
                label={'Số tiền (VNĐ)'}
                name={'price'}
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số tiền cho công việc',
                  },
                ]}
              >
                <AppInputNumber
                  placeholder={'Nhập số tiền'}
                  size={'large'}
                  min={1000}
                  onChange={(val) => {
                  if (val !== undefined) {
                    form.setFieldValue('price', val);
                  }
                }}
                />
              </Form.Item>
            )}

            {salaryType === Constants.JOB.SALARY_TYPE.DEAL && (
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                  <Form.Item
                    label={'Từ (VNĐ)'}
                    name={'price_min'}
                    rules={[
                      { required: true, message: 'Vui lòng nhập số tiền thấp nhất' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const max = getFieldValue('price_max');
                          if (value !== undefined && max !== undefined && value >= max) {
                            return Promise.reject(
                              new Error('Số tiền thấp nhất phải nhỏ hơn số tiền cao nhất')
                            );
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <AppInputNumber
                      size={'large'}
                      placeholder={'Nhập số tiền thấp nhất'}
                      min={1000}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                  <Form.Item
                    label={'Đến (VNĐ)'}
                    name={'price_max'}
                    rules={[
                      { required: true, message: 'Vui lòng nhập số tiền cao nhất' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const min = getFieldValue('price_min');
                          if (value !== undefined && min !== undefined && value <= min) {
                            return Promise.reject(
                              new Error('Số tiền cao nhất phải lớn hơn số tiền thấp nhất')
                            );
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <AppInputNumber
                      size={'large'}
                      placeholder={'Nhập số tiền cao nhất'}
                      min={2000}
                    />
                  </Form.Item>
                </Col>
              </Row>
            )}
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <div style={{ marginBottom: "8px" }}>
              <Title level={5} style={{ margin: 0 }}>
                Số lần nghiệm thu{" "}
                <span style={{ color: "#E14141", fontSize: "14px" }}>*</span>
              </Title>
            </div>

            <Form.Item
              name={'number_accept'}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập số lần nghiệm thu cho công việc',
                },
              ]}
            >
              <AppInputNumber
                placeholder={'Nhập số lần nghiệm thu'}
                size={'large'}
                min={1}
              />
            </Form.Item>
          </Col>

          {/* <Col xs={24} md={12}>
            <div style={{ marginBottom: "8px" }}>
              <Title level={5} style={{ margin: 0 }}>
                Số lượng cần tuyển
              </Title>
            </div>

            <Form.Item
              noStyle
              shouldUpdate={(prev, curr) =>
                prev.needManyPartners !== curr.needManyPartners
              }
            >
              {({ getFieldValue }) => (
                <Form.Item name="needPartners" noStyle>
                  <AppInputNumber
                    placeholder="Nhập số lượng cần tuyển"
                    size="large"
                    min={1}
                    disabled={!getFieldValue("needManyPartners")}
                  />
                </Form.Item>
              )}
            </Form.Item>

            {(partnerId === 0) && (
              <Form.Item name="need_many_partners" valuePropName="checked" noStyle>
                <Checkbox
                  style={{ marginTop: "10px" }}
                  onChange={(e) => {
                    if (!e.target.checked) {
                      form.setFieldsValue({ needPartners: 1 });
                    }
                  }}
                >
                  Cần nhiều đối tác thực hiện công việc
                </Checkbox>
              </Form.Item>
            )}
          </Col> */}
        </Row>

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
          <TextArea
            rows={5}
            placeholder={
              "Ví dụ: “01 file hợp đồng dạng Word + PDF, có chú thích”, hoặc “Thiết kế logo + hướng dẫn sử dụng”"
            }
            size={"large"}
          />

          {/* <Form.List
            name="deliverableAttachments"
            rules={[
              {
                validator: async (_, fileList: DeliverableAttachment[]) => {
                  if (!fileList || fileList.length === 0) {
                    return Promise.reject(
                      new Error(
                        "Vui lòng đính kèm ít nhất một tệp sản phẩm đầu ra."
                      )
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                <div
                  className={`upload-area ${
                    errors.length > 0 ? "ant-form-item-has-error" : ""
                  }`}
                  style={{
                    border: errors.length > 0 ? "0.5px solid #ff4d4f" : "none",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "5px",
                    transition: "border-color 0.3s",
                  }}
                >
                  <Upload {...uploadProps(add)}>
                    <Button icon={<UploadOutlined />} size="large">
                      Tải lên tệp đính kèm
                    </Button>
                  </Upload>
                  <Text
                    type="secondary"
                    style={{ fontStyle: "normals", fontSize: "11px" }}
                  >
                    (*) Không giới hạn số lượng và dung lượng
                  </Text>
                </div>

                {errors.length > 0 && (
                  <div
                    style={{
                      color: "#ff4d4f",
                      fontSize: "12px",
                      marginTop: "4px",
                    }}
                  >
                    {errors.map((error, index) => (
                      <div key={index}>{error}</div>
                    ))}
                  </div>
                )}

                <div style={{ marginTop: 5, marginInline: 20 }}>
                  {fields.length > 0 && <Text>Tệp đính kèm đã chọn:</Text>}
                  <div
                    style={{
                      maxHeight: "350px",
                      overflowY: "auto",
                      paddingRight: "8px",
                    }}
                  >
                    {fields.map(({ key, name, ...restField }) => {
                      const file: DeliverableAttachment = form.getFieldValue([
                        "deliverableAttachments",
                        name,
                      ]);
                      if (!file) return null;

                      return (
                        <FilePreviewWithComment
                          key={key}
                          file={file}
                          name={name}
                          restField={restField}
                          onRemove={() => {
                            if (
                              file.previewUrl &&
                              file.previewUrl.startsWith("blob:")
                            ) {
                              URL.revokeObjectURL(file.previewUrl);
                            }

                            if (
                              file.thumbnailUrl &&
                              file.thumbnailUrl.startsWith("data:")
                            ) {
                            }
                            remove(name);
                          }}
                        />
                      );
                    })}
                    {fields.length === 0 && (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="Chưa có tệp đính kèm nào được chọn"
                        style={{ margin: "24px 0" }}
                      />
                    )}
                  </div>
                </div>
              </>
            )}
          </Form.List> */}
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

        {(partnerId !== 0) && (
          <Form.Item
            name="is_public"
            valuePropName="checked"
            label={null}
          >
            <Checkbox>
              Bạn có muốn đăng công việc này để các đối tác khác có thể ứng tuyển trong trường hợp đối tác được bạn mời từ chối lời mời này.
            </Checkbox>
          </Form.Item>
        )}
      </div>
    </div>
  );
}

export default JobScopeAndBudgetStep;
