import { SkillResource } from '../models/skill.types';
import { RawSkillResource } from '../models/skill.raw';

export const SkillParserUtils = {

    item(dataItem: RawSkillResource): SkillResource {
        return {
            skillId: dataItem.id,
            name: dataItem.name,
            categoryProjectId: dataItem.category_project_id,
        };
    },

};
