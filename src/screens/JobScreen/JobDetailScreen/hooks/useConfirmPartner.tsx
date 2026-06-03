import { ConfirmPartnerParams } from "@/src/data/job/models/job.types";
import JobServices from "@/src/data/job/services/JobServices";
import dialogUtils from "@/src/utils/DialogUtils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";

export default function useConfirmPartner(jobId: number, roomId: string) {
    const queryClient = useQueryClient();
    const jobQueryKey = ['JOB_CONFIRM_PARTNER', jobId];

    return useMutation({
        mutationKey: ['JOB_CONFIRM_PARTNER', jobId],
        mutationFn: (variables: ConfirmPartnerParams) => new JobServices().onConfirmOffer(jobId, variables),
        onSuccess: () => {
            message.success('Xác nhận Đối Tác thành công!').then(() => null);

            queryClient.invalidateQueries({ queryKey: jobQueryKey });
            queryClient.invalidateQueries({ queryKey: ["FETCH_ROOM_INFO", roomId] })
        },
        onError: (error) => dialogUtils.showResponseError(error, 'JOB_CONFIRM_PARTNER'),
    });
}