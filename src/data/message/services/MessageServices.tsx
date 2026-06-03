import apiUtils from "@/src/utils/APIUtils";
import EndpointConfig from "@/src/constants/EndpointConfig";
import URLUtils from "@/src/utils/URLUtils";
import { MessageParserUtils } from "../utils/MessageParserUtils";
import {
  ChatRoomInfoResource,
  MessageSendParam,
} from "../models/message.types";
import _, { isEmpty } from "lodash";
import { RcFile, UploadFile } from "antd/es/upload/interface";
import { ParamsCommonType } from "@/src/screens/ChatScreenV2/hooks/useFetchRoomInfo";
import { NotificationFilterParams } from "../../notification/models/notification.types";

export interface QueryParamsListChat {
  /** Số lượng phần tử mỗi trang */
  per_page?: number;

  /** Từ khóa tìm kiếm */
  search?: string;

  /** Ngày bắt đầu (ISO format: yyyy-mm-dd) */
  date_from?: string;

  /** Ngày kết thúc (ISO format: yyyy-mm-dd) */
  date_to?: string;

  /** Loại file: image | video | file | all */
  type?: "image" | "video" | "file" | "all";

  /** Trang hiện tại (nếu API có hỗ trợ phân trang) */
  page?: number;
}

export interface ListFileResponseI {
  success: boolean;
  data: {
    /** ID của phòng chat */
    roomId: string;

    /** Thông tin chi tiết 2 bên tham gia */
    infoDetail: {
      client: {
        id: string;
        name: string;
        avatar: string | null;
        is_online: number;
      };
      partner: {
        id: string;
        name: string;
        avatar: string | null;
        is_online: number;
        position?: string;
        rate?: number;
        description?: string;
        subscription_plan?: string;
        is_feature?: number;
        is_founding?: number;
      };
      projectCreatedByUserId: number;
    };

    /** Danh sách file đính kèm */
    attachments: AttachmentItem[];

    /** Tổng số record */
    total: number;

    /** Tổng số trang */
    total_page: number;

    /** Trang hiện tại */
    current_page: number;

    /** Số record mỗi trang */
    per_page: number;

    /** Trang kế tiếp (nếu có) */
    next_page?: number | null;

    /** Trang trước (nếu có) */
    prev_page?: number | null;
  };
}

/** Cấu trúc của từng file trong attachments */
export interface AttachmentItem {
  id: string;
  message_id: string;
  file_name: string;
  file_name_original: string;
  file_path: string;
  created_at: string; // ISO datetime
}

export default class MessageServices {
  getAllChatRooms(
    userId?: number,
    params?: {
      message: number;
    }
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const endpointUrl = URLUtils.bindUrl(EndpointConfig.CHAT_ROOM_LIST, {
        ":userId": userId,
      });

      apiUtils
        .post(endpointUrl, {
          params,
        })
        .then((apiRes) => {
          resolve(apiRes.data);
        })
        .catch(reject);
    });
  }

  getDetailChatRoom(roomId?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const endpointUrl = URLUtils.bindUrl(EndpointConfig.CHAT_ROOM_DETAIL, {
        ":roomId": roomId,
      });

      apiUtils
        .post(endpointUrl)
        .then((apiRes) => {
          resolve(apiRes.data);
        })
        .catch(reject);
    });
  }

  createRoomChat(
    receiverId: number,
    projectId: number
  ): Promise<ChatRoomInfoResource> {
    return new Promise((resolve, reject) => {
      const formData = {
        receiverId: receiverId,
        projectId: projectId,
      };

      apiUtils
        .post(EndpointConfig.MESSAGE_LIST, formData)
        .then((apiRes) => resolve(MessageParserUtils.listMessages(apiRes.data)))
        .catch(reject);
    });
  }

  getRoomChatInfo(roomId: string, params?: ParamsCommonType): Promise<any> {
    return new Promise((resolve, reject) => {
      const formData = {
        roomId: roomId,
      };

      apiUtils
        .post(EndpointConfig.MESSAGE_LIST, formData, {
          params: {
            ...params,
            page: params?.page || 1,
            per_page: params?.per_page || 25,
          },
        })
        .then((apiRes) => resolve(apiRes.data))
        .catch(reject);
    });
  }

  extractFiles(fileList?: UploadFile[]): RcFile[] {
    return (fileList || [])
      .map((f) => f.originFileObj) // lấy RcFile gốc
      .filter((f): f is RcFile => f instanceof File); // lọc những cái thật sự là File
  }

  async onSendMessages(roomId: string, dataParams: MessageSendParam) {
    const endpointUrl = URLUtils.bindUrl(EndpointConfig.MESSAGE_SEND, {
      ":roomId": roomId,
    });

    const formData = new FormData();
    if (!isEmpty(dataParams.content)) {
      formData.append("content", dataParams.content ?? "");
    }
    if (dataParams.replyId) {
      formData.append("reply_id", dataParams.replyId);
    }

    // Nếu chắc chắn là RcFile[]: append trực tiếp
    if (Array.isArray(dataParams.files) && dataParams.files.length > 0) {
      for (const file of dataParams.files as RcFile[]) {
        formData.append("attachments[]", file, file.name);
      }
    }

    // axios sẽ tự set multipart/form-data
    const res = await apiUtils.post(endpointUrl, formData);
    return res.data;
  }

  async getPageReplyMess(
    roomId: string,
    messId: string,
    params?: Partial<NotificationFilterParams>
  ) {
    const endpointUrl = URLUtils.bindUrl(EndpointConfig.MESSAGE_REPLY, {
      ":roomId": roomId,
      ":messId": messId,
    });

    // axios sẽ tự set multipart/form-data
    const res = await apiUtils.get(endpointUrl, { params });
    return res.data;
  }

  async getListFile(roomId: string, params?: Partial<QueryParamsListChat>) {
    const endpointUrl = URLUtils.bindUrl(EndpointConfig.FILE_CHAT, {
      ":roomId": roomId,
    });

    // axios sẽ tự set multipart/form-data
    const res= await apiUtils.get(endpointUrl, {
      params,
    });
    return res.data as ListFileResponseI;
  }
}
