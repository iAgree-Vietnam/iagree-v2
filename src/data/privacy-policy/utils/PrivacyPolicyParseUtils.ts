import { SettingParserUtils } from '../../setting/utils/SettingParserUtils';
import { RawPrivacyPolicyResource } from '../models/privacy-policy.raw';
import { PrivacyPolicyResource } from '../models/privacy-policy.types';

export const PrivacyPolicyParseUtils = {
    data(dataItem: RawPrivacyPolicyResource): PrivacyPolicyResource | null {
        if (dataItem)
            return {
                privacyPolicyId: dataItem.id,
                key: dataItem.key,
                name: dataItem.name,
                description: SettingParserUtils.htmlBeautify(dataItem.value),
                status: dataItem.status,
                createdDate: dataItem.created_at,
                updatedDate: dataItem.updated_at,
            };
        return null;
    },
};
