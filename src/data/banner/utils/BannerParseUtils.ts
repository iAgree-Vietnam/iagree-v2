import { RawBannerItem } from '../models/banner.raw';
import { BannerResource } from '../models/banner.types';
import datetimeUtils from '../../../utils/DatetimeUtils';

export const BannerParseUtils = {

    item(rawItem: RawBannerItem): BannerResource {
        return {
            bannerId: rawItem.id,
            type: rawItem.type,
            name: rawItem.name,
            description: rawItem.description,
            photoUrl: rawItem.photo,
            status: rawItem.status,
            createdDate: rawItem.created_at,
            updatedDate: rawItem.updated_at,
        };
    },

};
