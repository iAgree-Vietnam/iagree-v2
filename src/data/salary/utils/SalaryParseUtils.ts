import { RawSalaryResource } from '../models/salary.raw';
import { SalaryResource } from '../models/salary.types';

export const SalaryParseUtils = {

    item(rawItem: RawSalaryResource): SalaryResource {
        return {
            salaryId: rawItem.id,
            name: rawItem.name,
        };
    },

};
