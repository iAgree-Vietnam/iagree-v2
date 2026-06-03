import { RawNotificationResource } from '@/src/data/notification/models/notification.raw';
import { NotificationDataResource, NotificationResource } from '@/src/data/notification/models/notification.types';

export const NotificationParseUtils = {
  item(dataItem: RawNotificationResource): NotificationResource {
    return {
      notificationId: dataItem?.id,
      user_id: dataItem?.user_id,
      type: dataItem?.type,
      type_id: dataItem?.type_id,
      name: dataItem?.name,
      description: dataItem?.description,
      date: dataItem?.date,
      note: dataItem?.note,
      status: dataItem?.status,
      created_at: dataItem?.created_at,
      updated_at: dataItem?.updated_at,
      itemName: dataItem?.item_name,
    };
  },

  list(data: NotificationDataResource<RawNotificationResource>): NotificationDataResource<NotificationResource> {
    return {
      items: data?.items?.map(NotificationParseUtils.item),
      total: data?.total,
      total_unread: data?.total_unread,
      totalUnreadChatRooms: data.totalUnreadChatRooms,
    };
  },
};
