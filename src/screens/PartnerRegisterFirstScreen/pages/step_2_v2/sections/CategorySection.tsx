
import React from "react";
import {
  renderClickableTags,
  renderSectionTitle,
  SECTION_DOT_COLORS,
} from "../../../utils/RenderUtils";
import { CategoryResource } from "@/src/data/category/models/category.types";
import { Step2V2ScreenFilterState } from "../Step2_V2_Page";

interface CategorySectionProps {
  categories: CategoryResource[] | undefined;
  selectedCategoryId: number | null;
  onCategoryClick: (id: number) => void;
  categoryCounts: { [key: number]: number };
  selectedCategoryIdsWithSelections: number[];
  maxCategoriesWithSelections: number;
  isAllServicesSelected: boolean;
  filters: Step2V2ScreenFilterState;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  categories,
  selectedCategoryId,
  onCategoryClick,
  categoryCounts,
  selectedCategoryIdsWithSelections,
  maxCategoriesWithSelections,
  isAllServicesSelected,
  filters
}) => {
  const disabledCategoryIds = React.useMemo(() => {
    if (
      selectedCategoryIdsWithSelections.length >= maxCategoriesWithSelections
    ) {
      return ( 
        categories
          ?.map((cat) => cat.categoryId)
          .filter(
            (id) =>
              id !== selectedCategoryId &&
              !selectedCategoryIdsWithSelections.includes(id)
          ) || []
      );
    }
    return [];
  }, [
    categories,
    selectedCategoryId,
    selectedCategoryId,
    maxCategoriesWithSelections,
  ]);

  return (
    <div
      style={{
        flex: 1,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        marginBottom: "8px",
      }}
    >
      <div
        style={{
          marginBottom: "5px",
        }}
      >
        {renderSectionTitle("Lĩnh vực ", "(Tối đa 3 Lĩnh vực)")}
      </div>
      {renderClickableTags({
        data: categories || [],
        idKey: "categoryId",
        selectedId: selectedCategoryId,
        onClick: onCategoryClick,
        emptyText: "Không có Lĩnh vực",
        hoverColor: SECTION_DOT_COLORS.category,
        itemCounts: categoryCounts,
        disabledIds: disabledCategoryIds,
        isAllServicesSelected: isAllServicesSelected,
        filters,
      })}
    </div>
  );
};
