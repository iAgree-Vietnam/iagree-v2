import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';

import NotificationServices from '@/src/data/notification/services/NotificationService';
import dialogUtils from '@/src/utils/DialogUtils';

export function useDeleteNotification() {

    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['NOTIFICATION_DELETE'],
        mutationFn: (notificationId: number) => new NotificationServices().deleteNotification(notificationId),
        onSuccess: (data, notificationId: number) => {
            message.success('Xóa thành công').then(() => null);

            queryClient.invalidateQueries(['AUTH_FETCH_NOTIFICATION']).then(() => null);

            // queryClient.getQueryCache().findAll(['AUTH_FETCH_NOTIFICATION']).forEach(({ queryKey }) => {
            //     queryClient.setQueryData(queryKey, (tanStackPageData: any) => {
            //         return {
            //             ...tanStackPageData,
            //             items: tanStackPageData.items.filter((nItem: NotificationResource) => nItem.notificationId !== notificationId),
            //         };
            //     });
            // });
        },
        onError: (error) => dialogUtils.showResponseError(error, 'NOTIFICATION_DELETE'),
    });

}
