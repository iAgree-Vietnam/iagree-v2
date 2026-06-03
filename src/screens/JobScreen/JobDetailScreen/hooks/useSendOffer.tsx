import { FullJobResource, SendOfferParams } from "@/src/data/job/models/job.types";
import JobServices from "@/src/data/job/services/JobServices";
import dialogUtils from "@/src/utils/DialogUtils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";

export default function useSendOffer(jobId: number, roomId: string) {
    const queryClient = useQueryClient();
    const jobQueryKey = ['JOB_SEND_OFFER', jobId];

    return useMutation({
        mutationKey: ['JOB_SEND_OFFER', jobId],
        mutationFn: (variables: SendOfferParams) => new JobServices().onSendOffer(jobId, variables),
        onSuccess: () => {
            message.success('Gửi đề xuất thành công!').then(() => null);

            queryClient.invalidateQueries({ queryKey: jobQueryKey });
            queryClient.invalidateQueries({ queryKey: ["FETCH_ROOM_INFO", roomId] })
        },
        onError: (error) => dialogUtils.showResponseError(error, 'JOB_SEND_OFFER'),
    });
}