import fetchUtil from "../../../utils/BackendAPIUtils";
import EndpointConfig from "../../../constants/EndpointConfig";
import { GetServerSidePropsContext } from "next/types";
import BackendServices from "../../base/services/BackendServices";
import { SettingParseUtilsV2 } from "../utils/SettingParseUtilsV2";

export default class SettingServices extends BackendServices {
  get(queryParams = {}) {
    return new Promise((resolve, reject) => {
      fetchUtil(this.context, EndpointConfig.SETTING_INIT, {})
        .then((apiRes) => {
          return resolve(SettingParseUtilsV2.init(apiRes));
        })
        .catch(reject);
    });
  }
}
