import { RawFileResource, RawTypicalProjectsResource } from "../models/typicalProjects.raw";
import { FileResource, TypicalProjectsResource } from "../models/typicalProjects.types";

export const TypicalProjectsParserUtils = {
    item(dataItem: RawTypicalProjectsResource): TypicalProjectsResource {
        return {
            id: dataItem.id,
            partnerId: dataItem.partner_id,
            name: dataItem.name,
            image: dataItem.image,
            start_date: dataItem.start_date,
            end_date: dataItem.end_date,
            description: dataItem.description,
            achievements: dataItem.achievements,
            role: dataItem.role,
            status: dataItem.status,
            createdAt: dataItem.created_at,
            updatedAt: dataItem.updated_at,
            files: dataItem.files?.map((file) => TypicalProjectsParserUtils.fileItem(file)),
        }
    },

    fileItem(dataItem: RawFileResource): FileResource {
        return {
            id: dataItem.id,
            refId: dataItem.ref_id,
            type: dataItem.type,
            fileName: dataItem.file_name,
            filePath: dataItem.file_path,
            status: dataItem.status,
            createAt: dataItem.created_at,
            updatedAt: dataItem.updated_at,
        }
    }
}