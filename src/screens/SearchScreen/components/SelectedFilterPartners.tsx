import React, { useState, useMemo } from "react";
import { Button, Input, Space, Tag, Typography, Modal } from "antd";
import {
  CategoryResource,
  CateServiceResource,
  ServiceResource,
} from "@/src/data/category/models/category.types";
import { SkillResource } from "@/src/data/skill/models/skill.types";
import { LocationResource } from "@/src/data/location/models/location.types";
import { LanguageResource } from "@/src/data/language/models/language.types";
import { PartnerFilterParamsV2 } from "@/src/data/partner/models/partner.types";

const { Title, Text } = Typography;

interface SelectedTag {
  id?: number | string;
  type: keyof PartnerFilterParamsV2;
  name: string;
  color: string;
}

type SelectedFilterPartnersProps = {
  filters: PartnerFilterParamsV2;
  categories: CategoryResource[];
  serviceCategories: CateServiceResource[];
  skills: SkillResource[];
  services: ServiceResource[];
  locations: LocationResource[];
  languages: LanguageResource[];

  toggleCategory: (id: number) => void;
  toggleServiceCategory: (id: number) => void;
  toggleSkill: (id: number) => void;
  toggleServiceDetail: (id: number) => void;
  toggleLocation: (id: number) => void;
  toggleAccountType: (type: string | null) => void;
  toggleLanguage: (id: number) => void;
  toggleSearch: (search: string | null) => void;
  clearAllFilters: () => void;
};

const TAG_COLORS = {
  category: "#09993E",
  serviceCategory: "#a7330cff",
  skill: "#2980B9",
  serviceDetail: "#FF9800",
  location: "#6A5ACD",
  accountType: "#FF6347",
  language: "#17A2B8",
  search: "#5C6BC0",
};

const SelectedFilterPartners = ({
  filters,
  categories,
  serviceCategories,
  skills,
  services,
  locations,
  languages,
  toggleCategory,
  toggleServiceCategory,
  toggleSkill,
  toggleServiceDetail,
  toggleLocation,
  toggleAccountType,
  toggleLanguage,
  toggleSearch,
  clearAllFilters,
}: SelectedFilterPartnersProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const getCategoryNameById = (id: number) =>
    categories.find((c) => c.categoryId === id)?.name || "Unknown";
  const getServiceCategoryNameById = (id: number) =>
    serviceCategories.find((sc) => sc.cateServiceId === id)?.name || "Unknown";
  const getSkillNameById = (id: number) =>
    skills.find((sk) => sk.skillId === id)?.name || "Unknown";
  const getServiceDetailNameById = (id: number) =>
    services.find((sd) => sd.serviceId === id)?.name || "Unknown";
  const getLocationNameById = (id: number) =>
    locations.find((loc) => loc.locationId === id)?.name || "Unknown";
  const getLanguageNameById = (id: number) =>
    languages.find((lang) => lang.languageId === id)?.name || "Unknown";
  const getAccountTypeName = (type: string | null | undefined) =>
    type === "PERSONAL" ? "Cá nhân" : "Doanh nghiệp";

  const removeFilter = (
    type: keyof PartnerFilterParamsV2,
    id: number | string | undefined
  ) => {
    switch (type) {
      case "partnerCategoryIds":
        toggleCategory(id as number);
        break;
      case "partnerServiceCategoryIds":
        toggleServiceCategory(id as number);
        break;
      case "partnerSkillIds":
        toggleSkill(id as number);
        break;
      case "partnerServiceIds":
        toggleServiceDetail(id as number);
        break;
      case "locationIds":
        toggleLocation(id as number);
        break;
      case "accountType":
        toggleAccountType(null);
        break;
      case "languageIds":
        toggleLanguage(id as number);
        break;
      default:
        break;
    }
  };

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredCategoryIds = useMemo(() => {
    if (!normalizedSearch) return filters.partnerCategoryIds;
    return (
      filters.partnerCategoryIds?.filter((id) =>
        getCategoryNameById(id).toLowerCase().includes(normalizedSearch)
      ) || []
    );
  }, [filters.partnerCategoryIds, normalizedSearch, categories]);

  const filteredServiceCategoryIds = useMemo(() => {
    if (!normalizedSearch) return filters.partnerServiceCategoryIds;
    return (
      filters.partnerServiceCategoryIds?.filter((id) =>
        getServiceCategoryNameById(id).toLowerCase().includes(normalizedSearch)
      ) || []
    );
  }, [filters.partnerServiceCategoryIds, normalizedSearch, serviceCategories]);

  const filteredSkillIds = useMemo(() => {
    if (!normalizedSearch) return filters.partnerSkillIds;
    return (
      filters.partnerSkillIds?.filter((id) =>
        getSkillNameById(id).toLowerCase().includes(normalizedSearch)
      ) || []
    );
  }, [filters.partnerSkillIds, normalizedSearch, skills]);

  const filteredServiceDetailIds = useMemo(() => {
    if (!normalizedSearch) return filters.partnerServiceIds;
    return (
      filters.partnerServiceIds?.filter((id) =>
        getServiceDetailNameById(id).toLowerCase().includes(normalizedSearch)
      ) || []
    );
  }, [filters.partnerServiceIds, normalizedSearch, services]);

  const filteredLocationIds = useMemo(() => {
    if (!normalizedSearch) return filters.locationIds;
    return (
      filters.locationIds?.filter((id) =>
        getLocationNameById(id).toLowerCase().includes(normalizedSearch)
      ) || []
    );
  }, [filters.locationIds, normalizedSearch, locations]);

  const filteredAccountType = useMemo(() => {
    if (!filters.accountType) return undefined;
    const name = getAccountTypeName(filters.accountType);
    if (!normalizedSearch || name.toLowerCase().includes(normalizedSearch)) {
      return filters.accountType;
    }
    return undefined;
  }, [filters.accountType, normalizedSearch]);

  const filteredLanguageIds = useMemo(() => {
    if (!normalizedSearch) return filters.languageIds;
    return (
      filters.languageIds?.filter((id) =>
        getLanguageNameById(id).toLowerCase().includes(normalizedSearch)
      ) || []
    );
  }, [filters.languageIds, normalizedSearch, languages]);

  const hasAnyFilter = useMemo(() => {
    return (
      (filters.partnerCategoryIds?.length ?? 0) > 0 ||
      (filters.partnerSkillIds?.length ?? 0) > 0 ||
      (filters.partnerServiceCategoryIds?.length ?? 0) > 0 ||
      (filters.partnerServiceIds?.length ?? 0) > 0 ||
      (filters.locationIds?.length ?? 0) > 0 ||
      (filters.accountType && filters.accountType !== undefined) ||
      (filters.languageIds?.length ?? 0) > 0
    );
  }, [filters]);

  const total = useMemo(() => {
    let count = 0;
    count += filters.partnerCategoryIds?.length ?? 0;
    count += filters.partnerSkillIds?.length ?? 0;
    count += filters.partnerServiceCategoryIds?.length ?? 0;
    count += filters.partnerServiceIds?.length ?? 0;
    count += filters.locationIds?.length ?? 0;
    if (filters.accountType && filters.accountType !== undefined) count++;
    count += filters.languageIds?.length ?? 0;
    return count;
  }, [filters]);

  const displayLimit = 5;

  const allFilteredTags = useMemo(() => {
    const tags: SelectedTag[] = [];

    if (filteredCategoryIds !== undefined && filteredCategoryIds.length > 0)
      filteredCategoryIds.forEach((id) =>
        tags.push({
          id,
          type: "partnerCategoryIds",
          name: `Lĩnh vực: ${getCategoryNameById(id)}`,
          color: TAG_COLORS.category,
        })
      );

    if (filteredSkillIds !== undefined && filteredSkillIds.length > 0)
      filteredSkillIds.forEach((id) =>
        tags.push({
          id,
          type: "partnerSkillIds",
          name: `Kỹ năng: ${getSkillNameById(id)}`,
          color: TAG_COLORS.skill,
        })
      );

    if (
      filteredServiceCategoryIds !== undefined &&
      filteredServiceCategoryIds.length > 0
    )
      filteredServiceCategoryIds.forEach((id) =>
        tags.push({
          id,
          type: "partnerServiceCategoryIds",
          name: `DMDV: ${getServiceCategoryNameById(id)}`,
          color: TAG_COLORS.serviceCategory,
        })
      );

    if (
      filteredServiceDetailIds !== undefined &&
      filteredServiceDetailIds.length > 0
    )
      filteredServiceDetailIds.forEach((id) =>
        tags.push({
          id,
          type: "partnerServiceIds",
          name: `Dịch vụ: ${getServiceDetailNameById(id)}`,
          color: TAG_COLORS.serviceDetail,
        })
      );

    if (filteredLocationIds !== undefined && filteredLocationIds.length > 0)
      filteredLocationIds.forEach((id) =>
        tags.push({
          id,
          type: "locationIds",
          name: `Địa điểm: ${getLocationNameById(id)}`,
          color: TAG_COLORS.location,
        })
      );

    if (filteredAccountType !== undefined) {
      tags.push({
        id: filteredAccountType,
        type: "accountType",
        name: `Loại TK: ${getAccountTypeName(filteredAccountType)}`,
        color: TAG_COLORS.accountType,
      });
    }

    if (filteredLanguageIds !== undefined && filteredLanguageIds.length > 0)
      filteredLanguageIds.forEach((id) =>
        tags.push({
          id,
          type: "languageIds",
          name: `Ngôn ngữ: ${getLanguageNameById(id)}`,
          color: TAG_COLORS.language,
        })
      );

    return tags;
  }, [
    normalizedSearch,
    filteredCategoryIds,
    filteredSkillIds,
    filteredServiceCategoryIds,
    filteredServiceDetailIds,
    filteredLocationIds,
    filteredAccountType,
    filteredLanguageIds,
    categories,
    serviceCategories,
    skills,
    services,
    locations,
    languages,
  ]);

  const renderTagContent = (label: string) => (
    <span
      style={{
        flex: "1",
        minWidth: 0,
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
      }}
      title={label}
    >
      {label}
    </span>
  );

  const renderTags = (tagsToRender: SelectedTag[]) =>
    tagsToRender?.map((tag, index) => (
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
          {filteredCategoryIds !== undefined &&
            filteredCategoryIds.length > 0 && (
              <div>
                <Title level={5} style={{ marginBottom: 8 }}>
                  Lĩnh vực:
                </Title>
                <Space size={[8, 8]} wrap>
                  {filteredCategoryIds.map((id) => (
                    <Tag
                      key={`modal-cat-${id}`}
                      color={TAG_COLORS.category}
                      style={{
                        borderRadius: 20,
                        border: `1px solid ${TAG_COLORS.category}`,
                        // color: "#fff",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                      }}
                      closable
                      onClose={() => removeFilter("partnerCategoryIds", id)}
                    >
                      {renderTagContent(`Lĩnh vực: ${getCategoryNameById(id)}`)}
                    </Tag>
                  ))}
                </Space>
              </div>
            )}

          {filteredServiceCategoryIds !== undefined &&
            filteredServiceCategoryIds.length > 0 && (
              <div>
                <Title level={5} style={{ marginBottom: 8 }}>
                  Danh mục Dịch vụ:
                </Title>
                <Space size={[8, 8]} wrap>
                  {filteredServiceCategoryIds.map((id) => (
                    <Tag
                      key={`modal-sc-${id}`}
                      color={TAG_COLORS.serviceCategory}
                      style={{
                        borderRadius: 20,
                        border: `1px solid ${TAG_COLORS.serviceCategory}`,
                        color: "#fff",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                      }}
                      closable
                      onClose={() =>
                        removeFilter("partnerServiceCategoryIds", id)
                      }
                    >
                      {renderTagContent(
                        `Danh mục DV: ${getServiceCategoryNameById(id)}`
                      )}
                    </Tag>
                  ))}
                </Space>
              </div>
            )}

          {filteredSkillIds !== undefined && filteredSkillIds.length > 0 && (
            <div>
              <Title level={5} style={{ marginBottom: 8 }}>
                Kỹ năng:
              </Title>
              <Space size={[8, 8]} wrap>
                {filteredSkillIds.map((id) => (
                  <Tag
                    key={`modal-sk-${id}`}
                    color={TAG_COLORS.skill}
                    style={{
                      borderRadius: 20,
                      border: `1px solid ${TAG_COLORS.skill}`,
                      color: "#fff",
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                    }}
                    closable
                    onClose={() => removeFilter("partnerSkillIds", id)}
                  >
                    {renderTagContent(`Kỹ năng: ${getSkillNameById(id)}`)}
                  </Tag>
                ))}
              </Space>
            </div>
          )}

          {filteredServiceDetailIds !== undefined &&
            filteredServiceDetailIds.length > 0 && (
              <div>
                <Title level={5} style={{ marginBottom: 8 }}>
                  Dịch vụ:
                </Title>
                <Space size={[8, 8]} wrap>
                  {filteredServiceDetailIds.map((id) => (
                    <Tag
                      key={`modal-sd-${id}`}
                      color={TAG_COLORS.serviceDetail}
                      style={{
                        borderRadius: 20,
                        border: `1px solid ${TAG_COLORS.serviceDetail}`,
                        color: "#fff",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                      }}
                      closable
                      onClose={() => removeFilter("partnerServiceIds", id)}
                    >
                      {renderTagContent(
                        `Dịch vụ: ${getServiceDetailNameById(id)}`
                      )}
                    </Tag>
                  ))}
                </Space>
              </div>
            )}

          {filteredLocationIds !== undefined &&
            filteredLocationIds.length > 0 && (
              <div>
                <Title level={5} style={{ marginBottom: 8 }}>
                  Địa điểm:
                </Title>
                <Space size={[8, 8]} wrap>
                  {filteredLocationIds.map((id) => (
                    <Tag
                      key={`modal-loc-${id}`}
                      color={TAG_COLORS.location}
                      style={{
                        borderRadius: 20,
                        border: `1px solid ${TAG_COLORS.location}`,
                        color: "#fff",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                      }}
                      closable
                      onClose={() => removeFilter("locationIds", id)}
                    >
                      {renderTagContent(`Địa điểm: ${getLocationNameById(id)}`)}
                    </Tag>
                  ))}
                </Space>
              </div>
            )}

          {filteredAccountType !== undefined && (
            <div>
              <Title level={5} style={{ marginBottom: 8 }}>
                Loại tài khoản:
              </Title>
              <Space size={[8, 8]} wrap>
                <Tag
                  key={`modal-acc-${filteredAccountType}`}
                  color={TAG_COLORS.accountType}
                  style={{
                    borderRadius: 20,
                    border: `1px solid ${TAG_COLORS.accountType}`,
                    color: "#fff",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                  }}
                  closable
                  onClose={() =>
                    removeFilter("accountType", filteredAccountType)
                  }
                >
                  {renderTagContent(
                    `Loại TK: ${getAccountTypeName(filteredAccountType)}`
                  )}
                </Tag>
              </Space>
            </div>
          )}

          {filteredLanguageIds !== undefined &&
            filteredLanguageIds.length > 0 && (
              <div>
                <Title level={5} style={{ marginBottom: 8 }}>
                  Ngôn ngữ:
                </Title>
                <Space size={[8, 8]} wrap>
                  {filteredLanguageIds.map((id) => (
                    <Tag
                      key={`modal-lang-${id}`}
                      color={TAG_COLORS.language}
                      style={{
                        borderRadius: 20,
                        border: `1px solid ${TAG_COLORS.language}`,
                        color: "#fff",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                      }}
                      closable
                      onClose={() => removeFilter("languageIds", id)}
                    >
                      {renderTagContent(`Ngôn ngữ: ${getLanguageNameById(id)}`)}
                    </Tag>
                  ))}
                </Space>
              </div>
            )}

          {!hasAnyFilter && <Text type="secondary">Chưa chọn bộ lọc nào</Text>}
        </Space>
      </Modal>
    </div>
  );
};

export default SelectedFilterPartners;
