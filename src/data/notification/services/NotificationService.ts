import apiUtils from '@/src/utils/APIUtils';
import EndpointConfig from '@/src/constants/EndpointConfig';
import { NotificationResource, NotificationFilterParams, NotificationDataResource, NotificationUpdateStatusParams } from '@/src/data/notification/models/notification.types';
import { NotificationParseUtils } from '@/src/data/notification/utils/NotificationParseUtils';
import URLUtils from '@/src/utils/URLUtils';

export default class NotificationServices {
  getNotifications(queryParams: NotificationFilterParams): Promise<NotificationDataResource<NotificationResource>> {
    return new Promise((resolve, reject) => {
      apiUtils
        .get(EndpointConfig.NOTIFICATIONS_LIST, { params: queryParams })
        .then((apiRes) => resolve(NotificationParseUtils.list(apiRes.data)))
        .catch(reject);
    });
  }

  updateNotificationsStatus(params: NotificationUpdateStatusParams) {
    return new Promise((resolve, reject) => {
      apiUtils
        .post(EndpointConfig.NOTIFICATION_UPDATE, params)
        .then((apiRes) => resolve(apiRes.data))
        .catch(reject);
    });
  }

  deleteNotification(notificationId: number) {
    return new Promise((resolve, reject) => {
      const endpointUrl = URLUtils.bindUrl(EndpointConfig.NOTIFICATION_DETAIL, { ':notificationId': notificationId });
      apiUtils
        .delete(endpointUrl)
        .then((apiRes) => resolve(apiRes.data))
        .catch(reject);
    });
  }
}
