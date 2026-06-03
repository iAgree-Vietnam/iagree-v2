import { SettingParserUtils } from "../../setting/utils/SettingParserUtils";
import { PartnerParserUtils } from "../../partner/utils/PartnerParserUtils";
import { map } from "lodash";
import { JobParseUtilsV2 } from "../../job/utils/JobParseUtilsV2";
import { RawHomeResponse } from "../../home/models/home.raw";
import { HomeInitResource } from "../../home/models/home.types";

export const SettingParseUtilsV2 = {
  init(dataItem: RawHomeResponse): Partial<HomeInitResource> {

    return {
      setting: SettingParserUtils.data(dataItem?.setting),
    };
  },
};
