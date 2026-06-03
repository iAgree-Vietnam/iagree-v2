import { RawEducationResource } from '../models/education.raw';
import { EducationResource } from '../models/education.types';

export const EducationParserUtils = {
  item(dataItem: RawEducationResource): EducationResource {
    return {
      educationId: dataItem.id,
      name: dataItem.name,
      degree: dataItem.degree,
      grade: dataItem.grade,
      description: dataItem.description,
      end_date: dataItem.end_date,
      majors: dataItem.majors,
      order: dataItem.order,
      start_date: dataItem.start_date,
    };
  },
};
