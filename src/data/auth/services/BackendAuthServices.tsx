import _ from "lodash";

import BackendServices from "@/src/data/base/services/BackendServices";
import {
  FullProfileResource,
  VerifyEmailParams,
} from "@/src/data/auth/models/types";
import EndpointConfig from "@/src/constants/EndpointConfig";
import fetchUtil from "@/src/utils/BackendAPIUtils";
import { AuthParseUtils } from "@/src/data/auth/utils/AuthParseUtils";
import Constants from "@/src/constants/Constants";

export default class BackendAuthServices extends BackendServices {
  // getFullInfo(): Promise<FullProfileResource | null> {
  //     return new Promise((resolve, reject) => {
  //         // fetchUtil(this.context, EndpointConfig.AUTH_FULL_INFO, {})
  //         fetchUtil(this.context, EndpointConfig.AUTH_FULL_INFO_V2, {})
  //             .then((apiRes) => resolve(apiRes ? AuthParseUtils.profile(apiRes) : null))
  //             .catch(reject);
  //     });
  // }
  getFullInfo(): Promise<Partial<FullProfileResource> | null> {
    return fetchUtil(this.context, EndpointConfig.AUTH_FULL_INFO_V2, {}).then(
      (apiRes) => {

        return apiRes ? AuthParseUtils.profile(apiRes) : null;
      }
    );
  }

  verifyEmail(params: VerifyEmailParams) {
    return new Promise((resolve, reject) => {
      const endpointUrl = [
        _.trimEnd(process.env.API_BASE_URL, "/"),
        _.trimStart(EndpointConfig.AUTH_VERIFY_EMAIL, "/"),
      ].join("/");
      fetch(endpointUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      })
        .then((response) => {
          return new Promise((resolve) =>
            response.json().then((json) =>
              resolve({
                status: response.status,
                ok: response.ok,
                json,
              })
            )
          );
        })
        .then((data: any) => {
          if (data.ok) resolve(data.json);
          else reject(data.json);
        })
        .catch(reject);
    });
  }
}
