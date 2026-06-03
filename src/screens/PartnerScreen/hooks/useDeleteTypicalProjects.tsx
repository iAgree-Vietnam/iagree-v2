import { DeleteTypicalProjectParam } from "@/src/data/typical-projects/models/typicalProjects.raw";
import TypicalProjectsServices from "@/src/data/typical-projects/services/TypicalProjectsServices";
import dialogUtils from "@/src/utils/DialogUtils";
import { useMutation } from "@tanstack/react-query";
import { message } from "antd";

export function useDeleteTypicalProjects() {
    return useMutation({
        mutationKey: ['DELETE_TYPICAL_PROJECT'],
        mutationFn: (variables: DeleteTypicalProjectParam) => new TypicalProjectsServices().onDeleteProjects(variables),
        onSuccess: (data) => {
            message.success('Đã xóa dự án thành công.').then(() => null);
            return data;
        },
        onError: (error) => dialogUtils.showResponseError(error, 'DELETE_TYPICAL_PROJECT'),
    })
}