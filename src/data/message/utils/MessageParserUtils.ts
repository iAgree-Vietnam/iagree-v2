import datetimeUtils from "@/src/utils/DatetimeUtils";
import {
  RawChatRoom,
  RawChatRoomInfo,
  RawInfoDetailResource,
  RawListRoomChatOfUser,
  RawMessageItemsResource,
  RawSenderInfo,
  RawUserProjectBidsResource,
} from "../models/message.raw";
import {
  ChatRoom,
  ChatRoomInfoResource,
  ListRoomChatOfUser,
  MessageItemsResource,
  RoomInfoDetailResource,
  SenderInfo,
  UserProjectBidsResource,
} from "../models/message.types";
import { AuthParseUtils } from "../../auth/utils/AuthParseUtils";
import { JobParseUtils } from "../../job/utils/JobParseUtils";
import { LocationParserUtils } from "../../location/utils/LocationParserUtils";
import { isEmpty } from "lodash";

export const MessageParserUtils = {
  listRoomChatOfUser(dataItem: RawListRoomChatOfUser): ListRoomChatOfUser {    
    return {
      ...dataItem,
      ...(!isEmpty(dataItem?.items) ? { items: dataItem.items } : {}),
      ...(dataItem?.id ? { id: dataItem.id } : {}),
      ...(dataItem?.latestMessage ? { latestMessage: dataItem.latestMessage } : {}),

      ...(dataItem?.isRead ? { isRead: dataItem.isRead } : {}),

      ...(dataItem?.chat_room_id ? { chatRoomId: dataItem.chat_room_id } : {}),
      ...(dataItem?.user_id ? { userId: dataItem.user_id } : {}),
      ...(dataItem?.status ? { status: dataItem.status } : {}),
      ...(dataItem?.created_at ? { createdAt: dataItem.created_at } : {}),
      ...(dataItem?.updated_at ? { updatedAt: dataItem.updated_at } : {}),
      ...(dataItem?.deleted_at ? { deletedAt: dataItem.deleted_at } : {}),
      ...(dataItem?.user
        ? { user: AuthParseUtils.profile(dataItem.user) }
        : {}),
      ...(dataItem?.chat_room
        ? { chatRoom: MessageParserUtils.chatRoomItem(dataItem.chat_room) }
        : {}),
      ...(dataItem?.infoDetail ? { infoDetail: dataItem.infoDetail } : {}),
    } as any;
  },

  chatRoomItem(dataItem: RawChatRoom): ChatRoom {
    return {
      chatRoomId: dataItem?.id,
      refId: dataItem?.ref_id,
      type: dataItem?.type,
      name: dataItem?.name,
      status: dataItem?.status,
      createdAt: dataItem?.created_at,
      updatedAt: dataItem?.updated_at,
      deletedAt: dataItem?.deleted_at,
      project: JobParseUtils.item(dataItem?.project),
      message: dataItem?.message
        ? MessageParserUtils.parseMessageItem(dataItem?.message)
        : null,
    };
  },

  listMessages(dataItem: ChatRoomInfoResource): ChatRoomInfoResource {
    return {
      ...dataItem,
      roomId: dataItem?.roomId,
      status: dataItem?.status,
      infoDetail: MessageParserUtils.parseInfoDetail(
        dataItem?.infoDetail as RawInfoDetailResource
      ),
      items:
        dataItem?.items.map(MessageParserUtils.parseMessageItem as any) || [],
      total: dataItem?.total,
      total_page: dataItem.total_page,
      current_page: dataItem.current_page,
      per_page: dataItem.per_page,
      next_page: dataItem.next_page,
      prev_page: dataItem.prev_page,
    };
  },

  parseInfoDetail(dataItem: RawInfoDetailResource): RoomInfoDetailResource {
    return {
      partnerId: dataItem?.partnerId,
      partnerName: dataItem?.partnerName,
      partnerAvatar: dataItem?.partnerAvatar,
      location: dataItem.location?.map(LocationParserUtils.item),
      position: dataItem?.position,
      rate: dataItem?.rate,
      price: dataItem?.price,
      partnerDes: dataItem?.partnerDes,
      clientId: dataItem?.clientId,
      clientName: dataItem?.clientName,
      clientAvatar: dataItem?.clientAvatar,
      projectId: dataItem?.projectId,
      projectName: dataItem?.projectName,
      projectDes: dataItem?.projectDes,
      projectStatus: dataItem.projectStatus,
      userProjectBids: dataItem.userProjectBids
        ? MessageParserUtils.userProjectBids(dataItem.userProjectBids)
        : null,
    } as any;
  },

  userProjectBids(
    dataItem: RawUserProjectBidsResource
  ): UserProjectBidsResource {
    return {
      bidId: dataItem?.id,
      projectId: dataItem?.project_id,
      userId: dataItem?.user_id,
      applicationLetter: dataItem?.application_letter || "",
      description: dataItem?.description,
      applicationFile: dataItem?.application_file,
      note: dataItem?.note,
      negotiatePrice: dataItem?.negotiate_price,
      numberAccept: dataItem?.number_accept,
      startDate: dataItem?.start_date,
      endDate: dataItem?.end_date,
      bidType: dataItem?.bid_type,
      status: dataItem?.status,
      user: {
        userId: dataItem?.user.id,
        userName: dataItem?.user.name,
      },
      userProjectDeals:
        dataItem?.user_project_deals.map(JobParseUtils.dealHistoryItem) || [],
    };
  },

  parseMessageItem(dataItem: RawMessageItemsResource): MessageItemsResource {
    return {
      id: dataItem?.id,
      chatRoomId: dataItem?.chat_room_id,
      replyId: dataItem?.reply_id,
      senderId: dataItem?.sender_id,
      content: dataItem?.content,
      status: dataItem?.status,
      sendingAt: dataItem?.sending_at,
      readAt: dataItem?.read_at,
      createdAt: dataItem?.created_at
        ? datetimeUtils
            .getMoment(dataItem?.created_at)
            ?.format(datetimeUtils.LOCAL_DATE_TIME) || ""
        : "",
      updatedAt: dataItem?.updated_at
        ? datetimeUtils
            .getMoment(dataItem?.updated_at)
            ?.format(datetimeUtils.LOCAL_DATE_TIME) || ""
        : "",
      deletedAt: dataItem?.deleted_at,
      replyMessage: dataItem?.reply_message || null,
      sender: MessageParserUtils.parseSenderInfo(dataItem?.sender),
      attachments: dataItem?.attachments,
    };
  },

  parseSenderInfo(dataItem: RawSenderInfo): SenderInfo {
    return {
      id: dataItem?.id,
      name: dataItem?.name,
      avatar: dataItem?.avatar,
      isOnline: dataItem?.is_online,
    };
  },
};
