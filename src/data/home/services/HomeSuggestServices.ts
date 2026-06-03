import apiUtils from "@/src/utils/APIUtils";
import EndpointConfig from "@/src/constants/EndpointConfig";
import {
  HomeInitResource,
  HomeSuggestParams,
  HomeSuggestResponse,
} from "../models/home.types";
import { HomeParseUtilsV2 } from "../utils/HomeParseUtilsV2";

export default class HomeSuggestServices {
  search(queryParams: HomeSuggestParams): Promise<HomeSuggestResponse> {
    return new Promise((resolve, reject) => {
      apiUtils
        .get(EndpointConfig.HOME_SUGGESTIONS, { params: queryParams })
        .then((apiRes) => resolve(apiRes.data))
        .catch(reject);
    });
  }

  init(): Promise<Partial<HomeInitResource>> {
    return new Promise((resolve, reject) => {
      apiUtils
        // .get(EndpointConfig.HOME_INIT)
        .get(EndpointConfig.HOME_INIT_V2)
        .then((apiRes) => {
          // resolve(HomeParseUtils.init(apiRes.data));
          resolve(HomeParseUtilsV2.init(apiRes.data));
        })
        .catch(reject);
    });
  }
}
