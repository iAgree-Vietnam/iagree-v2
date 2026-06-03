import BackendServices from '@/src/data/base/services/BackendServices';
import fetchUtil from '@/src/utils/BackendAPIUtils';
import EndpointConfig from '@/src/constants/EndpointConfig';
import { PricingParseUtils } from '@/src/data/pricing/utils/PricingParseUtil';
import { CitizenIdStatus } from '../models/pricing.types';

export default class BackendPricingServices extends BackendServices {
  get() {
    return new Promise((resolve, reject) => {
      fetchUtil(this.context, EndpointConfig.PRICING, {})
        .then((apiRes) => resolve(PricingParseUtils.init(apiRes)))
        .catch(reject);
    });
  }

  checkCitizenIdStatus() {
    return new Promise<CitizenIdStatus>((resolve, reject) => {
      fetchUtil(this.context, EndpointConfig.CHECK_CITIZEN_ID_STATUS, {})
        .then((apiRes) => resolve(PricingParseUtils.citizenIdStatusItem(apiRes)))
        .catch(reject);
    });
  }

}
