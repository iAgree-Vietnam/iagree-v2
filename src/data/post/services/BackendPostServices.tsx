import BackendServices from '../../base/services/BackendServices';
import fetchUtil from '../../../utils/BackendAPIUtils';
import EndpointConfig from '../../../constants/EndpointConfig';
import { PostParseUtils } from '../utils/PostParseUtils';
import URLUtils from '../../../utils/URLUtils';

export default class BackendPostServices extends BackendServices {

    get(queryParams: any) {
        return new Promise((resolve, reject) => {
            queryParams = {
                ...queryParams,
                per_page: 12,
            };

            const endpointUrl = [
                EndpointConfig.POST_INIT,
                new URLSearchParams(queryParams),
            ].join('?');

            fetchUtil(this.context, endpointUrl, {})
                .then((apiRes) => resolve(PostParseUtils.init(apiRes)))
                .catch(reject);
        });
    }

    getFullInfo(postId: number) {
        return new Promise((resolve, reject) => {
            const endpointUrl = URLUtils.bindUrl(EndpointConfig.POST_FULL_INFO, {':postId': postId});
            
            fetchUtil(this.context, endpointUrl, {})
                .then((apiRes) => resolve(PostParseUtils.details(apiRes)))
                .catch(reject);
        });
    }

}
