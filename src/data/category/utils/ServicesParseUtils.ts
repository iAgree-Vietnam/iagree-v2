import { toNumber } from 'lodash';
import { RawServiceResource } from '../models/category.raw';
import { ServiceResource } from '../models/category.types';

export const ServiceParseUtils = {

    item(dataItem: RawServiceResource): ServiceResource {

        return {
            serviceId: toNumber(dataItem.id),
            name: dataItem.name,
            photo: dataItem.photo || '',
            parentId: dataItem.parent_id || 0,
        };
    },

};
