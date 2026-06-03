import React, { useCallback, useMemo, useState } from "react";
import ArrayUtils from "@/src/utils/ArrayUtils";
import {
  CateServiceResource,
  ServiceResource,
} from "@/src/data/category/models/category.types";
import { SkillResource } from "@/src/data/skill/models/skill.types";
import { AnimatePresence, motion } from "framer-motion";
import { Select } from "antd";
import { LocationResource } from "@/src/data/location/models/location.types";
import { LanguageResource } from "@/src/data/language/models/language.types";
import { usePartnerSelectBox } from "../../PartnerScreen/hooks/usePartnerSelectBox";
import {
  PartnerResource,
  PartnerSelectBoxResource,
} from "@/src/data/partner/models/partner.types";
// import { PartnerSearchFilterParams } from "../PartnersSearchScreen";
import SelectedFilterPartnersList from "./SelectedFilterPartnersList";
import { renderSectionTitle } from "../../SearchScreen/components/RenderSectionTitle";
import { renderCheckableTags } from "../../SearchScreen/components/RenderCheckableTags";
import { PartnerSearchFilterParams } from "../PartnersSearchScreenV2";
import { includes, size } from "lodash";

const { Option } = Select;

type AccountType = "PERSONAL" | "BUSINESS";

type FilterPartnersListComponentProps = {
  serviceCategories: CateServiceResource[];
  skills: SkillResource[];
  services: ServiceResource[];
  filters: PartnerSearchFilterParams;
  setPartnerPage: React.Dispatch<React.SetStateAction<number>>;
  setFilters: React.Dispatch<React.SetStateAction<PartnerSearchFilterParams>>;
  setPartnersList: React.Dispatch<React.SetStateAction<Partial<PartnerResource>[]>>;
};

const FilterPartnersListComponent = ({
  serviceCategories,
  skills,
  services,
  filters,
  setPartnerPage,
  setFilters,
  setPartnersList,
}: FilterPartnersListComponentProps) => {
  const SECTION_DOT_COLORS = {
    category: "#09993E",
    serviceCategory: "#a7330cff",
    skill: "#2980B9",
    serviceDetail: "#FF9800",
    location: "#6A5ACD",
    accountType: "#FF6347",
    language: "#17A2B8",
  };

  const setDefaultPartnerPageWhenFilter = () => {
    setPartnerPage(1);
    setPartnersList([]);
  };

  const [locationPopoverVisible, setLocationPopoverVisible] = useState(false);
  const [popoverLocationSearch, setPopoverLocationSearch] = useState("");
  const [locationShowAll, setLocationShowAll] = useState(false);

  const [popoverServiceCategorySearch, setPopoverServiceCategorySearch] =
    useState("");
  const [popoverSkillSearch, setPopoverSkillSearch] = useState("");
  const [popoverServiceDetailSearch, setPopoverServiceDetailSearch] =
    useState("");
  const [popoverLanguageSearch, setPopoverLanguageSearch] = useState("");

  const [serviceCategoryPopoverVisible, setServiceCategoryPopoverVisible] =
    useState(false);
  const [skillPopoverVisible, setSkillPopoverVisible] = useState(false);
  const [serviceDetailPopoverVisible, setServiceDetailPopoverVisible] =
    useState(false);
  const [languagePopoverVisible, setLanguagePopoverVisible] = useState(false);

  const [categoryExpanded, setCategoryExpanded] = useState(true);
  const [serviceCategoryExpanded, setServiceCategoryExpanded] = useState(true);
  const [skillExpanded, setSkillExpanded] = useState(true);
  const [serviceDetailExpanded, setServiceDetailExpanded] = useState(true);

  const [locationExpanded, setLocationExpanded] = useState(true);
  const [accountTypeExpanded, setAccountTypeExpanded] = useState(true);
  const [languageExpanded, setLanguageExpanded] = useState(true);

  const [categoryShowAll, setCategoryShowAll] = useState(false);
  const [serviceCategoryShowAll, setServiceCategoryShowAll] = useState(false);
  const [skillShowAll, setSkillShowAll] = useState(false);
  const [serviceDetailShowAll, setServiceDetailShowAll] = useState(false);
  const [languageShowAll, setLanguageShowAll] = useState(false);

  const selectboxQuery = usePartnerSelectBox();
  const selectboxResource = selectboxQuery.data as PartnerSelectBoxResource;

  const locationAvailable: LocationResource[] = useMemo(() => {
    return selectboxResource?.locations.items || [];
  }, [selectboxResource?.locations]);

  const languageAvailable: LanguageResource[] = useMemo(() => {
    return selectboxResource?.languages.items || [];
  }, [selectboxResource?.languages]);

  const serviceCategoriesAvailable: CateServiceResource[] = useMemo(() => {
    return (
      selectboxResource?.categories
        ?.filter((category) =>
          includes(filters.categoryIds, category.categoryId)
        )
        ?.flatMap((category) => category.childrens || []) || []
    );
  }, [filters.serviceCategoryIds, serviceCategories]);

  const skillsAvailable: SkillResource[] = useMemo(() => {
    // return (
    //   selectboxResource?.skills?.filter((skill) =>
    //     filters.categoryIds.some(
    //       (categoryId) => categoryId === skill.categoryProjectId
    //     )
    //   ) || []
    // );
    return selectboxResource?.skills ?? [];
  }, [filters.skillIds, selectboxResource?.skills]);

  const servicesAvailable: ServiceResource[] = useMemo(() => {
    const categoriesWithServices =
      selectboxResource?.categories?.flatMap(
        (category) => category.childrens || []
      ) || [];
    return (
      categoriesWithServices
        .filter((serviceCategory) =>
          includes(filters.serviceCategoryIds, serviceCategory.cateServiceId)
        )
        .flatMap((serviceCategory) => serviceCategory.childrens || []) || []
    );
  }, [filters.serviceIds, services]);

  const filterValidIds = useCallback(
    <T extends { [key: string]: any }>(
      currentIds: number[],
      availableItems: T[],
      idKey: keyof T
    ) => {
      const availableIdSet = new Set(
        availableItems.map((item) => item[idKey] as number)
      );
      return currentIds.filter((id) => availableIdSet.has(id));
    },
    []
  );

  const toggleCategory = useCallback(
    (id: number) => {
      setFilters((prev: any) => {
        setDefaultPartnerPageWhenFilter();

        const newCategoryIds = ArrayUtils.addOrRemoveV2(prev.categoryIds, id);

        const allPossibleServiceCategories =
          selectboxResource.categories
            ?.filter((cat) => newCategoryIds.includes(cat.categoryId))
            .flatMap((cat) => cat.childrens || []) || [];

        const newServiceCategoryIds = filterValidIds(
          prev.serviceCategoryIds,
          allPossibleServiceCategories,
          "cateServiceId"
        );

        // const allPossibleSkills =
        //   selectboxResource.skills?.filter((skill) =>
        //     newCategoryIds.includes(skill.categoryProjectId)
        //   ) || [];

        // const newSkillIds = filterValidIds(
        //   prev.skillIds,
        //   allPossibleSkills,
        //   "skillId"
        // );

        const allPossibleServices =
          selectboxResource?.categories
            ?.flatMap((cat) => cat.childrens || [])
            .filter((sc) => newServiceCategoryIds?.includes(sc?.cateServiceId))
            .flatMap((sc) => sc?.childrens || []) || [];

        const newServiceIds = filterValidIds(
          prev.serviceIds,
          allPossibleServices,
          "serviceId"
        );

        return {
          ...prev,
          categoryIds: newCategoryIds,
          serviceCategoryIds: newServiceCategoryIds,
          // skillIds: newSkillIds,
          serviceIds: newServiceIds,
        };
      });
    },
    [
      selectboxResource?.categories,
      selectboxResource?.skills,
      filterValidIds,
      setFilters,
    ]
  );

  const toggleServiceCategory = useCallback(
    (id: number) => {
      setDefaultPartnerPageWhenFilter();

      setFilters((prev: any) => {
        const newServiceCategoryIds = ArrayUtils.addOrRemoveV2(
          prev.serviceCategoryIds,
          id
        );

        const allPossibleServices =
          selectboxResource.categories
            ?.flatMap((cat) => cat.childrens || [])
            .filter((sc) => newServiceCategoryIds.includes(sc.cateServiceId))
            .flatMap((sc) => sc.childrens || []) || [];

        const newServiceIds = filterValidIds(
          prev.serviceIds,
          allPossibleServices,
          "serviceId"
        );

        return {
          ...prev,
          serviceCategoryIds: newServiceCategoryIds,
          serviceIds: newServiceIds,
        };
      });
    },
    [selectboxResource?.categories, filterValidIds, setFilters]
  );

  const toggleSkill = useCallback(
    (id: number) => {
      setDefaultPartnerPageWhenFilter();

      setFilters((prev: any) => {
        const newSkillIds = ArrayUtils.addOrRemoveV2(prev.skillIds, id);
        return {
          ...prev,
          skillIds: newSkillIds,
        };
      });
    },
    [setFilters]
  );

  const toggleService = useCallback(
    (id: number) => {
      setDefaultPartnerPageWhenFilter();

      setFilters((prev: any) => ({
        ...prev,
        serviceIds: ArrayUtils.addOrRemoveV2(prev.serviceIds, id),
      }));
    },
    [setFilters]
  );

  const toggleLocation = useCallback(
    (id: number) => {
      setDefaultPartnerPageWhenFilter();
      setFilters((prev: any) => {
        const newLocationIds = ArrayUtils.addOrRemoveV2(
          prev.locationIds ?? [],
          id
        );
        return {
          ...prev,
          locationIds: newLocationIds,
        };
      });
    },
    [setFilters]
  );

  const toggleAccountType = useCallback(
    (value: AccountType | null) => {
      setDefaultPartnerPageWhenFilter();
      setFilters((prev: any) => ({
        ...prev,
        accountType: value === null ? undefined : value,
      }));
    },
    [setFilters, setDefaultPartnerPageWhenFilter]
  );

  const toggleLanguage = useCallback(
    (id: number) => {
      setDefaultPartnerPageWhenFilter();
      setFilters((prev: any) => {
        const newLanguageIds = ArrayUtils.addOrRemoveV2(
          prev.languageIds ?? [],
          id
        );
        return {
          ...prev,
          languageIds: newLanguageIds,
        };
      });
    },
    [setFilters]
  );

  const toggleSearch = useCallback(
    (search: string | null) => {
      setDefaultPartnerPageWhenFilter();
      setFilters((prev: any) => ({
        ...prev,
        search: search === null ? undefined : search,
      }));
    },
    [setFilters, setDefaultPartnerPageWhenFilter]
  );

  const clearAllCategories = () => {
    setDefaultPartnerPageWhenFilter();

    setFilters((prev: any) => ({
      ...prev,
      categoryIds: [],
      serviceCategoryIds: [],
      skillIds: [],
      serviceIds: [],

      locationIds: [],
      accountType: undefined,
      languageIds: [],
    }));
  };

  const clearAllServiceCategories = useCallback(() => {
    setDefaultPartnerPageWhenFilter();

    setFilters((prev: any) => ({
      ...prev,
      serviceCategoryIds: [],
      serviceIds: [],
    }));
  }, [setFilters]);

  const clearAllSkills = useCallback(() => {
    setDefaultPartnerPageWhenFilter();

    setFilters((prev: any) => ({
      ...prev,
      skillIds: [],
    }));
  }, [setFilters]);

  const clearAllServices = useCallback(() => {
    setDefaultPartnerPageWhenFilter();

    setFilters((prev: any) => ({
      ...prev,
      serviceIds: [],
    }));
  }, [setFilters]);

  const clearAllLanguages = useCallback(() => {
    setDefaultPartnerPageWhenFilter();

    setFilters((prev: any) => ({
      ...prev,
      languageIds: [],
    }));
  }, [setFilters]);

  const clearAllLocations = useCallback(() => {
    setDefaultPartnerPageWhenFilter();

    setFilters((prev: any) => ({
      ...prev,
      locationIds: [],
    }));
  }, [setFilters]);

  const sectionBoxStyle: React.CSSProperties = {
    padding: 16,
    borderRadius: 6,
    border: "0.5px solid #D5D5D5",
    marginBottom: 12,
    background: "#fff",
  };

  return (
    <div
      style={{
        background: "#fff",
        padding: "0",
        width: "320px",
      }}
    >
      {/* Selected Filters */}
      <SelectedFilterPartnersList
        setFilters={setFilters}
        filters={filters}
        categories={selectboxResource?.categories || []}
        serviceCategories={serviceCategoriesAvailable}
        skills={skillsAvailable}
        services={servicesAvailable}
        locations={locationAvailable}
        languages={languageAvailable}
        toggleCategory={toggleCategory}
        toggleServiceCategory={toggleServiceCategory}
        toggleSkill={toggleSkill}
        toggleServiceDetail={toggleService}
        toggleLocation={toggleLocation}
        toggleAccountType={toggleAccountType}
        toggleLanguage={toggleLanguage}
        clearAllFilters={clearAllCategories}
        toggleSearch={toggleSearch}
      />

      {/* Lĩnh vực (Category) */}
      <div style={sectionBoxStyle}>
        {renderSectionTitle(
          selectboxResource?.categories || [],
          "Lĩnh vực",
          categoryExpanded,
          () => setCategoryExpanded((v) => !v),
          null,
          SECTION_DOT_COLORS.category
        )}
        <AnimatePresence initial={false}>
          {categoryExpanded && (
            <motion.div
              key="category-content"
              initial={{
                height: 0,
                opacity: 0,
                paddingTop: 0,
                paddingBottom: 0,
              }}
              animate={{
                height: "auto",
                opacity: 1,
              }}
              exit={{ height: 0, opacity: 0, paddingTop: 0, paddingBottom: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              {renderCheckableTags({
                data: selectboxResource?.categories,
                idKey: "categoryId",
                checkedIds: filters.categoryIds,
                onChange: toggleCategory,
                showAll: categoryShowAll,
                setShowAll: setCategoryShowAll,
                emptyText: "Không có Lĩnh vực",
                disabled: false,
                usePopover: false,
                enableShowMoreToggle: true,
                showSearchInput: false,
                showClearAllButton: false,
                popoverPlaceholderText: "Chọn Lĩnh vực",
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Kỹ năng (Skill) */}
      <div style={sectionBoxStyle}>
        {renderSectionTitle(
          skillsAvailable || [],
          "Kỹ năng",
          skillExpanded,
          () => setSkillExpanded((v) => !v),
          null,
          SECTION_DOT_COLORS.skill
        )}

        <AnimatePresence initial={false}>
          {skillExpanded && (
            <motion.div
              key="skill-content"
              initial={{
                height: 0,
                opacity: 0,
                paddingTop: 0,
                paddingBottom: 0,
              }}
              animate={{
                height: "auto",
                opacity: 1,
              }}
              exit={{ height: 0, opacity: 0, paddingTop: 0, paddingBottom: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              {renderCheckableTags({
                data: skillsAvailable,
                idKey: "skillId",
                checkedIds: filters.skillIds,
                onChange: toggleSkill,
                showAll: skillShowAll,
                setShowAll: setSkillShowAll,
                // emptyText:
                //   filters.categoryIds.length === 0
                //     ? "Vui lòng chọn Lĩnh vực"
                //     : "Không có Kỹ năng",
                // disabled: filters.categoryIds.length === 0,
                emptyText: "Không có Kỹ năngƒ",
                disabled: false,
                usePopover: true,
                popoverVisible: skillPopoverVisible,
                setPopoverVisible: setSkillPopoverVisible,
                popoverSearchValue: popoverSkillSearch,
                onPopoverSearchChange: (e) =>
                  setPopoverSkillSearch(e.target.value),
                enableShowMoreToggle: false,
                placeholderText: "Tìm kiếm Kỹ năng",
                onClearAll: clearAllSkills,
                showSearchInput: true,
                showClearAllButton: true,
                popoverPlaceholderText: "Chọn Kỹ năng",
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Danh mục Dịch vụ (Service Category) */}
      <div style={sectionBoxStyle}>
        {renderSectionTitle(
          serviceCategoriesAvailable,
          "Danh mục Dịch vụ",
          serviceCategoryExpanded,
          () => setServiceCategoryExpanded((v) => !v),
          null,
          SECTION_DOT_COLORS.serviceCategory
        )}
        <AnimatePresence initial={false}>
          {serviceCategoryExpanded && (
            <motion.div
              key="service-category-content"
              initial={{
                height: 0,
                opacity: 0,
                paddingTop: 0,
                paddingBottom: 0,
              }}
              animate={{
                height: "auto",
                opacity: 1,
              }}
              exit={{ height: 0, opacity: 0, paddingTop: 0, paddingBottom: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              {renderCheckableTags({
                data: serviceCategoriesAvailable,
                idKey: "cateServiceId",
                checkedIds: filters.serviceCategoryIds,
                onChange: toggleServiceCategory,
                showAll: serviceCategoryShowAll,
                setShowAll: setServiceCategoryShowAll,
                emptyText:
                  size(filters?.categoryIds) === 0
                    ? "Vui lòng chọn Lĩnh vực"
                    : "Không có Danh mục Dịch vụ",
                disabled: size(filters?.categoryIds) === 0,
                usePopover: true,
                popoverVisible: serviceCategoryPopoverVisible,
                setPopoverVisible: setServiceCategoryPopoverVisible,
                popoverSearchValue: popoverServiceCategorySearch,
                onPopoverSearchChange: (e) =>
                  setPopoverServiceCategorySearch(e.target.value),
                enableShowMoreToggle: false,
                placeholderText: "Tìm kiếm Danh mục Dịch vụ",
                onClearAll: clearAllServiceCategories,
                showSearchInput: true,
                showClearAllButton: true,
                popoverPlaceholderText: "Chọn Danh mục Dịch vụ",
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chi tiết Dịch vụ (Service Detail) */}
      <div style={sectionBoxStyle}>
        {renderSectionTitle(
          servicesAvailable,
          "Dịch vụ",
          serviceDetailExpanded,
          () => setServiceDetailExpanded((v) => !v),
          null,
          SECTION_DOT_COLORS.serviceDetail
        )}
        <AnimatePresence initial={false}>
          {serviceDetailExpanded && (
            <motion.div
              key="service-detail-content"
              initial={{
                height: 0,
                opacity: 0,
                paddingTop: 0,
                paddingBottom: 0,
              }}
              animate={{
                height: "auto",
                opacity: 1,
              }}
              exit={{ height: 0, opacity: 0, paddingTop: 0, paddingBottom: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              {renderCheckableTags({
                data: servicesAvailable,
                idKey: "serviceId",
                checkedIds: filters.serviceIds,
                onChange: toggleService,
                showAll: serviceDetailShowAll,
                setShowAll: setServiceDetailShowAll,
                emptyText:
                  size(filters?.serviceCategoryIds) === 0
                    ? "Vui lòng chọn Danh mục Dịch vụ"
                    : "Không có Chi tiết Dịch vụ",
                disabled: size(filters?.serviceCategoryIds) === 0,
                usePopover: true,
                popoverVisible: serviceDetailPopoverVisible,
                setPopoverVisible: setServiceDetailPopoverVisible,
                popoverSearchValue: popoverServiceDetailSearch,
                onPopoverSearchChange: (e) =>
                  setPopoverServiceDetailSearch(e.target.value),
                enableShowMoreToggle: false,
                placeholderText: "Tìm kiếm Dịch vụ",
                onClearAll: clearAllServices,
                showSearchInput: true,
                showClearAllButton: true,
                popoverPlaceholderText: "Chọn Dịch vụ",
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Địa điểm (Location) */}
      <div style={sectionBoxStyle}>
        {renderSectionTitle(
          locationAvailable,
          "Địa điểm",
          locationExpanded,
          () => setLocationExpanded((v) => !v),
          null,
          SECTION_DOT_COLORS.location
        )}
        <AnimatePresence initial={false}>
          {locationExpanded && (
            <motion.div
              key="location-content"
              initial={{
                height: 0,
                opacity: 0,
                paddingTop: 0,
                paddingBottom: 0,
              }}
              animate={{
                height: "auto",
                opacity: 1,
              }}
              exit={{ height: 0, opacity: 0, paddingTop: 0, paddingBottom: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              {renderCheckableTags({
                data: locationAvailable,
                idKey: "locationId",
                checkedIds: filters.locationIds ?? [],
                onChange: toggleLocation,
                showAll: locationShowAll,
                setShowAll: setLocationShowAll,
                emptyText: "Không có Địa điểm",
                disabled: false,
                usePopover: true,
                popoverVisible: locationPopoverVisible,
                setPopoverVisible: setLocationPopoverVisible,
                popoverSearchValue: popoverLocationSearch,
                onPopoverSearchChange: (e) =>
                  setPopoverLocationSearch(e.target.value),
                enableShowMoreToggle: false,
                placeholderText: "Tìm kiếm Địa điểm",
                onClearAll: clearAllLocations,
                showSearchInput: true,
                showClearAllButton: true,
                popoverPlaceholderText: "Chọn Địa điểm",
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Loại tài khoản (Account Type) */}
      <div style={sectionBoxStyle}>
        {renderSectionTitle(
          [],
          "Loại tài khoản",
          accountTypeExpanded,
          () => setAccountTypeExpanded((v) => !v),
          null,
          SECTION_DOT_COLORS.accountType
        )}
        <AnimatePresence initial={false}>
          {accountTypeExpanded && (
            <motion.div
              key="account-type-content"
              initial={{
                height: 0,
                opacity: 0,
                paddingTop: 0,
                paddingBottom: 0,
              }}
              animate={{
                height: "auto",
                opacity: 1,
              }}
              exit={{ height: 0, opacity: 0, paddingTop: 0, paddingBottom: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              <Select
                allowClear
                placeholder="Chọn loại tài khoản"
                value={
                  filters.accountType === undefined ? null : filters.accountType
                }
                onChange={toggleAccountType}
                style={{ width: "100%" }}
              >
                <Option value="PERSONAL">Cá nhân</Option>
                <Option value="BUSINESS">Doanh nghiệp</Option>
              </Select>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Ngôn ngữ (Language) */}
      <div style={sectionBoxStyle}>
        {renderSectionTitle(
          languageAvailable,
          "Ngôn ngữ",
          languageExpanded,
          () => setLanguageExpanded((v) => !v),
          null,
          SECTION_DOT_COLORS.language
        )}
        <AnimatePresence initial={false}>
          {languageExpanded && (
            <motion.div
              key="language-content"
              initial={{
                height: 0,
                opacity: 0,
                paddingTop: 0,
                paddingBottom: 0,
              }}
              animate={{
                height: "auto",
                opacity: 1,
              }}
              exit={{ height: 0, opacity: 0, paddingTop: 0, paddingBottom: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              {renderCheckableTags({
                data: languageAvailable,
                idKey: "languageId",
                checkedIds: filters.languageIds ?? [],
                onChange: toggleLanguage,
                showAll: languageShowAll,
                setShowAll: setLanguageShowAll,
                emptyText: "Không có Ngôn ngữ",
                disabled: false,
                usePopover: true,
                popoverVisible: languagePopoverVisible,
                setPopoverVisible: setLanguagePopoverVisible,
                popoverSearchValue: popoverLanguageSearch,
                onPopoverSearchChange: (e) =>
                  setPopoverLanguageSearch(e.target.value),
                enableShowMoreToggle: false,
                placeholderText: "Tìm kiếm Ngôn ngữ",
                onClearAll: clearAllLanguages,
                showSearchInput: true,
                showClearAllButton: true,
                popoverPlaceholderText: "Chọn Ngôn ngữ",
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FilterPartnersListComponent;
