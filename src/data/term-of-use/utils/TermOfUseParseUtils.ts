import { SettingParserUtils } from "../../setting/utils/SettingParserUtils";
import { RawTermOfUseResource } from "../models/term-of-use.raw";
import { TermOfUseResource } from "../models/term-of-use.types";

export const TermOfUseParseUtils = {
  data(dataItem: RawTermOfUseResource): TermOfUseResource | null {
    if (dataItem)
      return {
        termOfUseId: dataItem.id,
        key: dataItem.key,
        name: dataItem.name,
        description: SettingParserUtils.htmlBeautify(dataItem.value),
        status: dataItem.status,
        createdDate: dataItem.created_at,
        updatedDate: dataItem.updated_at,
      };
    else return null;
  },
};
