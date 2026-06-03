import { DeleteFileParam } from "@/src/data/typical-projects/models/typicalProjects.raw";
import TypicalProjectsServices from "@/src/data/typical-projects/services/TypicalProjectsServices";
import dialogUtils from "@/src/utils/DialogUtils";
import { useMutation } from "@tanstack/react-query";
import { message } from "antd";

export function useDeleteFilesOfTypicalProjects() {
    return useMutation({
        mutationKey: ['DELETE_FILES_OF_TYPICAL_PROJECTS'],
        mutationFn: (variables: DeleteFileParam) => new TypicalProjectsServices().onDeleteFileOfTypicalProjects(variables),
        onSuccess: (data) => {
            message.success('Xóa tệp thành công.').then(() => null);
            return data;
        },
        onError: (error) => dialogUtils.showResponseError(error, 'DELETE_FILES_OF_TYPICAL_PROJECTS'),
    })
}