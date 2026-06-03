import BackendServices from '@/src/data/base/services/BackendServices';
import fetchUtil from '@/src/utils/BackendAPIUtils';
import EndpointConfig from '@/src/constants/EndpointConfig';
import { TermOfUseParseUtils } from '../utils/TermOfUseParseUtils';

export default class BackendTermOfUseServices extends BackendServices {
  get() {
    return new Promise((resolve, reject) => {
      fetchUtil(this.context, EndpointConfig.TERM_OF_USE, {})
        .then((apiRes) => resolve(TermOfUseParseUtils.data(apiRes[0])))
        .catch(reject);
    });
  }
}
