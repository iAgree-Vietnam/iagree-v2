import { UploadFilesParam } from "@/src/data/typical-projects/models/typicalProjects.raw";
import TypicalProjectsServices from "@/src/data/typical-projects/services/TypicalProjectsServices";
import { TypicalProjectsParserUtils } from "@/src/data/typical-projects/utils/TypicalProjectsParserUtils";
import dialogUtils from "@/src/utils/DialogUtils";
import { useMutation } from "@tanstack/react-query";
import { message } from "antd";

export function useUploadFilesOfTypicalProjects() {
    return useMutation({
        mutationKey: ['UPLOAD_FILES_OF_TYPICAL_PROJECTS'],
        mutationFn: (variables: UploadFilesParam) => new TypicalProjectsServices().onUploadFilesOfTypicalProjects(variables),
        onSuccess: (data) => {
            message.success('Tải lên tệp liên quan thành công.').then(() => null);
            // const parsedData = TypicalProjectsParserUtils.item(data);
            // const filesData = parsedData.files;
            // // return data;
            // return filesData;
        },
        onError: (error) => dialogUtils.showResponseError(error, 'UPLOAD_FILES_OF_TYPICAL_PROJECTS'),
    });
}