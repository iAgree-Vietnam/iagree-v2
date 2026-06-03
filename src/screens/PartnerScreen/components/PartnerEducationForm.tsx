import { Input, Form, Button, Row, Col, Typography } from 'antd';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import dayjs from "dayjs";
import AppDatePicker from '@/src/components/date/DatePicker';
import datetimeUtils from '@/src/utils/DatetimeUtils';
import { EducationItem } from '../../PartnerRegisterFirstScreen/pages/step_6/Step6Page';
import moment, { Moment } from "moment";
import Constants from '@/src/constants/Constants';

const { Title, Text } = Typography;
const { TextArea } = Input;

export function PartnerEducationForm() {
  const form = Form.useFormInstance();
  const partnerEducations = Form.useWatch('partnerEducations', form) || [];

  const handleDateChange = (
    index: number,
    field: "start_date" | "end_date",
    date: moment.Moment | null
  ) => {
    const partnerEducations = form.getFieldValue("partnerEducations");
    const updatedEducations = partnerEducations.map(
      (item: EducationItem, i: number) =>
        i === index
          ? {
            ...item,
            [field]: date
              ? date.format(datetimeUtils.BACKEND_DATE_TIME_V2)
              : null,
          }
          : item
    );

    form.setFieldsValue({ partnerEducations: updatedEducations });
    form.validateFields([
      ["partnerEducations", index, "start_date"],
      ["partnerEducations", index, "end_date"],
    ]);
  };

  const handleAddEducation = (
    add: (defaultValue: any) => void,
    type: "education" | "certificate"
  ) => {
    if (type === "education") {
      add({
        type: "education",
        name: "",
        degree: "",
        majors: "",
        start_date: "",
        end_date: "",
        description: "",
      });
    } else {
      add({
        type: "certificate",
        name: "",
        grade: "",
        start_date: "",
        end_date: "",
        description: "",
      });
    }
  };

  const handleRemove = (remove: (index: number) => void, index: number) => {
    remove(index);
  };

  const maxLength = Constants.TEXT_MAX_LENGTH;

  return (
    <Form.List name="partnerEducations">
      {(fields, { add, remove }) => {
        return (
          <>
            {fields.map(({ key, name, ...restField }, index) => {
              const formValues =
                form.getFieldValue(["partnerEducations", name]) || {};
              const formType = formValues.type || "education";

              return (
                <div
                  key={key}
                  className={"experienceFormItem"}
                  style={{
                    marginBottom: 24,
                    padding: 16,
                    border: "1px solid #d9d9d9",
                    borderRadius: 8,
                    position: "relative",
                  }}
                >
                  <Button
                    className={"deleteBtn"}
                    type={"text"}
                    icon={<CloseOutlined />}
                    onClick={() => handleRemove(remove, name)}
                    style={{ position: "absolute", top: 8, right: 8 }}
                  />

                  <Title
                    level={5}
                    style={{ margin: "0 0 16px 0", color: "#09993E" }}
                  >
                    {formType === "education"
                      ? "Mục học vấn "
                      : "Mục chứng chỉ "}
                    ({index + 1})
                  </Title>

                  <Form.Item {...restField} name={[name, "type"]} hidden>
                    <Input />
                  </Form.Item>

                  {formType === "education" ? (
                    <>
                      <div style={{ marginBottom: "8px" }}>
                        <Title level={5} style={{ margin: 0 }}>
                          Tên trường <span style={{ color: "red" }}>*</span>
                        </Title>
                      </div>
                      <Form.Item
                        {...restField}
                        name={[name, "name"]}
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập tên trường",
                          },
                        ]}
                      >
                        <Input placeholder={"Vui lòng nhập tên trường"} />
                      </Form.Item>

                      <div style={{ marginBottom: "8px" }}>
                        <Title level={5} style={{ margin: 0 }}>
                          Bằng cấp
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
                      <Form.Item {...restField} name={[name, "degree"]}>
                        <Input
                          placeholder={"Vd: Cử nhân, Thạc sĩ, Tiến sĩ"}
                        />
                      </Form.Item>

                      <div style={{ marginBottom: "8px" }}>
                        <Title level={5} style={{ margin: 0 }}>
                          Chuyên ngành
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
                      <Form.Item {...restField} name={[name, "majors"]}>
                        <Input placeholder={"Vd: Công nghệ thông tin"} />
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
                            dependencies={[
                              ["partnerEducations", name, "end_date"],
                            ]}
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập thời gian bắt đầu",
                              },
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  if (!value) return Promise.resolve();
                                  const startDate = dayjs(value);
                                  const endDateValue = getFieldValue([
                                    "partnerEducations",
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
                                  datetimeUtils.BACKEND_DATE_TIME_V2
                                ),
                            })}
                            normalize={(value) =>
                              (value &&
                                value.format(
                                  datetimeUtils.BACKEND_DATE_TIME_V2
                                )) ||
                              ""
                            }
                          >
                            <AppDatePicker
                              className={"full-width"}
                              format={"MM/YYYY"}
                              picker="month"
                              placeholder={"mm/yyyy"}
                              onChange={(date: Moment | null) =>
                                handleDateChange(name, "start_date", date)
                              }
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} md={24} lg={12}>
                          <div style={{ marginBottom: "8px" }}>
                            <Title level={5} style={{ margin: 0 }}>
                              Thời gian kết thúc{" "}
                              <span style={{ color: "red" }}>*</span>
                            </Title>
                          </div>
                          <Form.Item
                            {...restField}
                            name={[name, "end_date"]}
                            dependencies={[
                              ["partnerEducations", name, "start_date"],
                            ]}
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập thời gian kết thúc",
                              },
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  if (!value) return Promise.resolve();
                                  const endDate = dayjs(value);
                                  const startDateValue = getFieldValue([
                                    "partnerEducations",
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
                                  datetimeUtils.BACKEND_DATE_TIME_V2
                                ),
                            })}
                            normalize={(value) =>
                              (value &&
                                value.format(
                                  datetimeUtils.BACKEND_DATE_TIME_V2
                                )) ||
                              ""
                            }
                          >
                            <AppDatePicker
                              className={"full-width"}
                              format={"MM/YYYY"}
                              picker="month"
                              placeholder={"mm/yyyy"}
                              onChange={(date: Moment | null) =>
                                handleDateChange(name, "end_date", date)
                              }
                            />
                          </Form.Item>
                        </Col>
                      </Row>

                      <div style={{ marginBottom: "8px" }}>
                        <Title level={5} style={{ margin: 0 }}>
                          Mô tả
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
                        name={[name, "description"]}
                        rules={[
                          {
                            max: maxLength,
                            message: `Mô tả không được vượt quá ${maxLength} ký tự.`,
                          },
                        ]}
                      >
                        <TextArea
                          placeholder={"Mô tả về quá trình học tập"}
                          maxLength={maxLength}
                          autoSize={{ minRows: 4, maxRows: 8 }}
                        />
                      </Form.Item>

                      <div style={{ textAlign: "right", marginTop: "-12px" }}>
                        <Text
                          type="secondary"
                          style={{
                            color: partnerEducations[index]?.description?.length > maxLength ? "red" : undefined,
                          }}
                        >
                          ({`${partnerEducations[index]?.description?.length || 0} / ${maxLength}`})
                        </Text>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ marginBottom: "8px" }}>
                        <Title level={5} style={{ margin: 0 }}>
                          Tên chứng chỉ{" "}
                          <span style={{ color: "red" }}>*</span>
                        </Title>
                      </div>
                      <Form.Item
                        {...restField}
                        name={[name, "name"]}
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập tên chứng chỉ",
                          },
                        ]}
                      >
                        <Input
                          placeholder={"Vui lòng nhập tên chứng chỉ"}
                        />
                      </Form.Item>

                      <div style={{ marginBottom: "8px" }}>
                        <Title level={5} style={{ margin: 0 }}>
                          Điểm
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
                      <Form.Item {...restField} name={[name, "grade"]}>
                        <Input placeholder={"Vui lòng nhập điểm"} />
                      </Form.Item>

                      <Row gutter={20}>
                        <Col  xs={24} md={24}  lg={12}>
                          <div style={{ marginBottom: "8px" }}>
                            <Title level={5} style={{ margin: 0 }}>
                              Ngày cấp{" "}
                              <span style={{ color: "red" }}>*</span>
                            </Title>
                          </div>
                          <Form.Item
                            {...restField}
                            name={[name, "start_date"]}
                            dependencies={[
                              ["partnerEducations", name, "end_date"],
                            ]}
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập ngày cấp",
                              },
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  if (!value) return Promise.resolve();
                                  const startDate = dayjs(value);
                                  const endDateValue = getFieldValue([
                                    "partnerEducations",
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
                                          "Ngày cấp phải nhỏ hơn ngày hết hạn"
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
                                  datetimeUtils.BACKEND_DATE_TIME_V2
                                ),
                            })}
                            normalize={(value) =>
                              (value &&
                                value.format(
                                  datetimeUtils.BACKEND_DATE_TIME_V2
                                )) ||
                              ""
                            }
                          >
                            <AppDatePicker
                              className={"full-width"}
                              format={"MM/YYYY"}
                              picker="month"
                              placeholder={"mm/yyyy"}
                              onChange={(date: Moment | null) =>
                                handleDateChange(name, "start_date", date)
                              }
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} md={24}  lg={12}>
                          <div style={{ marginBottom: "8px" }}>
                            <Title level={5} style={{ margin: 0 }}>
                              Ngày hết hạn
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
                            dependencies={[
                              ["partnerEducations", name, "start_date"],
                            ]}
                            rules={[
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  if (!value) return Promise.resolve();
                                  const endDate = dayjs(value);
                                  const startDateValue = getFieldValue([
                                    "partnerEducations",
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
                                          "Ngày hết hạn phải lớn hơn ngày cấp"
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
                                  datetimeUtils.BACKEND_DATE_TIME_V2
                                ),
                            })}
                            normalize={(value) =>
                              (value &&
                                value.format(
                                  datetimeUtils.BACKEND_DATE_TIME_V2
                                )) ||
                              ""
                            }
                          >
                            <AppDatePicker
                              className={"full-width"}
                              format={"MM/YYYY"}
                              picker="month"
                              placeholder={
                                "mm/yyyy (để trống nếu không hết hạn)"
                              }
                              onChange={(date: Moment | null) =>
                                handleDateChange(name, "end_date", date)
                              }
                            />
                          </Form.Item>
                        </Col>
                      </Row>

                      <div style={{ marginBottom: "8px" }}>
                        <Title level={5} style={{ margin: 0 }}>
                          Mô tả
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
                        name={[name, "description"]}
                        rules={[
                          {
                            max: maxLength,
                            message: `Mô tả không được vượt quá ${maxLength} ký tự.`,
                          },
                        ]}
                      >
                        <TextArea
                          placeholder={"Mô tả"}
                          maxLength={maxLength}
                          autoSize={{ minRows: 4, maxRows: 8 }}
                        />
                      </Form.Item>

                      <div style={{ textAlign: "right", marginTop: "-12px" }}>
                        <Text
                          type="secondary"
                          style={{
                            color: partnerEducations[index]?.description?.length > maxLength ? "red" : undefined,
                          }}
                        >
                          ({`${partnerEducations[index]?.description?.length || 0} / ${maxLength}`})
                        </Text>
                      </div>
                    </>
                  )}
                </div>
              );
            })}

            <Form.Item>
              <Row gutter={16}>
                <Col>
                  <Button
                    type="dashed"
                    onClick={() => handleAddEducation(add, "education")}
                    icon={<PlusOutlined />}
                  >
                    Thêm học vấn
                  </Button>
                </Col>
                <Col>
                  <Button
                    type="dashed"
                    onClick={() => handleAddEducation(add, "certificate")}
                    icon={<PlusOutlined />}
                  >
                    Thêm chứng chỉ
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </>
        );
      }}
    </Form.List>
  );
}