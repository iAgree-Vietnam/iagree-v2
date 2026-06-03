import MessageServices from "@/src/data/message/services/MessageServices";
import { MessageParserUtils } from "@/src/data/message/utils/MessageParserUtils";
import dialogUtils from "@/src/utils/DialogUtils";
import { useMutation } from "@tanstack/react-query";

export function useCreateChatRooms() {
    return useMutation({
        mutationKey: ['CREATE_CHAT_ROOM'],
        mutationFn: async ({ receiverId, projectId }: { receiverId: number; projectId?: number }) => {
            const data = await new MessageServices().createRoomChat(receiverId, projectId!);
            return MessageParserUtils.listMessages(data);
        },
        onError: (error) => dialogUtils.showResponseError(error, 'CREATE_CHAT_ROOM'),
    });
}