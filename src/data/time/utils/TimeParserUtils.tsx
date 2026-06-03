import { TimeResource } from '../models/time.types';
import { RawTimeItem } from '../models/time.raw';

export const TimeParserUtils = {

    item(dataItem: RawTimeItem): TimeResource {
        return {
            timeId: dataItem.id,
            name: dataItem.name,
        };
    },

};
