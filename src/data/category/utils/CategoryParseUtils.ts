import { toNumber } from "lodash";
import { RawCategoryResource } from "../models/category.raw";
import { CategoryResource } from "../models/category.types";

export const CategoryParseUtils = {
  item(dataItem: RawCategoryResource): CategoryResource {
    return {
      categoryId: toNumber(dataItem.id),
      name: dataItem.name,
      photo: dataItem.photo || "",
      cateServiceId: -1,
      id: "",
      serviceId: -1,
    };
  },
};
