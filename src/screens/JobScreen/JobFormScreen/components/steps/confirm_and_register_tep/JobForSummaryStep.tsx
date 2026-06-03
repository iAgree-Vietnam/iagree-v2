import React, { useState, useEffect } from "react";
import {
  Descriptions,
  Typography,
  Space,
  Tag,
  UploadFile,
  Checkbox,
  Form,
  Table,
} from "antd";
import { FormInstance } from "antd/lib/form/Form";
import moment from "moment";

import { JobSelectboxResource } from "@/src/data/job/models/job.types";
import {
  CategoryResource,
  CateServiceResource,
  ServiceResource,
} from "@/src/data/category/models/category.types";
import { SkillResource } from "@/src/data/skill/models/skill.types";
import AttachmentDisplayCard from "./AttachmentDisplayCard";
import DeliverableDisplayCard from "./DeliverableDisplayCard";
import datetimeUtils from "@/src/utils/DatetimeUtils";
import Constants from "@/src/constants/Constants";
import JobTermsAndConditionsV2 from "./JobTermsAndConditionsV2";

const { Text } = Typography;

interface SummaryFile extends UploadFile {
  uid: string;
  name: string;
  url?: string;
  type?: string;
  comment?: string;
  previewUrl?: string;
}

// Extended interface to handle both data structures
export interface ExtendedJobSelectboxResource extends JobSelectboxResource {
  categoryServices?: CateServiceResource[];
  services?: ServiceResource[];
}

interface JobFormSummaryStepsProps {
  form: FormInstance;
  selectboxResource: ExtendedJobSelectboxResource;
  onAcceptConditionChange: (accepted: boolean) => void;
}

const JobFormSummaryStep: React.FC<JobFormSummaryStepsProps> = ({
  form,
  selectboxResource,
  onAcceptConditionChange,
}) => {
  const values = form.getFieldsValue(true);

  useEffect(() => {
    const initialAccept = form.getFieldValue("accept_condition");
    onAcceptConditionChange(!!initialAccept);
  }, [form, onAcceptConditionChange]);

  const getNameById = <T extends Record<string, any>>(
    id: number,
    list: T[],
    idKey: keyof T,
    nameKey: keyof T
  ) => {
    return list?.find((item) => item[idKey] === id)?.[nameKey] || "N/A";
  };

  const getNamesByIds = <T extends Record<string, any>>(
    ids: number[],
    list: T[],
    idKey: keyof T,
    nameKey: keyof T
  ) => {
    if (!Array.isArray(ids)) {
      ids = ids !== undefined && ids !== null ? [ids as number] : [];
    }
    if (ids.length === 0) return "N/A";

    return ids
      .map((id) => getNameById(id, list, idKey, nameKey))
      .filter((name) => name !== "N/A")
      .join(", ");
  };

  const categoryProjects: CategoryResource[] =
    selectboxResource?.categories || [];
  const allSkills: SkillResource[] = selectboxResource?.skills || [];

  // ADAPTIVE DATA LOADING: Handle both data structures with proper type casting
  const getAllCategoryServices = (): CateServiceResource[] => {
    // First, try to get from direct property (PartnerConnectModal case)
    if (
      selectboxResource?.categoryServices &&
      Array.isArray(selectboxResource.categoryServices)
    ) {
      return selectboxResource.categoryServices;
    }

    // Fallback: Extract from nested categories structure (original case)
    const nestedServices = categoryProjects
      .flatMap((cat) => cat.childrens || [])
      .filter(
        (item): item is CateServiceResource =>
          item !== null && item !== undefined
      );

    return nestedServices;
  };

  const getAllServices = (): ServiceResource[] => {
    // First, try to get from direct property (PartnerConnectModal case)
    if (
      selectboxResource?.services &&
      Array.isArray(selectboxResource.services)
    ) {
      return selectboxResource.services;
    }

    // Fallback: Extract from nested categoryServices structure (original case)
    const categoryServices = getAllCategoryServices();
    const nestedServices = categoryServices
      .flatMap((catService) => catService.childrens || [])
      .filter(
        (item): item is ServiceResource => item !== null && item !== undefined
      );

    return nestedServices;
  };

  const allCategoryServices: CateServiceResource[] = getAllCategoryServices();
  const allServices: ServiceResource[] = getAllServices();

  // ADAPTIVE ID FIELD DETECTION: Try multiple possible ID field names
  const findByIdFlexible = <T extends Record<string, any>>(
    id: number,
    list: T[],
    possibleIdFields: string[],
    nameKey: keyof T
  ): string => {
    for (const idField of possibleIdFields) {
      const found = list?.find((item) => item[idField] === id);
      if (found) {
        return found[nameKey] || "N/A";
      }
    }
    return "N/A";
  };

  const getCategoryProjectNames = (ids: number[]) => {
    if (!Array.isArray(ids)) {
      ids = ids !== undefined && ids !== null ? [ids as number] : [];
    }
    if (ids.length === 0) return "N/A";

    return ids
      .map((id) =>
        findByIdFlexible(id, categoryProjects, ["categoryId", "id"], "name")
      )
      .filter((name) => name !== "N/A")
      .join(", ");
  };

  const getCategoryServiceNames = (ids: number[]) => {
    if (!Array.isArray(ids)) {
      ids = ids !== undefined && ids !== null ? [ids as number] : [];
    }
    if (ids.length === 0) return "Chưa có";

    return ids
      .map((id) =>
        findByIdFlexible(
          id,
          allCategoryServices,
          ["cateServiceId", "id", "categoryServiceId"],
          "name"
        )
      )
      .filter((name) => name !== "N/A")
      .join(", ");
  };

  const getServiceNames = (ids: number[]) => {
    if (!Array.isArray(ids)) {
      ids = ids !== undefined && ids !== null ? [ids as number] : [];
    }
    if (ids.length === 0) return "Chưa có";

    return ids
      .map((id) =>
        findByIdFlexible(id, allServices, ["serviceId", "id"], "name")
      )
      .filter((name) => name !== "N/A")
      .join(", ");
  };

  // SKILL ID FIELD DETECTION: Make skills more flexible too
  const getSkillNames = (ids: number[]) => {
    if (!Array.isArray(ids)) {
      ids = ids !== undefined && ids !== null ? [ids as number] : [];
    }
    if (ids.length === 0) return [];

    return ids
      .map((id) => ({
        id,
        name: findByIdFlexible(id, allSkills, ["skillId", "id"], "name"),
      }))
      .filter((skill) => skill.name !== "N/A");
  };

  let jobType = "";
  if (values.job_type === Constants.JOB.JOB_TYPE.ONETIME) {
    jobType = "Công việc một lần";
  }

  let jobDurationType = "";
  if (values.job_duration_type === Constants.JOB.DURATION_TYPE.DAYS) {
    jobDurationType = "Ngày";
  } else if (values.job_duration_type === Constants.JOB.DURATION_TYPE.WEEKS) {
    jobDurationType = "Tuần";
  } else if (values.job_duration_type === Constants.JOB.DURATION_TYPE.MONTHS) {
    jobDurationType = "Tháng";
  }

  let jobSalaryType = "";
  let priceRange = "";
  if (values.salary_type === Constants.JOB.SALARY_TYPE.FIXED) {
    jobSalaryType = "Cố định";
    priceRange = `${values.price?.toLocaleString()} VNĐ`;
  } else if (values.salary_type === Constants.JOB.SALARY_TYPE.DEAL) {
    jobSalaryType = "Thỏa thuận";
    priceRange = `${values.price_min?.toLocaleString()} VNĐ - ${values.price_max?.toLocaleString()} VNĐ`;
  }

  const getJobDeadline = () => {
    if (values.duration && jobDurationType) {
      return `${values.duration} ${jobDurationType}`;
    } else if (!values.duration && values.start_date && values.end_date) {
      const startDate = datetimeUtils
        .getMoment(values.start_date, datetimeUtils.BACKEND_DATE_TIME)
        ?.format("DD/MM/YYYY");
      const endDate = datetimeUtils
        .getMoment(values.end_date, datetimeUtils.BACKEND_DATE_TIME)
        ?.format("DD/MM/YYYY");
      if (startDate && endDate) {
        return `${startDate} - ${endDate}`;
      }
    }
  };

  const dataSource = [
    {
      key: "1",
      label: "Loại công việc",
      value: jobType || "Chưa nhập",
    },
    {
      key: "2",
      label: "Thời gian thực hiện",
      value:
        // values.duration && jobDurationType
        //   ? `${values.duration} ${jobDurationType}`
        //   : "Chưa xác định",
        getJobDeadline(),
    },
    {
      key: "3",
      label: "Ngân sách dự kiến",
      value: `${jobSalaryType}: ${priceRange ? priceRange : "Chưa xác định"}`,
    },
    {
      key: "4",
      label: "Số lần nghiệm thu",
      value: values.number_accept
        ? `${values.number_accept} lần`
        : "Chưa xác định",
    },
    {
      key: "5",
      label: "Sản phẩm đầu ra mong muốn",
      value: values.deliverable_attachments || "Chưa xác định",
      // render: (val: any, record: any) => {
      //   // Nếu là HTML (như trường hợp 5), sử dụng dangerouslySetInnerHTML
      //   if (record.isHtml && val && val !== "Chưa xác định") {
      //     return (
      //       <div
      //         style={{
      //           fontSize: "14px",
      //           color: "#4b5563", // gray-600
      //           lineHeight: "1.6",
      //         }}
      //         dangerouslySetInnerHTML={{ __html: val }}
      //       />
      //     );
      //   }
      //   // Các trường text bình thường
      //   return <div
      //   style={{
      //     fontSize: "14px",
      //     color: "#4b5563", // gray-600
      //     lineHeight: "1.6",
      //   }}
      //   dangerouslySetInnerHTML={{ __html: val }}
      // />
      // },

    },
  ];

  const columns = [
    {
      title: "Thông tin",
      dataIndex: "label",
      key: "label",
      width: "auto", // để auto width
    },
    {
      title: "Chi tiết",
      dataIndex: "value",
      key: "value",
      // render: (val: string) => <Text>{val}</Text>,
      render: (val: any, record: any) => {
        // Nếu là HTML (như trường hợp 5), sử dụng dangerouslySetInnerHTML
        if (record.isHtml && val && val !== "Chưa xác định") {
          return (
            <div
              style={{
                fontSize: "14px",
                color: "#4b5563", // gray-600
                lineHeight: "1.6",
              }}
              dangerouslySetInnerHTML={{ __html: val }}
            />
          );
        }
        // Các trường text bình thường
        return <div
        style={{
          fontSize: "14px",
          color: "#4b5563", // gray-600
          lineHeight: "1.6",
        }}
        dangerouslySetInnerHTML={{ __html: val }}
      />
      },
    },
  ];
  return (
    <div className={"jobFormSummarySection"}>
      {/* Thông tin tổng quan */}
      <div className={"formGroupContainer"}>
        <div className={"formGroupTitleContainer"}>
          <h3 className={"formGroupTitle"}>Thông tin tổng quan</h3>
        </div>
        <div
          className={"formGroupContentContainer"}
          style={{ marginBottom: 24 }}
        >
          <Descriptions
            bordered
            column={1}
            size="small"
            labelStyle={{
              minWidth: "180px",
              maxWidth: "250px",
              width: "250px",
            }}
            className="summary-descriptions"
          >
            <Descriptions.Item label="Tên công việc">
              <Text>{values.name || "Chưa nhập"}</Text>
            </Descriptions.Item>

            <Descriptions.Item label="Thời hạn nhận hồ sơ">
              <Text>
                {datetimeUtils
                  .getMoment(
                    values.posting_end_date,
                    datetimeUtils.BACKEND_DATE_TIME
                  )
                  ?.format("DD/MM/YYYY") || "Chưa nhập"}
              </Text>
            </Descriptions.Item>

            <Descriptions.Item label="Lĩnh vực">
              {getCategoryProjectNames(values.category_project_ids)}
            </Descriptions.Item>

            <Descriptions.Item label="Kỹ năng yêu cầu">
              {values.skills && values.skills.length > 0 ? (
                <Space size={[0, 8]} wrap>
                  {getSkillNames(values.skills).map((skill) => (
                    <Tag key={skill.id}>{skill.name}</Tag>
                  ))}
                </Space>
              ) : (
                "Chưa nhập"
              )}
            </Descriptions.Item>

            <Descriptions.Item label="Danh mục dịch vụ">
              {values.category_service_ids &&
              values.category_service_ids.length > 0 ? (
                <Space size={[0, 8]} wrap>
                  {values.category_service_ids.map((id: number) => {
                    const name = findByIdFlexible(
                      id,
                      allCategoryServices,
                      ["cateServiceId", "id", "categoryServiceId"],
                      "name"
                    );
                    return name !== "N/A" ? <Tag key={id}>{name}</Tag> : null;
                  })}
                </Space>
              ) : (
                "Chưa nhập"
              )}
            </Descriptions.Item>

            <Descriptions.Item label="Dịch vụ">
              {values.service_ids && values.service_ids.length > 0 ? (
                <Space size={[0, 8]} wrap>
                  {values.service_ids.map((id: number) => {
                    const name = findByIdFlexible(
                      id,
                      allServices,
                      ["serviceId", "id"],
                      "name"
                    );
                    return name !== "N/A" ? <Tag key={id}>{name}</Tag> : null;
                  })}
                </Space>
              ) : (
                "Chưa nhập"
              )}
            </Descriptions.Item>

            <Descriptions.Item label="Mô tả công việc">
              <div style={{ whiteSpace: "pre-wrap" }}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: values.description,
                  }}
                />
              </div>
            </Descriptions.Item>

            <Descriptions.Item label="Tệp đính kèm">
              {values.attachment_files && values.attachment_files.length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {values.attachment_files.map(
                    (file: SummaryFile, index: number) => (
                      <AttachmentDisplayCard
                        key={file.uid || index}
                        file={file}
                      />
                    )
                  )}
                </div>
              ) : (
                "Chưa có tệp đính kèm nào"
              )}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>

      {/* Phạm vi & Ngân sách */}
      <div className={"formGroupContainer"}>
        <div className={"formGroupTitleContainer"}>
          <h3 className={"formGroupTitle"}>Phạm vi & Ngân sách</h3>
        </div>
        <div
          className={"formGroupContentContainer"}
          style={{ marginBottom: 24, overflowX: "auto" }}
        >
          <Table
            dataSource={dataSource}
            columns={columns}
            bordered
            pagination={false}
            size="small"
            style={{ minWidth: 400 }} // có thể set minWidth nếu muốn
          />
        </div>
        <JobTermsAndConditionsV2 form={form} />
      </div>
    </div>
  );
};

export default JobFormSummaryStep;
