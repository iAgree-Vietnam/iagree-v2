import { RawTagResource } from '../models/tag.raw';
import { TagResource } from '../models/tag.types';

export const TagParseUtils = {

    item(dataItem: RawTagResource): TagResource {
        return {
            tagId: dataItem.id,
            name: dataItem.name,
        };
    },

};
