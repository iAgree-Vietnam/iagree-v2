import React, { useState } from "react";
import { Form, Input, Select, Button, Typography, Row, Col, message } from "antd";
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
import AppDatePicker from '@/src/components/date/DatePicker';
import moment from 'moment';
import datetimeUtils from "@/src/utils/DatetimeUtils";

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
    servicesAvailable
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
              name={'posting_end_date'}
              // rules={[
              //   {
              //     required: true,
              //     message: 'Vui lòng chọn thời hạn ứng tuyển',
              //   },
              // ]}
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
                  value.format(
                    datetimeUtils.BACKEND_DATE_TIME
                  )) ||
                ""
              }
            >
              <AppDatePicker
                format={'DD/MM/YYYY'}
                placeholder={'Chọn thời hạn nhận hồ sơ'}
                className={'full-width'}
                disabledDate={(d) => d.isBefore(moment(), 'date')}
                size={'large'}
                style={{ paddingTop: '13px', paddingBottom: '12px' }}
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
                options={selectboxResource?.categories?.map((catItem) => ({
                  value: catItem?.categoryId,
                  label: catItem?.name,
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
              label={'Danh mục dịch vụ'}
              name={"category_service_ids"}
              // rules={[
              //   {
              //     required: true,
              //     message: 'Vui lòng chọn danh mục dịch vụ công việc',
              //   },
              // ]}
            >
              <Select
                mode={'multiple'}
                options={serviceCategoriesAvailable?.map(
                  (catItem) => ({
                    value: catItem.cateServiceId,
                    label: catItem.name,
                  })
                )}
                placeholder={!selectedCategoryIds ? "Vui lòng chọn lĩnh vực" : "Chọn danh mục dịch vụ"}
                size={'large'}
                showSearch
                disabled={!selectedCategoryIds || (Array.isArray(selectedCategoryIds) && selectedCategoryIds.length === 0)}
                notFoundContent="Không có dữ liệu"
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            {" "}
            {/* Full width on extra small screens, half width on medium and up */}
            <Form.Item
              label={'Dịch vụ'}
              name={"service_ids"}
              // rules={[
              //   {
              //     required: true,
              //     message: 'Vui lòng chọn dịch vụ công việc',
              //   },
              // ]}
            >
              <Select
                mode={'multiple'}
                options={servicesAvailable?.map(
                  (serviceItem) => ({
                    value: serviceItem.serviceId,
                    label: serviceItem.name,
                  })
                )}
                placeholder={!selectedCategoryServiceIds ? "Vui lòng chọn danh mục dịch vụ" : "Chọn dịch vụ"}
                size={'large'}
                showSearch
                disabled={
                  !selectedCategoryServiceIds || 
                  (Array.isArray(selectedCategoryServiceIds) && selectedCategoryServiceIds.length === 0)
                }
                notFoundContent="Không có dữ liệu"
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Mô tả yêu cầu công việc - Full Width */}
        <Form.Item
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
          <TextArea
            rows={5}
            placeholder={
              "Nhập mô tả chi tiết các yêu cầu công việc"
            }
            maxLength={maxLength}
            size={"large"}
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

        {/* Tệp đính kèm - Full Width (now using the new component) */}
        <Form.Item label={"Tệp đính kèm"} name={"attachments"}>
          <JobAttachmentUpload />
        </Form.Item>
      </div>
    </div>
  );
}

export default JobGeneralInfoSection;
