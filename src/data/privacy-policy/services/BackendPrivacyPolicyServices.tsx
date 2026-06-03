import BackendServices from '@/src/data/base/services/BackendServices';
import fetchUtil from '@/src/utils/BackendAPIUtils';
import EndpointConfig from '@/src/constants/EndpointConfig';
import { PrivacyPolicyParseUtils } from '../utils/PrivacyPolicyParseUtils';

export default class BackendPrivacyPolicyServices extends BackendServices {
  get() {
    return new Promise((resolve, reject) => {
      fetchUtil(this.context, EndpointConfig.PRIVACY_POLICY, {})
        .then((apiRes) => resolve(PrivacyPolicyParseUtils.data(apiRes[0])))
        .catch(reject);
    });
  }
}
