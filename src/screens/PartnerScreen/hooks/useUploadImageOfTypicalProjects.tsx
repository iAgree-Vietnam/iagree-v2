import { UploadImageParam } from "@/src/data/typical-projects/models/typicalProjects.raw";
import TypicalProjectsServices from "@/src/data/typical-projects/services/TypicalProjectsServices";
// import { TypicalProjectsParserUtils } from "@/src/data/typical-projects/utils/TypicalProjectsParserUtils";
import dialogUtils from "@/src/utils/DialogUtils";
import { useMutation } from "@tanstack/react-query";
import { message } from "antd";

export function useUploadImageOfTypicalProjects() {
    return useMutation({
        mutationKey: ['UPLOAD_IMAGE_OF_TYPICAL_PROJECTS'],
        mutationFn: (variables: UploadImageParam) => new TypicalProjectsServices().onUploadImageOfTypicalProjects(variables),
        onSuccess: (data) => {
            message.success('Cập nhật ảnh bìa thành công.').then(() => null);
            return data;
        },
        onError: (error) => dialogUtils.showResponseError(error, 'UPLOAD_IMAGE_OF_TYPICAL_PROJECTS'),
    });
}