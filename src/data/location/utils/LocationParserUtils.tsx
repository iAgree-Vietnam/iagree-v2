import { RawLocationResource } from '../models/location.raw';
import { LocationResource } from '../models/location.types';

export const LocationParserUtils = {

    item(dataItem: RawLocationResource): LocationResource {
        return {
            locationId: dataItem?.id,
            name: dataItem?.name,
            id: dataItem?.id,
        };
    },

};
