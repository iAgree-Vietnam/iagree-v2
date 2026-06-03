import EndpointConfig from "../../../constants/EndpointConfig";
import { IntroduceParseUtils } from "../utils/IntroduceParseUtils";
import { IntroduceResource } from "../models/introduce.types";
import apiUtils from "@/src/utils/APIUtils";

export default class IntroduceServices {
  introduce(): Promise<IntroduceResource> {
    return new Promise((resolve, reject) => {
      apiUtils
        .get(EndpointConfig.INTRODUCE)
        .then((apiRes) => resolve(IntroduceParseUtils.init(apiRes.data)))
        .catch(reject);
    });
  }
}
