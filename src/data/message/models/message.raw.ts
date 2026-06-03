import { RawProfileResponse } from "../../auth/models/types";
import {
  RawFullJobResource,
  RawJobResource,
  RawUserProjectDealResource,
} from "../../job/models/job.raw";
import { RawLocationResource } from "../../location/models/location.raw";
import { ChatRoomInfoResource } from "./message.types";

export interface RawListRoomChatOfUser {
  items: RawMessageItemsResource[];
  id: string;
  isRead?: boolean;
  chat_room_id: string;
  user_id: number;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  user: RawProfileResponse;
  chat_room: RawChatRoom;
  latestMessage: RawMessageItemsResource;
  infoDetail: {
    clientId?: string; // ID của khách hàng (client), kiểu string
    clientName?: string; // Tên khách hàng (client), kiểu string
    clientIsOnline?: number; // Trạng thái trực tuyến của khách hàng, kiểu number (0: offline, 1: online)
    clientAvatar?: string; // URL của ảnh đại diện của khách hàng, kiểu string
    partnerId?: number; // ID của đối tác, kiểu number
    partnerName?: string; // Tên đối tác, kiểu string
    partnerIsOnline?: number; // Trạng thái trực tuyến của đối tác, kiểu number (0: offline, 1: online)
    partnerAvatar?: string; // URL của ảnh đại diện của đối tác, kiểu string
  };
  messages: ChatRoomInfoResource[];
}

export interface RawChatRoom {
  id: string;
  ref_id: number;
  type: string;
  name: string;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  project: RawFullJobResource;
  message: RawMessageItemsResource | null;
}

export interface RawChatRoomInfo {
  roomId: string;
  status: string;
  infoDetail: RawInfoDetailResource;
  items: RawMessageItemsResource[] | [];
  total: number;
  total_page: number;
  current_page: number;
  per_page: number;
  next_page: number;
  prev_page: number;
}

export interface RawInfoDetailResource {
  partnerId: number | undefined;
  partnerName: string | undefined;
  location: RawLocationResource[] | undefined;
  position: string | undefined;
  rate: number | undefined;
  price: number | undefined;
  partnerDes: string | undefined;
  clientId: number | undefined;
  clientName: string | undefined;
  projectId: number;
  projectName: string;
  projectDes: string;
  projectStatus: number;
  clientIsOnline?: number; // Trạng thái trực tuyến của khách hàng, kiểu number (0: offline, 1: online)
  clientAvatar?: string; // URL của ảnh đại diện của khách hàng, kiểu string
  partnerIsOnline?: number; // Trạng thái trực tuyến của đối tác, kiểu number (0: offline, 1: online)
  partnerAvatar?: string; // URL của ảnh đại diện của đối tác, kiểu string
  userProjectBids: RawUserProjectBidsResource | null;
}

export interface RawUserProjectBidsResource {
  id: number;
  project_id: number;
  user_id: number;
  application_letter: string | null;
  description: string | null;
  application_file: string | null;
  note: string | null;
  negotiate_price: number;
  number_accept: number;
  start_date: string;
  end_date: string;
  bid_type: number;
  status: number;
  user: {
    id: number;
    name: string;
  };
  user_project_deals: RawUserProjectDealResource[] | [];
}

export interface RawMessageItemsResource {
  id: string;
  chat_room_id: string;
  reply_id: string | null;
  sender_id: number;
  content: string;
  status: string;
  sending_at: string;
  read_at: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  reply_message: RawReplyMessageResource | null;
  sender: RawSenderInfo;
  attachments: string[] | [];
}

export interface RawReplyMessageResource {
  id: string;
  content?: string | null;
  // attachments?: string[] | null;
}

export interface RawSenderInfo {
  id: number;
  name: string;
  avatar: string | null;
  is_online: number;
}
