import { HomeInitResource } from "../models/home.types";
import { RawHomeResponse } from "../models/home.raw";
import { BannerParseUtils } from "../../banner/utils/BannerParseUtils";
import { TemplateParseUtils } from "../../template/utils/TemplateParseUtils";
import { JobParseUtils } from "../../job/utils/JobParseUtils";
import { PostParseUtils } from "../../post/utils/PostParseUtils";
import { AboutUsParseUtils } from "../../aboutus/utils/AboutUsParseUtils";
import { SearchParserUtils } from "../../search/utils/SearchParserUtils";
import { CategoryParseUtils } from "../../category/utils/CategoryParseUtils";
import { LocationParserUtils } from "../../location/utils/LocationParserUtils";
import { SettingParserUtils } from "../../setting/utils/SettingParserUtils";
import { PartnerParserUtils } from "../../partner/utils/PartnerParserUtils";
import { map } from "lodash";
import { JobParseUtilsV2 } from "../../job/utils/JobParseUtilsV2";

export const HomeParseUtilsV2 = {
  init(dataItem: RawHomeResponse): Partial<HomeInitResource> {

    return {
      templates: {
        items: dataItem?.templates?.items?.map(TemplateParseUtils.item),
        total: dataItem?.templates?.total,
      },
      jobs: {
        items: dataItem?.jobs?.items?.map(JobParseUtilsV2.item),
        total: dataItem?.jobs?.total,
      },
      popularSearchs: {
        items: dataItem?.popularSearch?.items?.map(SearchParserUtils.item),
        total: dataItem?.popularSearch?.total,
      },
      templateCategories: {
        items: dataItem?.categoryTemplate?.items?.map(CategoryParseUtils.item),
        total: dataItem?.categoryTemplate?.total,
      },
      // jobCategories: {
      //     items: dataItem.categoryProjectService?.items?.map(CategoryParseUtils.item),
      //     total: dataItem.categoryProjectService?.total,
      // },
      jobCategories: map(dataItem?.categories, CategoryParseUtils.item),
      partners: map(dataItem?.partnersTop, PartnerParserUtils.item),
      // setting: SettingParserUtils.data(dataItem?.setting),
    };
  },
};
