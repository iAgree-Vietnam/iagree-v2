import { RawListRoomChatOfUser } from "@/src/data/message/models/message.raw";
import MessageServices from "@/src/data/message/services/MessageServices";
import { MessageParserUtils } from "@/src/data/message/utils/MessageParserUtils";
import dialogUtils from "@/src/utils/DialogUtils";
import { useQuery } from "@tanstack/react-query";

export default function useFetchRoomChatOfUser(userId: number, keyState?: number) {
  return useQuery({
    queryKey: ["FETCH_ROOM_CHAT_OF_USER", userId, keyState],
    queryFn: async () => {
      if (!userId || userId === 0) {
        // Return an empty array or throw an error if userId is invalid
        return [];
      }
      const data = await new MessageServices().getAllChatRooms(userId);
      const amount = data?.unreadChatRoomIds;
      const parsedData = data?.chatRooms.map((item: RawListRoomChatOfUser) =>
        MessageParserUtils.listRoomChatOfUser(item)
      );

      return { parsedData, amount };
    },
    enabled: !!userId, // Only run the query if userId is truthy
    onError: (error) =>
      dialogUtils.showResponseError(error, "FETCH_ROOM_CHAT_OF_USER"),
  });
}
