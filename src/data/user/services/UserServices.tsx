import apiUtils from '@/src/utils/APIUtils';
import EndpointConfig from '@/src/constants/EndpointConfig';
import { DatasResource } from '@/src/data/base/models/base.types';
import { FullProfileResource } from '@/src/data/auth/models/types';
import { UserParserUtils } from '../utils/UserParserUtils';

export default class UserServices {
    get(queryParams: any): Promise<DatasResource<FullProfileResource>> {
        return new Promise((resolve, reject) => {
            apiUtils
                .get(EndpointConfig.USER_LIST, { params: queryParams })
                .then((apiRes) =>
                    resolve(
                        UserParserUtils.list({
                            items: apiRes.data.data,
                            total: apiRes.data.total,
                        })
                    )
                )

                .catch(reject);
        });
    }
}
