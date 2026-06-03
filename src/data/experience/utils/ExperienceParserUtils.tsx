import { RawExperienceResource } from '../models/experience.raw';
import { ExperienceResource } from '../models/experience.types';

export const ExperienceParserUtils = {

    item(dataItem: RawExperienceResource): ExperienceResource {
        return {
            experienceId: dataItem.id,
            name: dataItem.name,
        };
    },

};
