import MessageServices from "@/src/data/message/services/MessageServices";
import { MessageParserUtils } from "@/src/data/message/utils/MessageParserUtils";
import dialogUtils from "@/src/utils/DialogUtils";
import { useMutation } from "@tanstack/react-query";
import { ParamsCommonType } from "./useFetchRoomInfo";

export function useFetchMessages(roomId: string, params?: ParamsCommonType) {
    return useMutation({
        mutationKey: ['FETCH_MESSAGES', roomId],
        mutationFn: async () => {
            const data = await new MessageServices().getRoomChatInfo(roomId,params);
            
            return MessageParserUtils.listMessages(data);
        },
        onError: (error) => dialogUtils.showResponseError(error, 'FETCH_MESSAGES'),
    });
}