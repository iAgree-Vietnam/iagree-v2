import BackendServices from "../../base/services/BackendServices";
import fetchUtil from "../../../utils/BackendAPIUtils";
import EndpointConfig from "../../../constants/EndpointConfig";
import { JobParseUtils } from "../utils/JobParseUtils";
import { JobInitResource } from "../models/job.types";
import URLUtils from "../../../utils/URLUtils";

export default class BackendJobServices extends BackendServices {
  get(queryParams: any): Promise<JobInitResource> {
    return new Promise((resolve, reject) => {
      fetchUtil(this.context, EndpointConfig.JOB_INIT, {})
        .then((apiRes) => resolve(JobParseUtils.init(apiRes)))
        .catch(reject);
    });
  }

  getFullInfo(jobId: number) {
    return new Promise((resolve, reject) => {
      const endpointUrl = URLUtils.bindUrl(EndpointConfig.JOB_DETAIL, {
        ":jobId": jobId,
      });

      fetchUtil(this.context, endpointUrl, {})
        .then((apiRes) => resolve(JobParseUtils.detailInit(apiRes)))
        .catch(reject);
    });
  }

  getFullInfoV2(jobId: number) {
    return new Promise((resolve, reject) => {
      const endpointUrl = URLUtils.bindUrl(EndpointConfig.JOB_DETAIL, {
        ":jobId": jobId,
      });

      fetchUtil(this.context, endpointUrl, {})
        .then((apiRes) => {
          

          resolve(JobParseUtils.detailInit(apiRes))})
        .catch(reject);
    });
  }
}
