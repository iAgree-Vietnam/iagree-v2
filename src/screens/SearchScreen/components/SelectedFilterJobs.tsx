import React, { useState, useMemo } from "react";
import { Button, Input, Space, Tag, Typography, Modal } from "antd";
import {
  CategoryResource,
  CateServiceResource,
  ServiceResource,
} from "@/src/data/category/models/category.types";
import { SkillResource } from "@/src/data/skill/models/skill.types";
import { JobsFilterParamsV2 } from "@/src/data/job/models/job.types";

const { Title, Text } = Typography;

interface SelectedTag {
  id?: number | string;
  type: keyof JobsFilterParamsV2;
  name: string;
  color: string;
}

type SelectedFilterJobsProps = {
  filters: JobsFilterParamsV2;
  categories: CategoryResource[];
  skills: SkillResource[];
  serviceCategories: CateServiceResource[];
  services: ServiceResource[];

  toggleCategory: (id: number) => void;
  toggleSkill: (id: number) => void;
  toggleServiceCategory: (id: number) => void;
  toggleServiceDetail: (id: number) => void;

  clearAllFilters: () => void;
  setFilters: React.Dispatch<React.SetStateAction<JobsFilterParamsV2>>;
};

const SelectedFilterJobs = ({
  filters,
  categories,
  skills,
  serviceCategories,
  services,
  toggleCategory,
  toggleSkill,
  toggleServiceCategory,
  toggleServiceDetail,
  clearAllFilters,
  setFilters,
}: SelectedFilterJobsProps) => {
  const TAG_COLORS = {
    category: "#09993E",
    skill: "#2980B9",
    serviceCategory: "#a7330cff",
    serviceDetail: "#FF9800",
    salaryType: "#6A5ACD",
    priceRange: "#FF6347",
    postingEndDate: "#8A2BE2",
    postedDate: "#FFA500",
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const getCategoryNameById = (id: number) =>
    categories.find((c) => c.categoryId === id)?.name || "Unknown";

  const getSkillNameById = (id: number) =>
    skills.find((sk) => sk.skillId === id)?.name || "Unknown";

  const getServiceCategoryNameById = (id: number) =>
    serviceCategories.find((sc) => sc.cateServiceId === id)?.name || "Unknown";

  const getServiceDetailNameById = (id: number) =>
    services.find((sd) => sd.serviceId === id)?.name || "Unknown";

  const getSalaryTypeName = (type: number | undefined) => {
    switch (type) {
      case 1:
        return "Thoả thuận";
      case 3:
        return "Cố định";
      default:
        return null;
    }
  };

  const getPriceRangeName = (
    min: number | null | undefined,
    max: number | null | undefined
  ) => {
    if (min === undefined && max === undefined) {
      return null;
    }
    const formattedMin = min
      ? `${(min / 1000000).toLocaleString()} triệu`
      : undefined;
    const formattedMax = max
      ? `${(max / 1000000).toLocaleString()} triệu`
      : undefined;

    if (min && max) {
      return `Từ ${formattedMin} đến ${formattedMax}`;
    }
    if (min) {
      return `Lớn hơn ${formattedMin}`;
    }
    if (max) {
      return `Nhỏ hơn ${formattedMax}`;
    }
    return null;
  };

  const getPostedDateRangeName = (range: string | undefined) => {
    switch (range) {
      case "today":
        return "Hôm nay";
      case "last7days":
        return "Trong 7 ngày qua";
      case "last30days":
        return "Trong 30 ngày qua";
      case "last90days":
        return "Trong 90 ngày qua";
      default:
        return null;
    }
  };

  const removeFilter = (type: SelectedTag["type"], id?: number | string) => {
    switch (type) {
      case "jobCategoryIds":
        toggleCategory(id as number);
        break;
      case "jobSkillIds":
        toggleSkill(id as number);
        break;
      case "jobServiceCategoryIds":
        toggleServiceCategory(id as number);
        break;
      case "jobServiceIds":
        toggleServiceDetail(id as number);
        break;
      case "salaryId":
        setFilters((prev) => ({
          ...prev,
          salaryType: undefined,
          priceMin: null,
          priceMax: null,
        }));
        break;
      case "priceMin":
      case "priceMax":
        setFilters((prev) => ({
          ...prev,
          priceMin: null,
          priceMax: null,
        }));
        break;
      case "postingEndDate":
        setFilters((prev) => ({ ...prev, postingEndDate: null }));
        break;
      case "postedDateRange":
        setFilters((prev) => ({ ...prev, postedDateRange: null }));
        break;
      default:
        break;
    }
  };

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const allFilteredTags = useMemo(() => {
    const tags: SelectedTag[] = [];

    if (
      filters.jobCategoryIds !== undefined &&
      filters.jobCategoryIds.length > 0
    ) {
      filters.jobCategoryIds.forEach((id) =>
        tags.push({
          id,
          type: "jobCategoryIds",
          name: `Lĩnh vực: ${getCategoryNameById(id)}`,
          color: TAG_COLORS.category,
        })
      );
    }

    if (filters.jobSkillIds !== undefined && filters.jobSkillIds.length > 0) {
      filters.jobSkillIds.forEach((id) =>
        tags.push({
          id,
          type: "jobSkillIds",
          name: `Kỹ năng: ${getSkillNameById(id)}`,
          color: TAG_COLORS.skill,
        })
      );
    }

    if (
      filters.jobServiceCategoryIds !== undefined &&
      filters.jobServiceCategoryIds.length > 0
    ) {
      filters.jobServiceCategoryIds.forEach((id) =>
        tags.push({
          id,
          type: "jobServiceCategoryIds",
          name: `DMDV: ${getServiceCategoryNameById(id)}`,
          color: TAG_COLORS.serviceCategory,
        })
      );
    }

    if (
      filters.jobServiceIds !== undefined &&
      filters.jobServiceIds.length > 0
    ) {
      filters.jobServiceIds.forEach((id) =>
        tags.push({
          id,
          type: "jobServiceIds",
          name: `Dịch vụ: ${getServiceDetailNameById(id)}`,
          color: TAG_COLORS.serviceDetail,
        })
      );
    }

    if (filters.salaryId != null) {
      const salaryName = getSalaryTypeName(filters.salaryId);
      if (salaryName) {
        tags.push({
          id: "salaryId",
          type: "salaryId",
          name: `Thù lao: ${salaryName}`,
          color: TAG_COLORS.salaryType,
        });
      }
    }

    const priceRangeName = getPriceRangeName(
      filters.priceMin,
      filters.priceMax
    );
    if (priceRangeName) {
      tags.push({
        id: "priceRange",
        type: "priceMin",
        name: `Ngân sách: ${priceRangeName}`,
        color: TAG_COLORS.salaryType,
      });
    }

    if (filters.postingEndDate) {
      tags.push({
        id: "postingEndDate",
        type: "postingEndDate",
        name: `Thời hạn ứng tuyển: ${filters.postingEndDate}`,
        color: TAG_COLORS.postingEndDate,
      });
    }

    if (filters.postedDateRange != null) {
      const postedDateName = getPostedDateRangeName(filters.postedDateRange);
      if (postedDateName) {
        tags.push({
          id: "postedDateRange",
          type: "postedDateRange",
          name: `Thời gian đăng công việc: ${postedDateName}`,
          color: TAG_COLORS.postedDate,
        });
      }
    }

    if (!normalizedSearch) {
      return tags;
    }

    return tags.filter((tag) =>
      tag.name.toLowerCase().includes(normalizedSearch)
    );
  }, [
    filters.jobCategoryIds,
    filters.jobSkillIds,
    filters.jobServiceCategoryIds,
    filters.jobServiceIds,
    filters.salaryId,
    filters.priceMin,
    filters.priceMax,
    filters.postingEndDate,
    filters.postedDateRange,
    normalizedSearch,
    categories,
    skills,
    TAG_COLORS,
  ]);

  const hasAnyFilter = useMemo(
    () => allFilteredTags !== undefined && allFilteredTags.length > 0,
    [allFilteredTags]
  );

  const total = useMemo(() => allFilteredTags?.length ?? 0, [allFilteredTags]);
  const displayLimit = 5;

  const renderTagContent = (label: string) => (
    <span
      title={label}
      style={{
        flex: "1",
        minWidth: 0,
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
      }}
    >
      {label}
    </span>
  );

  const renderTags = (tagsToRender: SelectedTag[]) =>
    tagsToRender.map((tag, index) => (
      <Tag
        key={`${tag?.type}-${tag?.id}-${index}`}
        color={tag?.color}
        style={{
          borderRadius: 20,
          border: `1px solid ${tag?.color}`,
          // color: "#fff",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          minWidth: "auto",
          maxWidth: 250,
        }}
        closable
        onClose={() => removeFilter(tag?.type, tag?.id)}
      >
        {renderTagContent(tag?.name)}
      </Tag>
    ));

  const separatedTags = useMemo(() => {
    if (allFilteredTags !== undefined) {
      const categoryTags = allFilteredTags.filter(
        (tag) => tag.type === "jobCategoryIds"
      );
      const skillTags = allFilteredTags.filter(
        (tag) => tag.type === "jobSkillIds"
      );
      const serviceCategoryTags = allFilteredTags.filter(
        (tag) => tag.type === "jobServiceCategoryIds"
      );
      const serviceTags = allFilteredTags.filter(
        (tag) => tag.type === "jobServiceIds"
      );
      const remunerationTags = allFilteredTags.filter(
        (tag) => tag.type === "salaryId" || tag.type === "priceMin"
      );
      const postingEndDateTags = allFilteredTags.filter(
        (tag) => tag.type === "postingEndDate"
      );
      const postedDateTags = allFilteredTags.filter(
        (tag) => tag.type === "postedDateRange"
      );
      return {
        categoryTags,
        skillTags,
        serviceCategoryTags,
        serviceTags,
        remunerationTags,
        postingEndDateTags,
        postedDateTags,
      };
    }
    return {
      categoryTags: [],
      skillTags: [],
      serviceCategoryTags: [],
      serviceTags: [],
      remunerationTags: [],
      postingEndDateTags: [],
      postedDateTags: [],
    };
  }, [allFilteredTags]);

  if (!hasAnyFilter) {
    return null;
  }

  return (
    <div
      style={{
        marginBottom: 12,
        padding: 16,
        height: "auto",
        background: "rgba(9, 153, 62, 0.1)",
        borderRadius: 6,
        border: "0.5px solid rgba(9, 153, 62, 0.5)",
        color: "#000",
      }}
    >
      <div
        style={{
          marginBottom: 12,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title level={5} style={{ margin: 0, color: "#000" }}>
          Bộ lọc đã chọn ({total})
        </Title>

        {hasAnyFilter && (
          <Button
            size="small"
            type="link"
            onClick={clearAllFilters}
            style={{ padding: 0, color: "#09993E" }}
          >
            Bỏ chọn tất cả
          </Button>
        )}
      </div>

      {hasAnyFilter && (
        <Input
          placeholder="Tìm bộ lọc..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          allowClear
          style={{ marginBottom: 12 }}
          size="small"
        />
      )}

      <div style={{ height: "auto", overflowY: "auto", paddingRight: 0 }}>
        <Space size={[8, 8]} wrap>
          {renderTags(allFilteredTags.slice(0, displayLimit))}

          {!hasAnyFilter && (
            <Text type="secondary" style={{ color: "#555" }}>
              Chưa chọn bộ lọc nào
            </Text>
          )}
        </Space>
      </div>

      {total > displayLimit && (
        <div style={{ textAlign: "right", marginTop: 8 }}>
          <Button
            type="link"
            size="small"
            onClick={() => setIsModalVisible(true)}
            style={{ color: "#000" }}
          >
            Xem thêm ({total - displayLimit} bộ lọc khác)
          </Button>
        </div>
      )}

      <Modal
        title={`Tất cả bộ lọc đã chọn (${total})`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={900}
      >
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          {separatedTags.categoryTags.length > 0 && (
            <div>
              <Title level={5} style={{ marginBottom: 8 }}>
                Lĩnh vực:
              </Title>
              <Space size={[8, 8]} wrap>
                {renderTags(separatedTags.categoryTags)}
              </Space>
            </div>
          )}
          {separatedTags.skillTags.length > 0 && (
            <div>
              <Title level={5} style={{ marginBottom: 8 }}>
                Kỹ năng:
              </Title>
              <Space size={[8, 8]} wrap>
                {renderTags(separatedTags.skillTags)}
              </Space>
            </div>
          )}
          {separatedTags.serviceCategoryTags.length > 0 && (
            <div>
              <Title level={5} style={{ marginBottom: 8 }}>
                DMDV:
              </Title>
              <Space size={[8, 8]} wrap>
                {renderTags(separatedTags.serviceCategoryTags)}
              </Space>
            </div>
          )}
          {separatedTags.serviceTags.length > 0 && (
            <div>
              <Title level={5} style={{ marginBottom: 8 }}>
                Dịch vụ:
              </Title>
              <Space size={[8, 8]} wrap>
                {renderTags(separatedTags.serviceTags)}
              </Space>
            </div>
          )}
          {separatedTags.remunerationTags.length > 0 && (
            <div>
              <Title level={5} style={{ marginBottom: 8 }}>
                Thù lao:
              </Title>
              <Space size={[8, 8]} wrap>
                {renderTags(separatedTags.remunerationTags)}
              </Space>
            </div>
          )}
          {separatedTags.postingEndDateTags.length > 0 && (
            <div>
              <Title level={5} style={{ marginBottom: 8 }}>
                Thời hạn ứng tuyển:
              </Title>
              <Space size={[8, 8]} wrap>
                {renderTags(separatedTags.postingEndDateTags)}
              </Space>
            </div>
          )}
          {separatedTags.postedDateTags.length > 0 && (
            <div>
              <Title level={5} style={{ marginBottom: 8 }}>
                Thời gian đăng công việc:
              </Title>
              <Space size={[8, 8]} wrap>
                {renderTags(separatedTags.postedDateTags)}
              </Space>
            </div>
          )}
        </Space>
      </Modal>
    </div>
  );
};

export default SelectedFilterJobs;
