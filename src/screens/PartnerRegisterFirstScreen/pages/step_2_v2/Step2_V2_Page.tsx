import React, { useState, useMemo, useCallback } from "react";
import {
  Divider,
  Typography,
  message,
  Grid,
  Button,
  Drawer,
  Badge,
} from "antd";
import { MenuOutlined } from "@ant-design/icons";

import {
  CateServiceResource,
  ServiceResource,
} from "@/src/data/category/models/category.types";

import { CategorySection } from "./sections/CategorySection";
import { ServiceCategorySection } from "./sections/ServiceCategorySection";
import { ServiceDetailSection } from "./sections/ServiceDetailSection";
import ArrayUtils from "@/src/utils/ArrayUtils";
import { PartnerSelectBoxResource } from "@/src/data/partner/models/partner.types";
import { isEmpty } from "lodash";

const { useBreakpoint } = Grid;

interface ServiceCategoryWithServices {
  id: number;
  services: number[];
}

export interface Step2V2ScreenFilterState {
  selectedCategoryId: number | null;
  selectedServiceCategoriesByCategoryId: {
    [categoryId: number]: ServiceCategoryWithServices[];
  };
  selectedCategoryIdsWithSelections: number[];
}

const MAX_CATEGORIES_WITH_SELECTIONS = 3;

export interface Step2V2FormValues {
  [categoryId: number]: {
    selectedServiceCategories: ServiceCategoryWithServices[];
  };
}

interface Step2V2PageProps {
  value?: Step2V2FormValues;
  onChange?: (value: Step2V2FormValues) => void;
  selectBoxResource?: PartnerSelectBoxResource;
}

const transformFormValuesToFilters = (
  value: Step2V2FormValues
): Step2V2ScreenFilterState => {
  const newSelectedServiceCategoriesByCategoryId: {
    [categoryId: number]: ServiceCategoryWithServices[];
  } = {};
  const newSelectedCategoryIdsWithSelections: number[] = [];
  let selectedCategoryId: number | null = null;
  const existingCategoryIds = Object.keys(value).map(Number);

  for (const categoryId of existingCategoryIds) {
    const catId = Number(categoryId);
    const categoryData = value[catId];
    const selectedServiceCategories =
      categoryData?.selectedServiceCategories || [];

    newSelectedServiceCategoriesByCategoryId[catId] = selectedServiceCategories;

    if (selectedServiceCategories?.length > 0) {
      newSelectedCategoryIdsWithSelections.push(catId);
      if (selectedCategoryId === null) {
        selectedCategoryId = catId;
      }
    }
  }

  if (selectedCategoryId === null && existingCategoryIds?.length > 0) {
    selectedCategoryId = existingCategoryIds[0];
  }

  return {
    selectedCategoryId: selectedCategoryId,
    selectedServiceCategoriesByCategoryId:
      newSelectedServiceCategoriesByCategoryId,
    selectedCategoryIdsWithSelections: newSelectedCategoryIdsWithSelections,
  };
};

export const Step2V2Page: React.FC<Step2V2PageProps> = ({
  value = {},
  onChange,
  selectBoxResource,
}) => {
  const [filters, setFilters] = useState<Step2V2ScreenFilterState>(() =>
    transformFormValuesToFilters(value)
  );
  const screens = useBreakpoint();
  const isMobile = useMemo(() => screens.lg === false, [screens]);
  const [isCategoryDrawerVisible, setIsCategoryDrawerVisible] = useState(false);

  const triggerChange = useCallback(
    (newFilters: Step2V2ScreenFilterState) => {
      const newFormValue: Step2V2FormValues = {};
      for (const categoryId in newFilters.selectedServiceCategoriesByCategoryId) {
        if (
          newFilters.selectedServiceCategoriesByCategoryId.hasOwnProperty(
            categoryId
          )
        ) {
          const catId = Number(categoryId);
          const selectedServiceCategories =
            newFilters.selectedServiceCategoriesByCategoryId[catId];
          if (selectedServiceCategories?.length > 0) {
            newFormValue[catId] = { selectedServiceCategories };
          }
        }
      }
      if (onChange) {
        onChange(newFormValue);
      }
    },
    [onChange]
  );

  const serviceToServiceCategoryMap = useMemo(() => {
    const map = new Map<number, number>();
    selectBoxResource?.categories?.forEach((category) => {
      category.childrens?.forEach((serviceCategory) => {
        serviceCategory.childrens?.forEach((service) => {
          map.set(service.serviceId, serviceCategory.cateServiceId);
        });
      });
    });
    return map;
  }, [selectBoxResource?.categories]);

  const categoryCounts = useMemo(() => {
    const counts: { [key: number]: number } = {};
    for (const categoryId in filters.selectedServiceCategoriesByCategoryId) {
      if (
        filters.selectedServiceCategoriesByCategoryId.hasOwnProperty(categoryId)
      ) {
        counts[Number(categoryId)] =
          filters.selectedServiceCategoriesByCategoryId[
            Number(categoryId)
          ]?.length;
      }
    }
    return counts;
  }, [filters.selectedServiceCategoriesByCategoryId]);

  const serviceCategoryCounts = useMemo(() => {
    const counts: { [key: number]: number } = {};
    for (const categoryId in filters.selectedServiceCategoriesByCategoryId) {
      if (
        filters.selectedServiceCategoriesByCategoryId.hasOwnProperty(categoryId)
      ) {
        filters.selectedServiceCategoriesByCategoryId[categoryId].forEach(
          (sc) => {
            counts[sc.id] = sc?.services?.length;
          }
        );
      }
    }
    return counts;
  }, [filters.selectedServiceCategoriesByCategoryId]);

  const serviceCategoriesAvailable: CateServiceResource[] = useMemo(() => {
    if (filters.selectedCategoryId === null) return [];

    const category = selectBoxResource?.categories?.find(
      (cat) => cat.categoryId === filters.selectedCategoryId
    );
    return category?.childrens || [];
  }, [filters.selectedCategoryId, selectBoxResource?.categories]);

  const handleCategoryClick = useCallback(
    (id: number) => {
      setFilters((prev) => {
        let newSelectedCategoryId = prev.selectedCategoryId;
        if (prev.selectedCategoryId === id) {
          newSelectedCategoryId = null;
        } else {
          newSelectedCategoryId = id;
        }
        return {
          ...prev,
          selectedCategoryId: newSelectedCategoryId,
        };
      });
      if (isMobile) {
        setIsCategoryDrawerVisible(false);
      }
    },
    [setFilters, isMobile]
  );

  const handleServiceCategoryToggle = useCallback(
    (id: number) => {
      setFilters((prev) => {
        if (prev.selectedCategoryId === null) return prev;

        const currentServiceCategories =
          prev.selectedServiceCategoriesByCategoryId[prev.selectedCategoryId] ||
          [];

        const isSelecting = !currentServiceCategories.some(
          (sc) => sc.id === id
        );
        const currentCategoryHasNoSelection =
          currentServiceCategories?.length === 0;

        if (
          isSelecting &&
          currentCategoryHasNoSelection &&
          prev.selectedCategoryIdsWithSelections?.length >=
            MAX_CATEGORIES_WITH_SELECTIONS
        ) {
          message.warning(
            `Bạn chỉ có thể chọn tối đa ${MAX_CATEGORIES_WITH_SELECTIONS} Lĩnh vực có Danh mục Dịch vụ được chọn.`
          );
          return prev;
        }

        const newServiceCategories = isSelecting
          ? [...currentServiceCategories, { id, services: [] }]
          : currentServiceCategories.filter((sc) => sc.id !== id);

        const newSelectedCategoriesByCatId = {
          ...prev.selectedServiceCategoriesByCategoryId,
          [prev.selectedCategoryId]: newServiceCategories,
        };

        const newSelectedCategoryIdsWithSelections = Object.keys(
          newSelectedCategoriesByCatId
        )
          .map(Number)
          .filter((catId) => newSelectedCategoriesByCatId?.[catId]?.length > 0);

        const updatedFilters = {
          ...prev,
          selectedServiceCategoriesByCategoryId: newSelectedCategoriesByCatId,
          selectedCategoryIdsWithSelections:
            newSelectedCategoryIdsWithSelections,
        };

        triggerChange(updatedFilters);
        return updatedFilters;
      });
    },
    [setFilters, triggerChange]
  );

  const onSelectAllServiceCategories = useCallback(
    (checked: boolean) => {
      setFilters((prev) => {
        if (prev.selectedCategoryId === null) return prev;

        const currentCategory = selectBoxResource?.categories?.find(
          (cat) => cat.categoryId === prev.selectedCategoryId
        );
        const allServiceCategoryIds =
          currentCategory?.childrens?.map((sc) => sc.cateServiceId) || [];
        const newServiceCategories = checked
          ? allServiceCategoryIds.map((id) => ({ id, services: [] }))
          : [];

        const newSelectedCategoriesByCatId = {
          ...prev.selectedServiceCategoriesByCategoryId,
          [prev.selectedCategoryId]: newServiceCategories,
        };

        const newSelectedCategoryIdsWithSelections = Object.keys(
          newSelectedCategoriesByCatId
        )
          .map(Number)
          .filter((catId) => newSelectedCategoriesByCatId?.[catId]?.length > 0);

        const updatedFilters = {
          ...prev,
          selectedServiceCategoriesByCategoryId: newSelectedCategoriesByCatId,
          selectedCategoryIdsWithSelections:
            newSelectedCategoryIdsWithSelections,
        };

        triggerChange(updatedFilters);
        return updatedFilters;
      });
    },
    [setFilters, selectBoxResource?.categories, triggerChange]
  );

  const clearAllServiceCategories = useCallback(() => {
    setFilters((prev) => {
      if (prev.selectedCategoryId === null) return prev;

      const newSelectedCategoriesByCatId = {
        ...prev.selectedServiceCategoriesByCategoryId,
        [prev.selectedCategoryId]: [],
      };

      const newSelectedCategoryIdsWithSelections = Object.keys(
        newSelectedCategoriesByCatId
      )
        .map(Number)
        .filter((catId) => newSelectedCategoriesByCatId[catId].length > 0);

      const updatedFilters = {
        ...prev,
        selectedServiceCategoriesByCategoryId: newSelectedCategoriesByCatId,
        selectedCategoryIdsWithSelections: newSelectedCategoryIdsWithSelections,
      };

      triggerChange(updatedFilters);
      return updatedFilters;
    });
  }, [setFilters, triggerChange]);

  const toggleService = useCallback(
    (serviceId: number) => {
      setFilters((prev) => {
        const parentServiceCatId = serviceToServiceCategoryMap.get(serviceId);
        if (
          prev.selectedCategoryId === null ||
          parentServiceCatId === undefined
        )
          return prev;

        const currentServiceCategories =
          prev.selectedServiceCategoriesByCategoryId[prev.selectedCategoryId] ||
          [];

        const serviceCategory = currentServiceCategories.find(
          (sc) => sc.id === parentServiceCatId
        );

        if (!serviceCategory) return prev;

        const newServiceIds = ArrayUtils.addOrRemoveV2(
          serviceCategory.services,
          serviceId
        );
        const newServiceCategories = currentServiceCategories.map((sc) =>
          sc.id === parentServiceCatId ? { ...sc, services: newServiceIds } : sc
        );

        const newSelectedCategoriesByCatId = {
          ...prev.selectedServiceCategoriesByCategoryId,
          [prev.selectedCategoryId]: newServiceCategories,
        };

        const updatedFilters = {
          ...prev,
          selectedServiceCategoriesByCategoryId: newSelectedCategoriesByCatId,
        };

        triggerChange(updatedFilters);
        return updatedFilters;
      });
    },
    [setFilters, serviceToServiceCategoryMap, triggerChange]
  );

  const onSelectAllServicesEachServiceCategory = useCallback(
    (serviceCategoryId: number, checked: boolean) => {
      setFilters((prev) => {
        if (prev.selectedCategoryId === null) return prev;

        const currentCategory = selectBoxResource?.categories?.find(
          (cat) => cat.categoryId === prev.selectedCategoryId
        );

        const currentServiceCategory = currentCategory?.childrens?.find(
          (sc) => sc.cateServiceId === serviceCategoryId
        );

        const allServiceIds =
          currentServiceCategory?.childrens?.map((s) => s.serviceId) || [];
        const newServiceIds = checked ? allServiceIds : [];

        const newServiceCategories = prev.selectedServiceCategoriesByCategoryId[
          prev.selectedCategoryId
        ]?.map((sc) =>
          sc.id === serviceCategoryId ? { ...sc, services: newServiceIds } : sc
        );

        const newSelectedCategoriesByCatId = {
          ...prev.selectedServiceCategoriesByCategoryId,
          [prev.selectedCategoryId]: newServiceCategories,
        };

        const updatedFilters = {
          ...prev,
          selectedServiceCategoriesByCategoryId: newSelectedCategoriesByCatId,
        };

        triggerChange(updatedFilters);
        return updatedFilters;
      });
    },
    [setFilters, selectBoxResource?.categories, triggerChange]
  );

  const onSelectAllServicesInAllCategories = useCallback(
    (checked: boolean) => {
      setFilters((prev) => {
        if (prev.selectedCategoryId === null) return prev;

        const currentCategory = selectBoxResource?.categories?.find(
          (cat) => cat.categoryId === prev.selectedCategoryId
        );

        if (!currentCategory) return prev;

        const updatedServiceCategories =
          prev.selectedServiceCategoriesByCategoryId[
            prev.selectedCategoryId
          ]?.map((sc) => {
            const serviceCategoryData = currentCategory.childrens?.find(
              (s) => s.cateServiceId === sc.id
            );
            const allServiceIds =
              serviceCategoryData?.childrens?.map((s) => s.serviceId) || [];
            const newServiceIds = checked ? allServiceIds : [];
            return {
              ...sc,
              services: newServiceIds,
            };
          }) || [];

        const newSelectedCategoriesByCatId = {
          ...prev.selectedServiceCategoriesByCategoryId,
          [prev.selectedCategoryId]: updatedServiceCategories,
        };

        const updatedFilters = {
          ...prev,
          selectedServiceCategoriesByCategoryId: newSelectedCategoriesByCatId,
        };

        triggerChange(updatedFilters);
        return updatedFilters;
      });
    },
    [setFilters, selectBoxResource?.categories, triggerChange]
  );

  const clearAllServices = useCallback(() => {
    setFilters((prev) => {
      if (prev.selectedCategoryId === null) return prev;

      const currentServiceCategories =
        prev.selectedServiceCategoriesByCategoryId[prev.selectedCategoryId] ||
        [];

      const newServiceCategories = currentServiceCategories.map((sc) => ({
        ...sc,
        services: [],
      }));

      const newSelectedCategoriesByCatId = {
        ...prev.selectedServiceCategoriesByCategoryId,
        [prev.selectedCategoryId]: newServiceCategories,
      };

      const updatedFilters = {
        ...prev,
        selectedServiceCategoriesByCategoryId: newSelectedCategoriesByCatId,
      };

      triggerChange(updatedFilters);
      return updatedFilters;
    });
  }, [setFilters, triggerChange]);

  const selectedServiceCategoryIdsForActiveCategory: number[] = useMemo(() => {
    if (filters.selectedCategoryId === null) return [];
    const serviceCategories =
      filters.selectedServiceCategoriesByCategoryId[
        filters.selectedCategoryId
      ] || [];
    return serviceCategories.map((sc) => sc.id);
  }, [
    filters.selectedCategoryId,
    filters.selectedServiceCategoriesByCategoryId,
  ]);

  const servicesGroupedByServiceCategory = useMemo(() => {
    if (filters.selectedCategoryId === null) return [];

    const currentServiceCategories =
      filters?.selectedServiceCategoriesByCategoryId[
        filters?.selectedCategoryId
      ] || [];

    if (currentServiceCategories?.length === 0) return [];

    const groupedData: {
      title: string;
      children: ServiceResource[];
      id: number;
      selectedServices: number[];
    }[] = [];

    const currentCategory = selectBoxResource?.categories?.find(
      (cat) => cat.categoryId === filters.selectedCategoryId
    );

    currentServiceCategories.forEach((selectedSc) => {
      const serviceCategory = currentCategory?.childrens?.find(
        (sc) => sc.cateServiceId === selectedSc.id
      );

      if (
        serviceCategory &&
        serviceCategory?.childrens &&
        serviceCategory?.childrens?.length > 0
      ) {
        groupedData.push({
          title: serviceCategory.name,
          children: serviceCategory.childrens,
          id: serviceCategory.cateServiceId,
          selectedServices: selectedSc.services,
        });
      }
    });

    return groupedData;
  }, [
    filters.selectedCategoryId,
    filters.selectedServiceCategoriesByCategoryId,
    selectBoxResource?.categories,
  ]);

  const isAllServicesSelected = useMemo(() => {
   return  servicesGroupedByServiceCategory
      .map((it) => it.selectedServices)
      .every((it) => !isEmpty(it));
  }, [servicesGroupedByServiceCategory]);

  const isAnyServiceCategorySelected = useMemo(() => {
    for (const categoryId in value) {
      if (value.hasOwnProperty(categoryId)) {
        if (value?.[categoryId]?.selectedServiceCategories?.length > 0) {
          return true;
        }
      }
    }
    return false;
  }, [value]);

  const isAnyServiceSelected = useMemo(() => {
    for (const categoryId in value) {
      if (value.hasOwnProperty(categoryId)) {
        for (const serviceCategory of value[categoryId]
          .selectedServiceCategories) {
          if (serviceCategory?.services?.length > 0) {
            return true;
          }
        }
      }
    }
    return false;
  }, [value]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div style={{ marginBottom: "15px" }}>
        <Typography.Title
          level={2}
          style={{ margin: 0, color: "#333", marginBottom: "10px" }}
        >
          Hãy cho Khách hàng biết thế mạnh của bạn là gì!
        </Typography.Title>
        <Typography.Text style={{ color: "#09993E" }}>
          Chọn những lĩnh vực, dịch vụ mà bạn muốn cung cấp. iAgree sẽ ưu tiên
          hiển thị hồ sơ của bạn đến đúng Khách hàng có nhu cầu. (Thông tin này
          có thể được cập nhật bất kỳ lúc nào.)
        </Typography.Text>
      </div>

      <Divider style={{ borderColor: "#D4D4D4", margin: "0 0 20px 0" }} />

      <div
        style={{
          display: "flex",
          flexGrow: 1,
          width: "100%",
          overflow: "auto",
          boxSizing: "border-box",
        }}
      >
        {isMobile && (
          <div style={{ marginBottom: 16 }}>
            <Typography.Text
              type="secondary"
              style={{ marginBottom: 8, display: "block" }}
            >
              Tối đa 3 lĩnh vực
            </Typography.Text>
            <Badge
              count={filters?.selectedCategoryIdsWithSelections?.length}
              offset={[-10, 10]}
              style={{ display: "flex", alignItems: "center" }}
            >
              <Button
                type="default"
                shape="circle"
                icon={<MenuOutlined />}
                onClick={() => setIsCategoryDrawerVisible(true)}
              />
            </Badge>
            <Drawer
              title="Danh sách Lĩnh vực"
              placement="left"
              onClose={() => setIsCategoryDrawerVisible(false)}
              open={isCategoryDrawerVisible}
              width={250}
              style={{ padding: 0 }}
            >
              <CategorySection
                categories={selectBoxResource?.categories}
                selectedCategoryId={filters.selectedCategoryId}
                onCategoryClick={handleCategoryClick}
                categoryCounts={categoryCounts}
                selectedCategoryIdsWithSelections={
                  filters.selectedCategoryIdsWithSelections
                }
                maxCategoriesWithSelections={3}
                filters={filters}
                isAllServicesSelected={isAllServicesSelected}
              />
            </Drawer>
          </div>
        )}

        {/* Lĩnh vực */}
        {!isMobile && (
          <CategorySection
            categories={selectBoxResource?.categories}
            selectedCategoryId={filters.selectedCategoryId}
            onCategoryClick={handleCategoryClick}
            categoryCounts={categoryCounts}
            selectedCategoryIdsWithSelections={
              filters.selectedCategoryIdsWithSelections
            }
            filters={filters}
            maxCategoriesWithSelections={MAX_CATEGORIES_WITH_SELECTIONS}
            isAllServicesSelected={isAllServicesSelected}
          />
        )}

        {/* Danh mục Dịch vụ */}
        <ServiceCategorySection
          serviceCategoriesAvailable={serviceCategoriesAvailable}
          selectedServiceCategoryIds={
            selectedServiceCategoryIdsForActiveCategory
          }
          selectedCategoryId={filters.selectedCategoryId}
          onServiceCategoryToggle={handleServiceCategoryToggle}
          onSelectAllServiceCategories={onSelectAllServiceCategories}
          clearAllServiceCategories={clearAllServiceCategories}
          serviceCategoryCounts={serviceCategoryCounts}
          showValidationWarning={!isAnyServiceCategorySelected}
          isMobile={isMobile}
        />

        {/* Dịch vụ */}
        <ServiceDetailSection
          servicesGroupedByServiceCategory={servicesGroupedByServiceCategory}
          selectedServiceCategoryIds={
            selectedServiceCategoryIdsForActiveCategory
          }
          toggleService={toggleService}
          onSelectAllServices={onSelectAllServicesEachServiceCategory}
          onSelectAllServicesInAllCategories={
            onSelectAllServicesInAllCategories
          }
          clearAllServices={clearAllServices}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
};
