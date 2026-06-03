import { ChatRoomInfoResource, MessageSendParam } from "@/src/data/message/models/message.types";
import MessageServices from "@/src/data/message/services/MessageServices";
import dialogUtils from "@/src/utils/DialogUtils";
import { useMutation } from "@tanstack/react-query";
import { message } from "antd";

export function useSendMessages(roomId: string) {
    return useMutation({
        mutationKey: ['MESSAGE_SEND', roomId],
        mutationFn: (variables: MessageSendParam) => new MessageServices().onSendMessages(roomId, variables),
        onSuccess: (data) => {
            // message.success('Gửi tin nhắn thành công.').then(() => null);
            return data;
        },
        onError: (error) => dialogUtils.showResponseError(error, 'MESSAGE_SEND'),
    });
}