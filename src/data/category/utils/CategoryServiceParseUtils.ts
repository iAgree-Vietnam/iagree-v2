import { toNumber, toString } from 'lodash';
import { RawCateServiceResource } from '../models/category.raw';
import { CateServiceResource } from '../models/category.types';

export const CategoryServiceParseUtils = {

    item(dataItem: RawCateServiceResource): CateServiceResource {        
        return {
            cateServiceId: toNumber(dataItem.id),
            name: dataItem.name,
            photo: dataItem.photo || '',
            parentId: dataItem.parent_id || 0,
            id: "", serviceId: -1
        };
    },

};
