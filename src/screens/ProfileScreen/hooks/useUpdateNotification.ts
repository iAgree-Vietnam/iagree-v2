import { useMutation, useQueryClient } from '@tanstack/react-query';

import dialogUtils from '@/src/utils/DialogUtils';
import { NotificationUpdateStatusParams } from '@/src/data/notification/models/notification.types';
import NotificationServices from '@/src/data/notification/services/NotificationService';

export function useUpdateNotification() {
  const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['NOTIFICATION_UPDATE'],
        mutationFn: (variables: NotificationUpdateStatusParams) => new NotificationServices().updateNotificationsStatus(variables),
        onSuccess: () => {
            queryClient.invalidateQueries(["AUTH_FETCH_NOTIFICATION"]);
        },
        onError: (error) => dialogUtils.showResponseError(error, 'NOTIFICATION_UPDATE'),
    });

}
