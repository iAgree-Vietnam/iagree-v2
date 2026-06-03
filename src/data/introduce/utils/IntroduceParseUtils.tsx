import { PartnerParserUtils } from "../../partner/utils/PartnerParserUtils";
import { IntroduceResource } from "../models/introduce.types";
import { RawIntroduceResponse } from "../models/introduce.raw";
import { CategoryParseUtils } from "../../category/utils/CategoryParseUtils";

export const IntroduceParseUtils = {
  init(dataItem: RawIntroduceResponse): IntroduceResource {
    return {
      categories: dataItem?.categories?.map(CategoryParseUtils.item),
      partnersTop: dataItem?.partnersTop?.map(PartnerParserUtils.itemIntroduce),
    };
  },
};
