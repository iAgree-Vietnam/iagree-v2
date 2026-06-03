import React, { useEffect } from "react";
import { Typography, Input, Button, Form, Row, Col, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import AppDatePicker from "@/src/components/date/DatePicker";
import datetimeUtils from "@/src/utils/DatetimeUtils";
import moment from "moment";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DraggableFormListItem from "./sections/DraggableFormListItem";
import Constants from "@/src/constants/Constants";

const { Title, Text } = Typography;
const { TextArea } = Input;

export interface ExperienceItem {
  name: string;
  position: string;
  start_date: string;
  end_date: string;
  description: string;
}

export interface Step4FormValues {
  workHistories: ExperienceItem[];
}

interface Step4PageProps {
  value?: Step4FormValues;
  onChange?: (value: Step4FormValues) => void;
}

const MAX_EXPERIENCES = 5;

export const Step4Page: React.FC<Step4PageProps> = ({ value, onChange }) => {
  const [form] = Form.useForm<Step4FormValues>();

  useEffect(() => {
    form.setFieldValue("workHistories", value?.workHistories);
  }, [value, form]);

  const handleAddExperience = (add: (defaultValue: ExperienceItem) => void) => {
    if (value?.workHistories && value.workHistories.length >= MAX_EXPERIENCES) {
      message.warning(
        `Bạn chỉ có thể thêm tối đa ${MAX_EXPERIENCES} kinh nghiệm.`
      );
      return;
    }
    add({
      name: "",
      position: "",
      start_date: "",
      end_date: "",
      description: "",
    });
  };

  // ✅ Parse chắc chắn theo backend format, và so theo "month"


  const handleDateChange = (
    fieldName: number, // name từ Form.List
    field: "start_date" | "end_date",
    date: moment.Moment | null
  ) => {
    const workHistories = form.getFieldValue("workHistories") || [];

    // fieldName trong Form.List là index hiện tại của array => map theo i
    const updatedHistories = workHistories.map((item: ExperienceItem, i: number) =>
      i === fieldName
        ? {
            ...item,
            [field]: date ? date.format(datetimeUtils.BACKEND_DATE_TIME) : "",
          }
        : item
    );

    form.setFieldsValue({ workHistories: updatedHistories });

    // ✅ validate đúng path theo fieldName
    form.validateFields([
      ["workHistories", fieldName, "start_date"],
      ["workHistories", fieldName, "end_date"],
    ]);
  };

  const maxLength = Constants.TEXT_MAX_LENGTH;

  // ✅ nếu bạn muốn chỉ cho chọn tới tháng trước (hiện tại - 1 tháng)
  const maxAllowedMonth = moment().subtract(1, "month").startOf("month");

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ padding: "0 0" }}>
        <div style={{ marginBottom: "15px" }}>
          <Title
            level={2}
            style={{ margin: 0, color: "#333", marginBottom: "10px" }}
          >
            Đã đến lúc chia sẻ về kinh nghiệm chuyên môn của bạn rồi!
          </Title>
          <Text style={{ color: "#09993E" }}>
            Chia sẻ những vị trí/ vai trò/ dự án/ thành tựu nổi bật để khách
            hàng hiểu rõ hơn về chuyên môn, phong cách làm việc và giá trị bạn
            mang lại. Đừng quên đưa số liệu cụ thể để ghi điểm với Khách hàng
            nhé!
          </Text>
        </div>

        <Form.List name="workHistories">
          {(fields, { add, remove, move }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => (
                <DraggableFormListItem
                  key={key}
                  index={index}
                  move={move}
                  remove={() => remove(index)}
                  fieldsLength={fields.length}
                >
                  <Title
                    level={5}
                    style={{ margin: "0 0 16px 0", color: "#09993E" }}
                  >
                    Kinh nghiệm ({index + 1})
                  </Title>

                  <Form.Item
                    {...restField}
                    name={[name, "name"]}
                    label={"Tổ chức/Công ty"}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập tổ chức/công ty",
                      },
                    ]}
                  >
                    <Input placeholder={"Vui lòng nhập tổ chức/công ty"} />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "position"]}
                    rules={[
                      { required: true, message: "Vui lòng nhập chức danh" },
                    ]}
                    label={"Chức danh"}
                  >
                    <Input placeholder={"Vui lòng nhập chức danh"} />
                  </Form.Item>

                  <Row gutter={20}>
                    <Col xs={24} md={24} lg={12}>
                      <div style={{ marginBottom: "8px" }}>
                        <Title level={5} style={{ margin: 0 }}>
                          Thời gian bắt đầu{" "}
                          <span style={{ color: "red" }}>*</span>
                        </Title>
                      </div>

                      <Form.Item
                        {...restField}
                        name={[name, "start_date"]}
                        dependencies={[[name, "end_date"]]}
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập thời gian bắt đầu",
                          },
                          {
                            validator: async (_, value) => {
                              const start = datetimeUtils.parseBackendMonth(value);
                              if (!start) return Promise.resolve();

                              const endValue = form.getFieldValue([
                                "workHistories",
                                name,
                                "end_date",
                              ]);
                              const end = datetimeUtils.parseBackendMonth(endValue);

                              // ✅ cho phép start=end (1/2026 cả 2 vẫn pass)
                              if (end && start.isAfter(end, "month")) {
                                return Promise.reject(
                                  new Error(
                                    "Thời gian bắt đầu phải nhỏ hơn hoặc bằng thời gian kết thúc"
                                  )
                                );
                              }
                              return Promise.resolve();
                            },
                          },
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
                          (value &&
                            value.format(datetimeUtils.BACKEND_DATE_TIME)) ||
                          ""
                        }
                      >
                        <AppDatePicker
                          className={"full-width"}
                          format={"MM/YYYY"}
                          picker="month"
                          placeholder={"mm/yyyy"}
                          onChange={(date) =>
                            handleDateChange(name, "start_date", date)
                          }
                          disabledDate={(current) => {
                            if (!current) return false;
                            // ✅ chặn sau tháng trước (current month - 1)
                            return current.startOf("month").isAfter(maxAllowedMonth, "month");
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
                        dependencies={[[name, "start_date"]]}
                        rules={[
                          {
                            validator: async (_, value) => {
                              if (!value) return Promise.resolve();

                              const end = datetimeUtils.parseBackendMonth(value);
                              if (!end) return Promise.resolve();

                              const startValue = form.getFieldValue([
                                "workHistories",
                                name,
                                "start_date",
                              ]);
                              const start = datetimeUtils.parseBackendMonth(startValue);
                              if (!start) return Promise.resolve();

                              // ✅ cho phép end = start (1/2026 cả 2 pass)
                              if (end.isBefore(start, "month")) {
                                return Promise.reject(
                                  new Error(
                                    "Thời gian kết thúc phải lớn hơn hoặc bằng thời gian bắt đầu"
                                  )
                                );
                              }

                              return Promise.resolve();
                            },
                          },
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
                          (value &&
                            value.format(datetimeUtils.BACKEND_DATE_TIME)) ||
                          ""
                        }
                      >
                        <AppDatePicker
                          className={"full-width"}
                          format={"MM/YYYY"}
                          picker="month"
                          placeholder={"mm/yyyy"}
                          onChange={(date) =>
                            handleDateChange(name, "end_date", date)
                          }
                          // disabledDate={(current) => {
                          //   if (!current) return false;
                          //   // ✅ chặn sau tháng trước (current month - 1)
                          //   return current.startOf("month").isAfter(maxAllowedMonth, "month");
                          // }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    {...restField}
                    name={[name, "description"]}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập mô tả công việc",
                      },
                      {
                        max: maxLength,
                        message: `Mô tả không được vượt quá ${maxLength} ký tự.`,
                      },
                    ]}
                    label={"Mô tả công việc"}
                  >
                    <TextArea
                      rows={3}
                      placeholder={"Vui lòng nhập mô tả công việc"}
                    />
                  </Form.Item>

                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) => {
                      const prevDesc =
                        prevValues.workHistories?.[index]?.description;
                      const currDesc =
                        currentValues.workHistories?.[index]?.description;
                      return prevDesc !== currDesc;
                    }}
                  >
                    {({ getFieldValue }) => {
                      const currentDescription = getFieldValue([
                        "workHistories",
                        name,
                        "description",
                      ]);
                      const currentLength = currentDescription?.length || 0;

                      return (
                        <div style={{ textAlign: "right", marginTop: "-12px" }}>
                          <Text
                            type="secondary"
                            style={{
                              color:
                                currentLength > maxLength ? "red" : undefined,
                            }}
                          >
                            ({currentLength} / {maxLength})
                          </Text>
                        </div>
                      );
                    }}
                  </Form.Item>
                </DraggableFormListItem>
              ))}

              <Form.Item style={{ marginTop: 16 }}>
                <Button
                  type="dashed"
                  onClick={() => handleAddExperience(add)}
                  block
                  icon={<PlusOutlined />}
                >
                  Thêm kinh nghiệm
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </div>
    </DndProvider>
  );
};
