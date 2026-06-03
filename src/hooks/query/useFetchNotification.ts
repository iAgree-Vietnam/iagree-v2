import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import _ from 'lodash';

import NotificationServices from '@/src/data/notification/services/NotificationService';
import { NotificationFilterParams } from '@/src/data/notification/models/notification.types';
import Constants from '@/src/constants/Constants';

export default function useFetchNotification(
  filters: NotificationFilterParams,
  stateFetch?: boolean | number
) {
  const accessToken = Cookies.get(Constants.KEY_ACCESS_TOKEN)||null;

  return useQuery({
    queryKey: ['AUTH_FETCH_NOTIFICATION', filters, stateFetch],
    queryFn: () => {
      return new NotificationServices().getNotifications(filters);
    },
    enabled: !_.isEmpty(accessToken),
  });
}
