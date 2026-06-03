import { RcFile } from "antd/es/upload/interface";
import { FullProfileResource } from "../../auth/models/types";
import {
  JobResource,
  UserProjectDealResource,
} from "../../job/models/job.types";
import { LocationResource } from "../../location/models/location.types";
import { RawMessageItemsResource } from "./message.raw";

export interface ListRoomChatOfUser extends ChatRoomInfoResource {
  id: string;
  chatRoomId: string;
  userId: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  user: FullProfileResource;
  chatRoom: ChatRoom;
  latestMessage: RawMessageItemsResource;
  isRead?: boolean;
}

export interface ChatRoom {
  chatRoomId: string;
  refId: number;
  type: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  project: JobResource;
  message: MessageItemsResource | null;
}

export interface ChatRoomInfoResource {
  roomId: string;
  status: string;
  infoDetail: RoomInfoDetailResource;
  items: MessageItemsResource[] | [];
  total: number;
  total_page: number;
  current_page: number;
  per_page: number;
  next_page: number;
  prev_page: number;
  messages?: MessageItemsResource[];
  lastDate?: number;
}

export interface RoomInfoDetailResource {
  projectCreatedByUserId: any;
  partnerIsOnline: any;
  clientIsOnline: any;
  partnerId: number | undefined;
  partnerName: string | undefined;
  partnerAvatar: string | undefined;
  location: LocationResource[] | undefined;
  position: string | undefined;
  rate: number | undefined;
  price: number | undefined;
  partnerDes: string | undefined;
  clientId: number | undefined;
  clientName: string | undefined;
  clientAvatar: string | undefined;
  projectId: number;
  projectName: string;
  projectDes: string;
  projectStatus: number;
  userProjectBids: UserProjectBidsResource | null;
}

export interface UserProjectBidsResource {
  bidId: number;
  projectId: number;
  userId: number;
  applicationLetter: string | null;
  description: string | null;
  applicationFile: string | null;
  note: string | null;
  negotiatePrice: number;
  numberAccept: number;
  startDate: string;
  endDate: string;
  bidType: number;
  status: number;
  user: {
    userId: number;
    userName: string;
  };
  userProjectDeals: UserProjectDealResource[] | [];
}

export interface CreateChatRoomParam {
  receiverId: number | null;
  projectId: number | null;
  roomId: string | null;
}

export interface MessageSendParam {
  replyId?: string | null;
  content?: string;
  files?: RcFile[];
}

export interface MessageItemsResource {
  id: string;
  chatRoomId: string;
  replyId: string | null;
  senderId: number;
  content: string;
  status: string;
  sendingAt: string;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  replyMessage: ReplyMessageResource | null;
  sender: SenderInfo;
  attachments: string[];
}

export interface ReplyMessageResource {
  id: string;
  content?: string | null;
  // attachments?: string[] | null;
}

export interface SenderInfo {
  id: number;
  name: string;
  avatar: string | null;
  isOnline: number;
}
