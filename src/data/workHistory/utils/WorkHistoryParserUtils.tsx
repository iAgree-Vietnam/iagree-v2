import { RawWorkHistoryResource } from '../models/workHistory.raw';
import { WorkHistoryResource } from '../models/workHistory.types';

export const WorkHistoryParserUtils = {
  item(dataItem: RawWorkHistoryResource): WorkHistoryResource {
    return {
      workHistoryId: dataItem.id,
      name: dataItem.name,
      description: dataItem.description,
      end_date: dataItem.end_date,
      position: dataItem.position,
      order: dataItem.order,
      start_date: dataItem.start_date,
    };
  },
};
