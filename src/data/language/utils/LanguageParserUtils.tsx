import { LanguageResource } from '../models/language.types';
import { RawLanguageResource } from '../models/language.raw';

export const LanguageParserUtils = {

    item(dataItem: RawLanguageResource): LanguageResource {
        return {
            languageId: dataItem.id,
            name: dataItem.name,
        };
    },

};
