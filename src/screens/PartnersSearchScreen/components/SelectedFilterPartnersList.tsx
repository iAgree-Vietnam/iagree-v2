import React, { useState, useMemo, useEffect } from "react";
import { Button, Input, Space, Tag, Typography, Modal } from "antd";
import {
  CategoryResource,
  CateServiceResource,
  ServiceResource,
} from "@/src/data/category/models/category.types";
import { SkillResource } from "@/src/data/skill/models/skill.types";
import { LocationResource } from "@/src/data/location/models/location.types";
import { LanguageResource } from "@/src/data/language/models/language.types";
import { PartnerSearchFilterParams } from "../PartnersSearchScreenV2";
import { forEach, size, toNumber } from "lodash";

const { Title, Text } = Typography;

type AccountType = "PERSONAL" | "BUSINESS";

interface SelectedTag {
  id?: number | string;
  type: keyof PartnerSearchFilterParams | "search";
  name: string;
  color: string;
}

type SelectedFilterPartnersListProps = {
  filters: PartnerSearchFilterParams;
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
  toggleAccountType: (type: AccountType | null) => void;
  toggleLanguage: (id: number) => void;
  toggleSearch: (search: string | null) => void;
  clearAllFilters: () => void;
  setFilters: (params: any) => void;
};

const SelectedFilterPartnersList = ({
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
  setFilters
}: SelectedFilterPartnersListProps) => {
  useEffect(()=>{
    // clearAllFilters()
    setFilters({
      categoryIds: [],
      serviceCategoryIds: [],
      skillIds: [],
      serviceIds: [],
      salaryType: undefined,
      priceMin: undefined,
      priceMax: undefined,
      postingEndDate: undefined,
      postedDateRange: undefined,
    })
  }, [])
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

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const getCategoryNameById = (id: number) =>
    categories.find((c) => c.categoryId === id)?.name || "Unknown";
  const getServiceCategoryNameById = (id: number) =>
    serviceCategories.find((sc) => sc.cateServiceId === id)?.name || "Unknown";
  
    const getSkillNameById = (id: number) =>
    skills.find((sk) => toNumber(sk.skillId) === toNumber(id))?.name || "Unknown";
  const getServiceDetailNameById = (id: number) =>
    services.find((sd) => sd.serviceId === id)?.name || "Unknown";

  const getLocationNameById = (id: number) =>
    locations.find((loc) => loc.locationId === id)?.name || "Unknown";
  const getLanguageNameById = (id: number) =>
    languages.find((lang) => lang.languageId === id)?.name || "Unknown";
  const getAccountTypeName = (type: AccountType) =>
    type === "PERSONAL" ? "Cá nhân" : "Doanh nghiệp";

  const removeFilter = (
    type: keyof PartnerSearchFilterParams | "search",
    id: number | string | undefined
  ) => {
    switch (type) {
      case "categoryIds":
        toggleCategory(id as number);
        break;
      case "serviceCategoryIds":
        toggleServiceCategory(id as number);
        break;
      case "skillIds":
        toggleSkill(id as number);
        break;
      case "serviceIds":
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
      case "search":
        toggleSearch(null);
        break;
      default:
        break;
    }
  };

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredCategoryIds = useMemo(() => {
    if (!normalizedSearch) return filters.categoryIds;
    return filters.categoryIds.filter((id) =>
      getCategoryNameById(id).toLowerCase().includes(normalizedSearch)
    );
  }, [filters.categoryIds, normalizedSearch, categories]);

  const filteredServiceCategoryIds = useMemo(() => {
    if (!normalizedSearch) return filters.serviceCategoryIds;
    return filters.serviceCategoryIds.filter((id) =>
      getServiceCategoryNameById(id).toLowerCase().includes(normalizedSearch)
    );
  }, [filters.serviceCategoryIds, normalizedSearch, serviceCategories]);

  const filteredSkillIds = useMemo(() => {
    if (!normalizedSearch) return filters.skillIds;
    return filters.skillIds.filter((id) =>
      getSkillNameById(id).toLowerCase().includes(normalizedSearch)
    );
  }, [filters.skillIds, normalizedSearch, skills]);

  const filteredServiceDetailIds = useMemo(() => {
    if (!normalizedSearch) return filters.serviceIds;
    return filters.serviceIds.filter((id) =>
      getServiceDetailNameById(id).toLowerCase().includes(normalizedSearch)
    );
  }, [filters.serviceIds, normalizedSearch, services]);

  const filteredLocationIds = useMemo(() => {
    if (!normalizedSearch) return filters.locationIds;
    return filters.locationIds.filter((id) =>
      getLocationNameById(id).toLowerCase().includes(normalizedSearch)
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
    if (filters.languageIds === undefined) return filters.languageIds;

    return filters.languageIds.filter((id) =>
      getLanguageNameById(id).toLowerCase().includes(normalizedSearch)
    );
  }, [filters.languageIds, normalizedSearch, languages]);

  const hasAnyFilter = useMemo(() => {
    return (
      // (filters.search && filters.search.length > 0) ||
      size(filters.categoryIds) > 0 ||
      size(filters.skillIds) > 0 ||
      size(filters.serviceCategoryIds) > 0 ||
      size(filters.serviceIds) > 0 ||
      (filters.locationIds && size(filters.locationIds) > 0) ||
      filters.accountType !== undefined ||
      size(filters.languageIds) > 0
    );
  }, [filters]);

  const total = useMemo(() => {
    let count = 0;
    // if (filters.search && filters.search.length > 0) count++;
    count += size(filters.categoryIds);
    count += size(filters.skillIds);
    count += size(filters.serviceCategoryIds);
    count += size(filters.serviceIds);
    count += size(filters.locationIds);
    if (filters.accountType !== undefined) count++;
    count += size(filters.languageIds);
    return count;
  }, [filters]);

  const displayLimit = 5;

  const allFilteredTags = useMemo(() => {
    const tags: SelectedTag[] = [];

    // if (
    //   filters.search &&
    //   filters.search.length > 0 &&
    //   (!normalizedSearch ||
    //     filters.search.toLowerCase().includes(normalizedSearch))
    // ) {
    //   tags.push({
    //     id: "search-term",
    //     type: "search",
    //     name: `Tìm kiếm: ${filters.search}`,
    //     color: TAG_COLORS.search,
    //   });
    // }

    filteredCategoryIds?.forEach((id) =>
      tags.push({
        id,
        type: "categoryIds",
        name: `Lĩnh vực: ${getCategoryNameById(id)}`,
        color: TAG_COLORS.category,
      })
    );
    filteredSkillIds?.forEach((id) =>
      tags.push({
        id,
        type: "skillIds",
        name: `Kỹ năng: ${getSkillNameById(id)}`,
        color: TAG_COLORS.skill,
      })
    );
    forEach(filteredServiceCategoryIds, (id) =>
      tags.push({
        id,
        type: "serviceCategoryIds",
        name: `DMDV: ${getServiceCategoryNameById(id)}`,
        color: TAG_COLORS.serviceCategory,
      })
    );
    forEach(filteredServiceDetailIds, (id) =>
      tags.push({
        id,
        type: "serviceIds",
        name: `Dịch vụ: ${getServiceDetailNameById(id)}`,
        color: TAG_COLORS.serviceDetail,
      })
    );

    forEach(filteredLocationIds, (id) =>
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
    forEach(filteredLanguageIds, (id) =>
      tags.push({
        id,
        type: "languageIds",
        name: `Ngôn ngữ: ${getLanguageNameById(id)}`,
        color: TAG_COLORS.language,
      })
    );

    return tags;
  }, [
    // filters.search,
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
    TAG_COLORS.category,
    TAG_COLORS.serviceCategory,
    TAG_COLORS.skill,
    TAG_COLORS.serviceDetail,
    TAG_COLORS.location,
    TAG_COLORS.accountType,
    TAG_COLORS.language,
    TAG_COLORS.search,
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
    >
      {label}
    </span>
  );

  if (!hasAnyFilter) {
    return null;
  }

  // useEffect(()=>{
  //   clearAllFilters()
  // },[])


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
          {allFilteredTags?.slice(0, displayLimit).map((tag, index) => (
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
              }}
              closable
              onClose={() => removeFilter(tag?.type, tag?.id)}
            >
              {renderTagContent(tag?.name)}
            </Tag>
          ))}

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
          {/* Search Term Tag in Modal (if filtered by search) */}
          {/* {filters.search &&
            filters.search.length > 0 &&
            (!normalizedSearch ||
              filters.search.toLowerCase().includes(normalizedSearch)) && (
              <div>
                <Title level={5} style={{ marginBottom: 8 }}>
                  Tìm kiếm:
                </Title>
                <Space size={[8, 8]} wrap>
                  <Tag
                    key="modal-search"
                    color={TAG_COLORS.search}
                    style={{
                      borderRadius: 20,
                      border: `1px solid ${TAG_COLORS.search}`,
                      color: "#fff",
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                    }}
                    closable
                    onClose={() => removeFilter("search", "search-term")}
                  >
                    {renderTagContent(`Tìm kiếm: ${filters.search}`)}
                  </Tag>
                </Space>
              </div>
            )} */}

          {/* Existing Category Filters in Modal */}
          {size(filteredCategoryIds) > 0 && (
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
                      color: "#fff",
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                    }}
                    closable
                    onClose={() => removeFilter("categoryIds", id)}
                  >
                    {renderTagContent(`Lĩnh vực: ${getCategoryNameById(id)}`)}
                  </Tag>
                ))}
              </Space>
            </div>
          )}

          {size(filteredServiceCategoryIds) > 0 && (
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
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                    }}
                    closable
                    onClose={() => removeFilter("serviceCategoryIds", id)}
                  >
                    {renderTagContent(
                      `Danh mục DV: ${getServiceCategoryNameById(id)}`
                    )}
                  </Tag>
                ))}
              </Space>
            </div>
          )}

          {filteredSkillIds?.length > 0 && (
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
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                    }}
                    closable
                    onClose={() => removeFilter("skillIds", id)}
                  >
                    {renderTagContent(`Kỹ năng: ${getSkillNameById(id)}`)}
                  </Tag>
                ))}
              </Space>
            </div>
          )}

          {size(filteredServiceDetailIds) > 0 && (
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
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                    }}
                    closable
                    onClose={() => removeFilter("serviceIds", id)}
                  >
                    {renderTagContent(
                      `Dịch vụ: ${getServiceDetailNameById(id)}`
                    )}
                  </Tag>
                ))}
              </Space>
            </div>
          )}

          {/* --- NEW FILTERS IN MODAL --- */}
          {size(filteredLocationIds) > 0 && (
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
            size(filteredLanguageIds) > 0 && (
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
                        color: "#ffffff",
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

export default SelectedFilterPartnersList;
