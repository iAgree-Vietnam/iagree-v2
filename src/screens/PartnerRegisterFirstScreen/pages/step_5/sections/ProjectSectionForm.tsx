"use client";

import { Typography, Input, Form, Row, Col } from "antd";
import dayjs from "dayjs";

import AppDatePicker from "@/src/components/date/DatePicker";
import datetimeUtils from "@/src/utils/DatetimeUtils";
import { CoverUploadProjectImage } from "./CoverUploadProjectImage";
import { ProjectItemStep5 } from "./ProjectItemStep5";
import moment, { Moment } from "moment";
import Constants from "@/src/constants/Constants";

const { Title, Text } = Typography;
const { TextArea } = Input;

export interface ProjectItem {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  role: string;
  achievements: string;
  projectUrl?: string;
  image?: File;
  files?: File[];
}

interface ProjectItemFormProps {
  name: number;
  restField: any;
  remove: (index: number) => void;
  index: number;
}

const ProjectItemForm: React.FC<ProjectItemFormProps> = ({
  name,
  restField,
  remove,
  index,
}) => {
  const form = Form.useFormInstance();

  const handleDateChange = (
    field: "start_date" | "end_date",
    date: Moment | null,
    dateString: string
  ) => {
    const featuredProjects = form.getFieldValue("featuredProjects");
    const updatedProjects = [...featuredProjects];

    if (updatedProjects[name]) {
      updatedProjects[name][field] = date
        ? date.format(datetimeUtils.BACKEND_DATE_TIME)
        : null;
    }

    form.setFieldsValue({ featuredProjects: updatedProjects });
    form.validateFields([
      ["featuredProjects", name, "start_date"],
      ["featuredProjects", name, "end_date"],
    ]);
  };

  const featuredProjects = Form.useWatch("featuredProjects", form) || [];
  const maxLength = Constants.TEXT_MAX_LENGTH;

  return (
    <div key={restField.key}>
      <Title level={5} style={{ margin: "0 0 16px 0", color: "#09993E" }}>
        Dự án ({index + 1})
      </Title>
      <Row gutter={32}>
        <Col xs={24} lg={12}>
          <Form.Item
            {...restField}
            name={[name, "name"]}
            label="Tên dự án"
            rules={[{ required: true, message: "Vui lòng nhập tên dự án" }]}
          >
            <Input
              placeholder="Nhập tên dự án"
              size="middle"
              style={{ borderRadius: "10px" }}
            />
          </Form.Item>

          <Form.Item
            {...restField}
            name={[name, "role"]}
            label="Vai trò trong dự án"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập vai trò trong dự án",
              },
            ]}
          >
            <Input
              placeholder="Nhập vai trò trong dự án"
              size="middle"
              style={{ borderRadius: "10px" }}
            />
          </Form.Item>

          <Row gutter={20}>
            <Col xs={24} md={24} lg={12}>
              <div style={{ marginBottom: "8px" }}>
                <Title level={5} style={{ margin: 0 }}>
                  Thời gian bắt đầu <span style={{ color: "red" }}>*</span>
                </Title>
              </div>
              <Form.Item
                {...restField}
                name={[name, "start_date"]}
                dependencies={[["featuredProjects", name, "end_date"]]}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập thời gian bắt đầu",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value) {
                        return Promise.resolve();
                      }
                      const startDate = dayjs(value);
                      const endDateValue = getFieldValue([
                        "featuredProjects",
                        name,
                        "end_date",
                      ]);
                      if (endDateValue) {
                        const endDate = dayjs(endDateValue);
                        if (
                          startDate.isAfter(endDate) ||
                          startDate.isSame(endDate)
                        ) {
                          return Promise.reject(
                            new Error(
                              "Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc"
                            )
                          );
                        }
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
                getValueProps={(value) => ({
                  value:
                    value &&
                    datetimeUtils.getMoment(
                      value,
                      datetimeUtils.BACKEND_DATE_TIME
                    ),
                })}
                normalize={(value) =>
                  (value && value.format(datetimeUtils.BACKEND_DATE_TIME)) || ""
                }
              >
                <AppDatePicker
                  className={"full-width"}
                  format={"MM/YYYY"}
                  picker="month"
                  placeholder={"mm/yyyy"}
                  onChange={(date, dateString) =>
                    handleDateChange(
                      "start_date",
                      date,
                      Array.isArray(dateString) ? dateString[0] : dateString
                    )
                  }
                  disabledDate={(current) => {
                    if (!current) return false;
                    // chặn mọi tháng sau tháng hiện tại
                    return current.isAfter(moment(), "month");
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={12}>
              <div style={{ marginBottom: "8px" }}>
                <Title level={5} style={{ margin: 0 }}>
                  Thời gian kết thúc
                  <Typography.Text
                    type="secondary"
                    style={{
                      color: "#8c8c8c",
                      marginLeft: 3,
                      fontSize: 13,
                    }}
                  >
                    (tuỳ chọn)
                  </Typography.Text>
                </Title>
              </div>
              <Form.Item
                {...restField}
                name={[name, "end_date"]}
                dependencies={[["featuredProjects", name, "start_date"]]}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value) {
                        return Promise.resolve();
                      }
                      const endDate = dayjs(value);
                      const startDateValue = getFieldValue([
                        "featuredProjects",
                        name,
                        "start_date",
                      ]);
                      if (startDateValue) {
                        const startDate = dayjs(startDateValue);
                        if (
                          endDate.isBefore(startDate) ||
                          endDate.isSame(startDate)
                        ) {
                          return Promise.reject(
                            new Error(
                              "Thời gian kết thúc phải lớn hơn thời gian bắt đầu"
                            )
                          );
                        }
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
                getValueProps={(value) => ({
                  value:
                    value &&
                    datetimeUtils.getMoment(
                      value,
                      datetimeUtils.BACKEND_DATE_TIME
                    ),
                })}
                normalize={(value) =>
                  (value && value.format(datetimeUtils.BACKEND_DATE_TIME)) || ""
                }
              >
                <AppDatePicker
                  className={"full-width"}
                  format={"MM/YYYY"}
                  picker="month"
                  placeholder={"mm/yyyy"}
                  onChange={(date, dateString) =>
                    handleDateChange(
                      "end_date",
                      date,
                      Array.isArray(dateString) ? dateString[0] : dateString
                    )
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            {...restField}
            name={[name, "description"]}
            label="Mô tả"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mô tả dự án",
              },
              {
                max: maxLength,
                message: `Mô tả không được vượt quá ${maxLength} ký tự.`,
              },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Nhập mô tả dự án..."
              style={{
                borderRadius: "10px",
                resize: "none",
              }}
            />
          </Form.Item>

          <div style={{ textAlign: "right", marginTop: "-12px" }}>
            <Text
              type="secondary"
              style={{
                color:
                  featuredProjects[index]?.description?.length > maxLength
                    ? "red"
                    : undefined,
              }}
            >
              (
              {`${
                featuredProjects[index]?.description?.length || 0
              } / ${maxLength}`}
              )
            </Text>
          </div>

          <Form.Item
            {...restField}
            name={[name, "achievements"]}
            label="Thành tựu nổi bật"
            rules={[
              {
                max: maxLength,
                message: `Thành tựu không được vượt quá ${maxLength} ký tự.`,
              },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Nhập thành tựu nổi bật..."
              style={{
                borderRadius: "10px",
                resize: "none",
              }}
            />
          </Form.Item>

          <div style={{ textAlign: "right", marginTop: "-12px" }}>
            <Text
              type="secondary"
              style={{
                color:
                  featuredProjects[index]?.achievements?.length > maxLength
                    ? "red"
                    : undefined,
              }}
            >
              (
              {`${
                featuredProjects[index]?.achievements?.length || 0
              } / ${maxLength}`}
              )
            </Text>
          </div>
        </Col>
        <Col xs={24} lg={12}>
          <Form.Item
            {...restField}
            label="Hình bìa"
            name={[name, "image"]}
            rules={[
              {
                required: true,
                message: "Vui lòng chọn hình bìa dự án",
              },
            ]}
          >
            <CoverUploadProjectImage />
          </Form.Item>

          <Form.Item
            {...restField}
            name={[name, "files"]}
            valuePropName="value"
            getValueFromEvent={(files: File[]) => files}
          >
            <ProjectItemStep5 />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

export default ProjectItemForm;
