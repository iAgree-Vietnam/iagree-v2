import MessageServices from "@/src/data/message/services/MessageServices";
import { MessageParserUtils } from "@/src/data/message/utils/MessageParserUtils";
import dialogUtils from "@/src/utils/DialogUtils";
import { useMutation, useQuery } from "@tanstack/react-query";

export type ParamsCommonType = {
  per_page?: number;
  page: number;
};

export function useFetchRoomInfo(
  roomId: string,
  params: ParamsCommonType,
) {
  // return useMutation({
  //     mutationKey: ['FETCH_ROOM_INFO'],
  //     mutationFn: async (roomId: string) => {
  //         const data = await new MessageServices().getRoomChatInfo(roomId);
  //         return MessageParserUtils.listMessages(data);
  //     },
  //     onError: (error) => dialogUtils.showResponseError(error, 'FETCH_ROOM_INFO'),
  // });

  return useQuery({
    queryKey: ["FETCH_ROOM_INFO", roomId, params.page],
    queryFn: async () => {
      const data = await new MessageServices().getRoomChatInfo(roomId, params);
      const parsedData = MessageParserUtils.listMessages(data);
      return parsedData;
    },
    enabled: !!roomId && roomId.trim() !== "",
    refetchOnWindowFocus: false,
    onError: (error) => dialogUtils.showResponseError(error, "FETCH_ROOM_INFO"),
  });
}
