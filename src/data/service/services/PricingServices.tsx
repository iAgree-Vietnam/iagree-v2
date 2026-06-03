import apiUtils from '@/src/utils/APIUtils';
import EndpointConfig from '@/src/constants/EndpointConfig';

export default class PricingServices {

    allUserSuspend(formData: any): Promise<any> {
        return new Promise((resolve, reject) => {
            apiUtils.post(EndpointConfig.ALL_USER_SUSPEND, formData)
                .then((apiRes) => resolve(apiRes.data))
                .catch(reject);
        });
    }

}
