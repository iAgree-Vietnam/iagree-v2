import { Input, Form, Button, Row, Col, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from "moment";
import AppDatePicker from '@/src/components/date/DatePicker';
import datetimeUtils from '@/src/utils/DatetimeUtils';
import DraggableFormListItem from '../../PartnerRegisterFirstScreen/pages/step_4/sections/DraggableFormListItem';
import { ExperienceItem } from '../../PartnerRegisterFirstScreen/pages/step_4/Step4Page';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Constants from '@/src/constants/Constants';
const { Title, Text } = Typography;
const { TextArea } = Input;

export function PartnerExperience() {
  const form = Form.useFormInstance();
  const workHistories = Form.useWatch('workHistories', form) || [];

  const handleDateChange = (
    index: number,
    field: "start_date" | "end_date",
    date: moment.Moment | null
  ) => {
    const workHistories = form.getFieldValue("workHistories");
    
    const updatedHistories = workHistories.map(
      (item: ExperienceItem, i: number) =>
        i === index
          ? {
              ...item,
              [field]: date
                ? date.format(datetimeUtils.BACKEND_DATE_TIME_V2)
                : null,
            }
          : item
    );

    form.setFieldsValue({ workHistories: updatedHistories });
    form.validateFields([
      ["workHistories", index, "start_date"],
      ["workHistories", index, "end_date"],
    ]);
  };

  const handleAddExperience = (add: (defaultValue: ExperienceItem) => void) => {
    add({
      name: "",
      position: "",
      start_date: "",
      end_date: "",
      description: "",
    });
  };

  const maxLength = Constants.TEXT_MAX_LENGTH;

  return (
    <DndProvider backend={HTML5Backend}>
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
                <Col lg={12}>
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
                        validator: (_, value) => {
                          if (value) {
                            const startDate = moment(value);
                            const endDateValue = form.getFieldValue([
                              "workHistories",
                              name,
                              "end_date",
                            ]);
                            if (endDateValue) {
                              const endDate = moment(endDateValue);
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
                          datetimeUtils.BACKEND_DATE_TIME_V2
                        ),
                    })}
                    normalize={(value) =>
                      (value &&
                        value.format(datetimeUtils.BACKEND_DATE_TIME_V2)) ||
                      ""
                    }
                  >
                    <AppDatePicker
                      className={"full-width"}

                      format={datetimeUtils.LOCAL_DATE_WITHOUT_DAY}
                      placeholder={datetimeUtils.LOCAL_DATE.toLowerCase()}
                      onChange={(date) =>
                        handleDateChange(index, "start_date", date)
                      }
                      picker="month"
                    />
                  </Form.Item>
                </Col>

                <Col lg={12}>
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
                        validator: (_, value) => {
                          if (!value) {
                            return Promise.resolve();
                          }
                          const endDate = moment(value);
                          const startDateValue = form.getFieldValue([
                            "workHistories",
                            name,
                            "start_date",
                          ]);
                          if (startDateValue) {
                            const startDate = moment(startDateValue);
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
                      },
                    ]}
                    getValueProps={(value) => ({
                      value:
                        value &&
                        datetimeUtils.getMoment(
                          value,
                          datetimeUtils.BACKEND_DATE_TIME_V2
                        ),
                    })}
                    normalize={(value) =>
                      (value &&
                        value.format(datetimeUtils.BACKEND_DATE_TIME_V2)) ||
                      ""
                    }
                  >
                    <AppDatePicker
                      className={"full-width"}
                      format={datetimeUtils.LOCAL_DATE_WITHOUT_DAY}
                      placeholder={datetimeUtils.LOCAL_DATE_WITHOUT_DAY.toLowerCase()}
                      onChange={(date) =>
                        handleDateChange(index, "end_date", date)
                      }
                      picker="month"
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
                  placeholder="Ví dụ: Tôi là chuyên gia với 10 năm kinh nghiệm trong lĩnh vực thiết kế đồ họa. Tôi có khả năng biến ý tưởng của bạn thành những sản phẩm trực quan ấn tượng và hiệu quả."
                  maxLength={maxLength}
                  autoSize={{ minRows: 4, maxRows: 8 }}
                />
              </Form.Item>
              
              <div style={{ textAlign: "right", marginTop: "-12px" }}>
                <Text
                  type="secondary"
                  style={{
                    color: workHistories[index]?.description?.length > maxLength ? "red" : undefined,
                  }}
                >
                  ({`${workHistories[index]?.description?.length || 0} / ${maxLength}`})
                </Text>
              </div>
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
    </DndProvider>
  );
}
