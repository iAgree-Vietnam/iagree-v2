import TypicalProjectsServices from "@/src/data/typical-projects/services/TypicalProjectsServices";
import dialogUtils from "@/src/utils/DialogUtils";
import { useMutation } from "@tanstack/react-query";
import { message } from "antd";

export function useDeleteImageOfTypicalProjects(projectId: number) {
    return useMutation({
        mutationKey: ['DELETE_IMAGE_OF_TYPICAL_PROJECTS'],
        mutationFn: () => new TypicalProjectsServices().onDeleteImageOfTypicalProjects(projectId),
        onSuccess: (data) => {
            message.success('Xóa ảnh bìa thành công.').then(() => null);
            return data;
        },
        onError: (error) => dialogUtils.showResponseError(error, 'DELETE_IMAGE_OF_TYPICAL_PROJECTS'),
    });
}