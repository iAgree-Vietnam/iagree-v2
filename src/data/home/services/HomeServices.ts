import fetchUtil from "../../../utils/BackendAPIUtils";
import EndpointConfig from "../../../constants/EndpointConfig";
import { GetServerSidePropsContext } from "next/types";
import BackendServices from "../../base/services/BackendServices";
import { HomeParseUtilsV2 } from "../utils/HomeParseUtilsV2";

export default class HomeServices extends BackendServices {
  get(queryParams = {}) {
    return new Promise((resolve, reject) => {
      fetchUtil(this.context, EndpointConfig.HOME_INIT_V2, {})
        .then((apiRes) => {
          
          
          return resolve(HomeParseUtilsV2.init(apiRes))})
        .catch(reject);
    });
  }
}
