import { SearchResource } from '../models/search.types';
import { RawSearchResource } from '../models/search.raw';

export const SearchParserUtils = {

    item(dataItem: RawSearchResource): SearchResource {
        return {
            searchId: dataItem.id,
            name: dataItem.name,
        };
    },

};
