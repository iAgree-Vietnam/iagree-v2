import BackendServices from '../../base/services/BackendServices';
import fetchUtil from '../../../utils/BackendAPIUtils';
import EndpointConfig from '../../../constants/EndpointConfig';
import URLUtils from '../../../utils/URLUtils';
import { PartnerParserUtils } from '../utils/PartnerParserUtils';
import { PartnerDetailResource, PartnerInitResource } from '../models/partner.types';

export default class BackendPartnerServices extends BackendServices {

    get(queryParams: any): Promise<Partial<PartnerInitResource>> {
        return new Promise((resolve, reject) => {
            queryParams = {
                ...queryParams,
                per_page: 15,
            };

            const endpointUrl = [
                // EndpointConfig.PARTNER_INIT,
                EndpointConfig.PARTNER_LIST_V3,
                new URLSearchParams(queryParams),
            ].join('?');

            fetchUtil(this.context, endpointUrl, {})
                .then((apiRes) => {
                    
                    // resolve(PartnerParserUtils.init({...apiRes,partners: apiRes?.items}))})
                    resolve({
                        partners: apiRes?.items
                    })})
                .catch(reject);
        });
    }

    getFullInfo(partnerId: number): Promise<PartnerDetailResource> {
        return new Promise((resolve, reject) => {
            const endpointUrl = URLUtils.bindUrl(EndpointConfig.PARTNER_FULL_INFO_V2, { ':partnerId': partnerId });

            fetchUtil(this.context, endpointUrl, {})
                .then((apiRes) => resolve(PartnerParserUtils.detailInit(apiRes)))
                .catch(reject);
        });
    }

}
