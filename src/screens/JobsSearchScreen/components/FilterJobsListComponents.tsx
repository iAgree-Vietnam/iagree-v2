import React, { useCallback, useMemo, useState } from "react";
import ArrayUtils from "@/src/utils/ArrayUtils";
import { Moment } from "moment";
import { Select } from "antd";

import { SkillResource } from "@/src/data/skill/models/skill.types";
import useJobAddSelectbox from "../../JobScreen/JobFormScreen/hooks/useJobAddSelectbox";
import {
  FullJobResource,
  JobSelectboxResource,
} from "@/src/data/job/models/job.types";
import { AnimatePresence, motion } from "framer-motion";
import { JobSearchFilterParams } from "../JobsSearchScreenV2";
import { renderSectionTitle } from "../../SearchScreen/components/RenderSectionTitle";
import SelectedFilterJobsList from "./SelectedFilterJobsList";
import { renderCheckableTags } from "../../SearchScreen/components/RenderCheckableTags";
import RemunerationComponent from "./RemunerationComponent";
import AppDatePicker from "@/src/components/date/DatePicker";
import datetimeUtils from "@/src/utils/DatetimeUtils";
import moment from "moment";
import {
  CateServiceResource,
  ServiceResource,
} from "@/src/data/category/models/category.types";
import Constants from "@/src/constants/Constants";
import { includes, size } from "lodash";
import { FullJobResourceV2 } from "@/src/data/job/models/v2/job.types";

const { Option } = Select;

type FilterJobsListComponentsProps = {
  skills: SkillResource[];
  serviceCategories: CateServiceResource[];
  services: ServiceResource[];
  filters: JobSearchFilterParams;
  setJobPage: React.Dispatch<React.SetStateAction<number>>;
  setFilters: React.Dispatch<React.SetStateAction<JobSearchFilterParams>>;
  setJobsList: React.Dispatch<React.SetStateAction<FullJobResourceV2[]>>;
};

const FilterJobsListComponents = ({
  skills,
  serviceCategories,
  services,
  filters,
  setJobPage,
  setFilters,
  setJobsList,
}: FilterJobsListComponentsProps) => {
  const SECTION_DOT_COLORS = {
    category: "#09993E",
    skill: "#2980B9",
    serviceCategory: "#a7330cff",
    serviceDetail: "#FF9800",
    salaryType: "#6A5ACD",
    priceRange: "#FF6347",
    postingEndDate: "#8A2BE2",
    postedDate: "#FFA500",
  };

  const setDefaultJobPageWhenFilter = () => {
    setJobPage?.(1);
    setJobsList?.([]);
  };

  const [popoverSkillSearch, setPopoverSkillSearch] = useState("");
  const [popoverServiceCategorySearch, setPopoverServiceCategorySearch] =
    useState("");
  const [popoverServiceDetailSearch, setPopoverServiceDetailSearch] =
    useState("");

  const [skillPopoverVisible, setSkillPopoverVisible] = useState(false);
  const [serviceCategoryPopoverVisible, setServiceCategoryPopoverVisible] =
    useState(false);
  const [serviceDetailPopoverVisible, setServiceDetailPopoverVisible] =
    useState(false);

  const [categoryExpanded, setCategoryExpanded] = useState(true);
  const [skillExpanded, setSkillExpanded] = useState(true);
  const [serviceCategoryExpanded, setServiceCategoryExpanded] = useState(true);
  const [serviceDetailExpanded, setServiceDetailExpanded] = useState(true);

  const [remunerationExpanded, setRemunerationExpanded] = useState(true);
  const [postingEndDateExpanded, setPostingEndDateExpanded] = useState(true);
  const [postedDateExpanded, setPostedDateExpanded] = useState(true);

  const [categoryShowAll, setCategoryShowAll] = useState(false);
  const [skillShowAll, setSkillShowAll] = useState(false);
  const [serviceCategoryShowAll, setServiceCategoryShowAll] = useState(false);
  const [serviceDetailShowAll, setServiceDetailShowAll] = useState(false);

  const selectboxQuery = useJobAddSelectbox();
  const selectboxResource = selectboxQuery.data as JobSelectboxResource;

  const skillsAvailable: SkillResource[] = useMemo(() => {
    return selectboxResource?.skills ?? [];
  }, [filters.skillIds, selectboxResource?.skills]);

  const serviceCategoriesAvailable: CateServiceResource[] = useMemo(() => {
    return (
      selectboxResource?.categories
        ?.filter((category) =>
          includes(filters?.categoryIds, category.categoryId)
        )
        .flatMap((category) => category.childrens || []) || []
    );
  }, [filters.serviceCategoryIds, serviceCategories]);

  const servicesAvailable: ServiceResource[] = useMemo(() => {
    const categoriesWithServices =
      selectboxResource?.categories?.flatMap(
        (category) => category.childrens || []
      ) || [];
    return (
      categoriesWithServices
        .filter((serviceCategory) =>
          filters?.serviceCategoryIds?.includes(serviceCategory.cateServiceId)
        )
        .flatMap((serviceCategory) => serviceCategory.childrens || []) || []
    );
  }, [filters?.serviceIds, services]);

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
      setFilters?.((prev) => {
        setDefaultJobPageWhenFilter();

        const newCategoryIds = ArrayUtils.addOrRemoveV2(prev?.categoryIds, id);

        const allPossibleServiceCategories =
          selectboxResource?.categories
            ?.filter((cat) => newCategoryIds?.includes(cat.categoryId))
            ?.flatMap((cat) => cat.childrens || []) || [];

        const newServiceCategoryIds = filterValidIds(
          prev?.serviceCategoryIds || [],
          allPossibleServiceCategories,
          "cateServiceId"
        );

        const allPossibleServices =
          selectboxResource.categories
            ?.flatMap((cat) => cat.childrens || [])
            .filter((sc) => newServiceCategoryIds.includes(sc.cateServiceId))
            .flatMap((sc) => sc.childrens || []) || [];

        const newServiceIds = filterValidIds(
          prev?.serviceIds || [],
          allPossibleServices,
          "serviceId"
        );

        return {
          ...prev,
          categoryIds: newCategoryIds,
          serviceCategoryIds: newServiceCategoryIds,
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

  const toggleSkill = useCallback(
    (id: number) => {
      setDefaultJobPageWhenFilter();

      setFilters?.((prev) => {
        const newSkillIds = ArrayUtils.addOrRemoveV2(prev?.skillIds, id);
        return {
          ...prev,
          skillIds: newSkillIds,
        };
      });
    },
    [setFilters]
  );

  const toggleServiceCategory = useCallback(
    (id: number) => {
      setDefaultJobPageWhenFilter();

      setFilters?.((prev) => {
        const newServiceCategoryIds = ArrayUtils.addOrRemoveV2(
          prev?.serviceCategoryIds,
          id
        );

        const allPossibleServices =
          selectboxResource.categories
            ?.flatMap((cat) => cat.childrens || [])
            .filter((sc) => newServiceCategoryIds.includes(sc.cateServiceId))
            .flatMap((sc) => sc.childrens || []) || [];

        const newServiceIds = filterValidIds(
          prev?.serviceIds || [],
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

  const toggleService = useCallback(
    (id: number) => {
      setDefaultJobPageWhenFilter();

      setFilters?.((prev) => ({
        ...prev,
        serviceIds: ArrayUtils.addOrRemoveV2(prev?.serviceIds, id),
      }));
    },
    [setFilters]
  );

  const togglePostingEndDate = useCallback(
    (date: Moment | null) => {
      setDefaultJobPageWhenFilter();
      setFilters?.((prev) => ({
        ...prev,
        postingEndDate:
          date && date.isValid()
            ? date.format(datetimeUtils.LOCAL_DATE)
            : undefined,
      }));
    },
    [setFilters, setDefaultJobPageWhenFilter]
  );

  const toggleSalaryType = useCallback(
    (value: number | null) => {
      setDefaultJobPageWhenFilter();
      setFilters?.((prev) => {
        const newPriceMin = undefined;
        const newPriceMax = undefined;
        return {
          ...prev,
          salaryType: value === null ? undefined : value,
          priceMin: newPriceMin,
          priceMax: newPriceMax,
        };
      });
    },
    [setFilters, setDefaultJobPageWhenFilter]
  );

  const togglePostedDateRange = useCallback(
    (value: string | null) => {
      setDefaultJobPageWhenFilter();
      setFilters?.((prev) => ({
        ...prev,
        postedDateRange: value === null ? undefined : value,
      }));
    },
    [setFilters, setDefaultJobPageWhenFilter]
  );

  const clearAllFilters = () => {
    setDefaultJobPageWhenFilter();

    setFilters?.((prev) => ({
      ...prev,
      categoryIds: [],
      serviceCategoryIds: [],
      skillIds: [],
      serviceIds: [],
      salaryType: undefined,
      priceMin: undefined,
      priceMax: undefined,
      postingEndDate: undefined,
      postedDateRange: undefined,
    }));
  };

  const clearAllSkills = useCallback(() => {
    setDefaultJobPageWhenFilter();

    setFilters?.((prev) => ({
      ...prev,
      skillIds: [],
    }));
  }, [setFilters]);

  const clearAllServiceCategories = useCallback(() => {
    setDefaultJobPageWhenFilter();

    setFilters?.((prev) => ({
      ...prev,
      serviceCategoryIds: [],
      serviceIds: [],
    }));
  }, [setFilters]);

  const clearAllServices = useCallback(() => {
    setDefaultJobPageWhenFilter();

    setFilters?.((prev) => ({
      ...prev,
      serviceIds: [],
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
      <SelectedFilterJobsList
        filters={filters}
        categories={selectboxResource?.categories || []}
        skills={skillsAvailable}
        serviceCategories={serviceCategoriesAvailable}
        services={servicesAvailable}
        toggleCategory={toggleCategory}
        toggleSkill={toggleSkill}
        toggleServiceCategory={toggleServiceCategory}
        toggleService={toggleService}
        clearAllFilters={clearAllFilters}
        setFilters={setFilters}
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
                checkedIds: filters?.categoryIds,
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
          skillsAvailable,
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
                emptyText: "Không có Kỹ năng",
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
                  size(filters.categoryIds) === 0
                    ? "Vui lòng chọn Lĩnh vực"
                    : "Không có Danh mục Dịch vụ",
                disabled: size(filters.categoryIds) === 0,
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
                  size(filters.serviceCategoryIds) === 0
                    ? "Vui lòng chọn Danh mục Dịch vụ"
                    : "Không có Chi tiết Dịch vụ",
                disabled: size(filters.serviceCategoryIds) === 0,
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
      {/* Thời hạn ứng tuyển (Posting End Date) */}
      <div style={sectionBoxStyle}>
        {renderSectionTitle(
          [],
          "Thời hạn ứng tuyển",
          postingEndDateExpanded,
          () => setPostingEndDateExpanded((v) => !v),
          null,
          SECTION_DOT_COLORS.postingEndDate
        )}
        <AnimatePresence initial={false}>
          {postingEndDateExpanded && (
            <motion.div
              key="posting-date-content"
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
              <AppDatePicker
                format={datetimeUtils.LOCAL_DATE}
                placeholder="Thời hạn ứng tuyển"
                onChange={togglePostingEndDate}
                style={{ width: "100%" }}
                allowClear
                value={
                  filters.postingEndDate !== undefined
                    ? moment(filters.postingEndDate, datetimeUtils.LOCAL_DATE)
                    : null
                }
                disabledDate={(current) => {
                  return current && current < moment().startOf("day");
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Loại thù lao (Salary Type) */}
      <div style={sectionBoxStyle}>
        {renderSectionTitle(
          [],
          "Loại thù lao",
          remunerationExpanded,
          () => setRemunerationExpanded((v) => !v),
          null,
          SECTION_DOT_COLORS.salaryType
        )}
        <AnimatePresence initial={false}>
          {remunerationExpanded && (
            <motion.div
              key="salary-type-content"
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
                placeholder="Chọn loại thù lao"
                value={
                  filters.salaryType === undefined ? null : filters.salaryType
                }
                onChange={toggleSalaryType}
                style={{ width: "100%" }}
              >
                <Option value={1}>Thoả thuận</Option>
                <Option value={3}>Cố định</Option>
              </Select>
              {filters.salaryType === 1 && (
                <RemunerationComponent
                  filters={{
                    priceMin: filters.priceMin,
                    priceMax: filters.priceMax,
                  }}
                  setFilters={setFilters}
                  setDefaultJobAndPartnerPageWhenFilter={
                    setDefaultJobPageWhenFilter
                  }
                  dotColor={SECTION_DOT_COLORS.salaryType}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Thời gian đăng công việc */}
      <div style={sectionBoxStyle}>
        {renderSectionTitle(
          [],
          "Thời gian đăng công việc",
          postedDateExpanded,
          () => setPostedDateExpanded((v) => !v),
          null,
          SECTION_DOT_COLORS.postedDate
        )}
        <AnimatePresence initial={false}>
          {postedDateExpanded && (
            <motion.div
              key="posted-date-content"
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
                placeholder="Chọn thời gian đăng công việc"
                value={
                  filters.postedDateRange === undefined
                    ? null
                    : filters.postedDateRange
                }
                onChange={togglePostedDateRange}
                style={{ width: "100%" }}
              >
                <Option value={Constants.JOB.POSTED_DATE_TYPE_V2.TODAY}>
                  Hôm nay
                </Option>
                <Option value={Constants.JOB.POSTED_DATE_TYPE_V2.LAST1DAY}>
                  Trong 1 ngày qua
                </Option>
                <Option value={Constants.JOB.POSTED_DATE_TYPE_V2.LAST3DAYS}>
                  Trong 3 ngày qua
                </Option>
                <Option value={Constants.JOB.POSTED_DATE_TYPE_V2.LAST7DAYS}>
                  Trong 7 ngày qua
                </Option>
                <Option value={Constants.JOB.POSTED_DATE_TYPE_V2.LAST15DAYS}>
                  Trong 15 ngày qua
                </Option>
                <Option value={Constants.JOB.POSTED_DATE_TYPE_V2.LAST30DAYS}>
                  Trong 30 ngày qua
                </Option>
                <Option value={Constants.JOB.POSTED_DATE_TYPE.LAST90DAYS}>
                  Trong 90 ngày qua
                </Option>
              </Select>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FilterJobsListComponents;
