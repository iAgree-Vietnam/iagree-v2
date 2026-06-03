import { useMutation, useQueryClient } from '@tanstack/react-query';
import dialogUtils from '@/src/utils/DialogUtils';
import { message } from 'antd';
import _ from 'lodash';
import { useAccountContext } from '@/src/contexts/AccountContext';
import PartnerServices from '@/src/data/partner/services/PartnerServices';
import { PartnerReactionParams } from '@/src/data/partner/models/partner.raw';
import { PartnerResource } from '@/src/data/partner/models/partner.types';

export default function usePartnerReaction(mutationOptions: any) {
    const { auth: fullProfileResource } = useAccountContext();
    const queryClient = useQueryClient();

    const mutationQuery = useMutation({
        mutationKey: ['PARTNER_REACTION'],
        mutationFn: (variables: PartnerReactionParams) =>
            new PartnerServices().onReaction(variables.partnerId),
        onSuccess: (data: any, variables, context) => {
            message.success(data?.message || 'Thành công').then(() => null);

            queryClient
                .getQueryCache()
                .findAll(['HOME_SCREEN'])
                .forEach(({ queryKey }) => {
                    queryClient.setQueryData(queryKey, (tanStackPageData: any) => {
                        return {
                            ...tanStackPageData,
                            partners: tanStackPageData.partners.map(
                                (partnerResource: PartnerResource) => {
                                    if (partnerResource.partnerId !== variables.partnerId)
                                        return partnerResource;

                                    return {
                                        ...partnerResource,
                                        isFavorite: !partnerResource.isFavorite,
                                    };
                                }
                            ),
                        };
                    });
                });

            queryClient
                .getQueryCache()
                .findAll(['PARTNERS_SCREEN'])
                .forEach(({ queryKey }) => {
                    queryClient.setQueryData(queryKey, (tanStackPageData: any) => {
                        return {
                            ...tanStackPageData,
                            items: tanStackPageData.items.map(
                                (partnerResource: PartnerResource) => {
                                    if (partnerResource.partnerId !== variables.partnerId)
                                        return partnerResource;

                                    return {
                                        ...partnerResource,
                                        isFavorite: !partnerResource.isFavorite,
                                    };
                                }
                            ),
                        };
                    });
                });

            queryClient
                .getQueryCache()
                .findAll(['PARTNERS_FAVORITE'])
                .forEach(({ queryKey }) => {
                    queryClient.setQueryData(queryKey, (tanStackPageData: any) => {
                        return tanStackPageData.map(
                            (partnerResource: PartnerResource) => {
                                if (partnerResource.partnerId !== variables.partnerId)
                                    return partnerResource;

                                return {
                                    ...partnerResource,
                                    isFavorite: !partnerResource.isFavorite,
                                };
                            }
                        );
                    });
                });

            if (_.isFunction(mutationOptions?.onSuccess))
                mutationOptions.onSuccess(data, variables, context);
        },
        onError: (error) =>
            dialogUtils.showResponseError(error, 'PARTNER_REACTION'),
    });

    return {
        ...mutationQuery,
        mutate: (values: PartnerReactionParams) => {
            if (!fullProfileResource)
                return message.error('Bạn cần phải đăng nhập để sử dụng chức năng này');

            mutationQuery.mutate(values);
        },
    };
}
