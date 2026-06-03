"use client";


import { Form, Input, Select, Typography, Row, Col } from "antd";
import { FormInstance } from "antd/lib/form/Form";
import {
  CateServiceResource,
  ServiceResource,
} from "@/src/data/category/models/category.types";
import { SkillResource } from "@/src/data/skill/models/skill.types";
import { JobSelectboxResource } from "@/src/data/job/models/job.types";
import TextArea from "antd/lib/input/TextArea";
import JobAttachmentUpload from "./AttachmentUpload";
import Constants from "@/src/constants/Constants";
import AppDatePicker from "@/src/components/date/DatePicker";
import moment from "moment";
import datetimeUtils from "@/src/utils/DatetimeUtils";
import dynamic from "next/dynamic";
// import ReactQuill from "react-quill";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false }) as any;

const { Title, Text } = Typography;

interface JobGeneralInfoSectionProps {
  form: FormInstance;
  selectboxResource: JobSelectboxResource;
  salaryType: number;
  setSalaryType: (type: number) => void;
  selectedCategoryIds: number[] | number | undefined;
  filteredSkills: SkillResource[];
  serviceCategoriesAvailable: CateServiceResource[] | null;
  selectedCategoryServiceIds: number[] | number | undefined;
  servicesAvailable: ServiceResource[] | null;
}
export function JobGeneralInfoSection(props: JobGeneralInfoSectionProps) {
  const {
    form,
    selectboxResource,
    selectedCategoryIds,
    filteredSkills,
    serviceCategoriesAvailable,
    selectedCategoryServiceIds,
    servicesAvailable,
  } = props;
  const isJobRequirementsError =
    form.getFieldError("jobRequirements").length > 0;

  const isDisabledForCategorySelect =
    !selectedCategoryIds ||
    (Array.isArray(selectedCategoryIds) && selectedCategoryIds.length === 0);

  const skillRules = [
    {
      required: !isDisabledForCategorySelect,
      message: "Vui lòng chọn kỹ năng chính",
    },
  ];

  const maxLength = Constants.TEXT_MAX_LENGTH;
  const jobDescription = Form.useWatch("description", form);
  const currentLength = jobDescription ? jobDescription.length : 0;
  const values = form.getFieldsValue(true);

  return (
    <div
      className={"formGroupContainer"}
      style={{ borderBottom: "0px solid #D4D4D4" }}
    >
      <div className={"formGroupContentContainer"}>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            {/* Tên công việc - Full Width */}
            <div style={{ marginBottom: "8px" }}>
              <Title level={5} style={{ margin: 0 }}>
                Tên công việc{" "}
                <span style={{ color: "#E14141", fontSize: "14px" }}>*</span>
              </Title>
            </div>

            <Form.Item
              name={"name"}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên công việc",
                },
              ]}
            >
              <Input
                size={"large"}
                placeholder={"Nhập tên công việc"}
                variant={"outlined"}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <div style={{ marginBottom: "8px" }}>
              <Title level={5} style={{ margin: 0 }}>
                Thời hạn ứng tuyển
              </Title>
            </div>

            <Form.Item
              name={"posting_end_date"}
              rules={[
                {
                  validator: (_, value) => {
                    if (!value) {
                      return Promise.resolve();
                    }

                    const maxDate = moment().add(8, 'days').endOf('day');

                    if (value.isAfter(maxDate, 'day')) {
                      return Promise.reject(
                        new Error(
                          'Thời hạn nhận hồ sơ không được vượt quá 8 ngày kể từ hôm nay'
                        )
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              // getValueProps={(value) => ({
              //   value:
              //     value &&
              //     datetimeUtils.getMoment(
              //       value,
              //       datetimeUtils.BACKEND_DATE_TIME
              //     ),
              // })}
              // normalize={(value) =>
              //   (value && value.format(datetimeUtils.BACKEND_DATE_TIME)) || ""
              // }
            >
              <AppDatePicker
                format={"DD/MM/YYYY"}
                placeholder={"Chọn thời hạn nhận hồ sơ"}
                className={"full-width"}
                disabledDate={(d) => {
                  const today = moment().startOf('day');
                  const maxDate = moment().add(8, 'days').endOf('day');
                  return d.isBefore(today, "date") || d.isAfter(maxDate, "date");
                }}
                size={"large"}
                style={{ paddingTop: "13px", paddingBottom: "12px" }}
                inputReadOnly
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Lĩnh vực và Kỹ năng yêu cầu - Half Width trên màn hình lớn, Full Width trên màn hình nhỏ */}
        <Row gutter={16}>
          <Col xs={24} md={12}>
            {" "}
            {/* Full width on extra small screens, half width on medium and up */}
            <Form.Item
              label={"Lĩnh vực"}
              name={"category_project_ids"}
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn lĩnh vực công việc",
                },
              ]}
            >
              <Select
                // mode={"multiple"}
                options={selectboxResource.categories.map((catItem) => ({
                  value: catItem.categoryId,
                  label: catItem.name,
                }))}
                placeholder={"Chọn lĩnh vực"}
                size={"large"}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            {" "}
            {/* Full width on extra small screens, half width on medium and up */}
            <Form.Item
              label={"Kỹ năng yêu cầu"}
              name={"skills"}
              rules={skillRules}
              required
            >
              <Select
                mode={"multiple"}
                options={filteredSkills.map((skillItem) => ({
                  value: skillItem.skillId,
                  label: skillItem.name,
                }))}
                placeholder={
                  isDisabledForCategorySelect
                    ? "Vui lòng chọn lĩnh vực trước"
                    : "Chọn kỹ năng chính"
                }
                disabled={isDisabledForCategorySelect}
                size={"large"}
                showSearch
                notFoundContent="Không có dữ liệu"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Danh mục dịch vụ và dịch vụ */}
        <Row gutter={16}>
          <Col xs={24} md={12}>
            {" "}
            {/* Full width on extra small screens, half width on medium and up */}
            <Form.Item
              label={"Danh mục dịch vụ"}
              name={"category_service_ids"}
              // rules={[
              //   {
              //     required: true,
              //     message: 'Vui lòng chọn danh mục dịch vụ công việc',
              //   },
              // ]}
            >
              <Select
                mode={"multiple"}
                options={serviceCategoriesAvailable?.map((catItem) => ({
                  value: catItem.cateServiceId,
                  label: catItem.name,
                }))}
                placeholder={
                  !selectedCategoryIds
                    ? "Vui lòng chọn lĩnh vực"
                    : "Chọn danh mục dịch vụ"
                }
                size={"large"}
                showSearch
                disabled={
                  !selectedCategoryIds ||
                  (Array.isArray(selectedCategoryIds) &&
                    selectedCategoryIds.length === 0)
                }
                notFoundContent="Không có dữ liệu"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            {" "}
            {/* Full width on extra small screens, half width on medium and up */}
            <Form.Item
              label={"Dịch vụ"}
              name={"service_ids"}
              // rules={[
              //   {
              //     required: true,
              //     message: 'Vui lòng chọn dịch vụ công việc',
              //   },
              // ]}
            >
              <Select
                mode={"multiple"}
                options={servicesAvailable?.map((serviceItem) => ({
                  value: serviceItem.serviceId,
                  label: serviceItem.name,
                }))}
                placeholder={
                  !selectedCategoryServiceIds
                    ? "Vui lòng chọn danh mục dịch vụ"
                    : "Chọn dịch vụ"
                }
                size={"large"}
                showSearch
                disabled={
                  !selectedCategoryServiceIds ||
                  (Array.isArray(selectedCategoryServiceIds) &&
                    selectedCategoryServiceIds.length === 0)
                }
                notFoundContent="Không có dữ liệu"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Mô tả yêu cầu công việc - Full Width */}
        <Form.Item
          // style={{
          //   marginBottom:"70px"
          // }}
          label={"Mô tả yêu cầu công việc"}
          name={"description"}
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mô tả yêu cầu công việc",
            },
            {
              max: maxLength,
              message: `Mô tả không được vượt quá ${maxLength} ký tự.`,
            },
          ]}
          className={
            isJobRequirementsError ? "errorTextArea" : "customTextArea"
          }
        >
          <ReactQuill
            placeholder="Nhập mô tả công việc tại đây..."
            defaultValue={values?.description || ""} // nội dung mặc định
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
            onChange={(v: string) => form.setFieldsValue({ description: v })}
            style={{ minHeight: 180 }} // chiều cao tổng thể của editor
          />

          <div style={{ color: "red" }}>
            Lưu ý: Nên mô tả nội dung công việc rõ ràng, chi tiết, định lượng
            nhất có thể để Đối tác thực hiện đúng, đủ các tiêu chí và yêu cầu.
            Mô tả công việc quá chung chung thường sẽ dẫn đến kết quả công việc
            không phù hợp và dễ xảy ra khiếu nại, tranh chấp không đáng có.
          </div>
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

        {/* Tệp đính kèm - Full Width (now using the new component) */}
        <Form.Item label={"Tệp đính kèm"} name={"attachment_files"}>
          <JobAttachmentUpload />
        </Form.Item>
      </div>
    </div>
  );
}

export default JobGeneralInfoSection;
