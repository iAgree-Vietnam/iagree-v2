import { AboutUsResource } from '../models/aboutus.types';
import { RawAboutUsResource } from '../models/aboutus.raw';

export const AboutUsParseUtils = {
    data(dataItem: RawAboutUsResource): Partial<AboutUsResource> {
        return {
            aboutUsId: dataItem?.id,

            key: dataItem?.key,
            name: dataItem?.name,
            description: dataItem?.value,
            status: dataItem?.status,
            createdDate: dataItem?.created_at,
            updatedDate: dataItem?.updated_at,
        };
    },
};
