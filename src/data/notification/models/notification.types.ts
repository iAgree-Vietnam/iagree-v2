export interface NotificationResource {
  projectName?: any;
  notificationId: number;
  user_id: number;
  type: number;
  type_id: number;
  name: string;
  description: string;
  date: string;
  note: string | null;
  status: number;
  created_at: string;
  updated_at: string;
  itemName: string | null;
}

export interface NotificationFilterParams {
  page: number;
  per_page: number;
}

export interface NotificationDataResource<T> {
  items: T[];
  total: number;
  total_unread: number;
  totalUnreadChatRooms: number;
}

export interface NotificationUpdateStatusParams {
  items: NotificationUpdateStatusItem[];
}

interface NotificationUpdateStatusItem {
  id: number | string;
  status: number;
}
