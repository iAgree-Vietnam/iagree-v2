import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { message } from 'antd';

import PartnerServices from '@/src/data/partner/services/PartnerServices';
import dialogUtils from '@/src/utils/DialogUtils';
import { PartnerFeedbackFromSocialOrganizationParams } from '@/src/data/partner/models/partner.types';
import _ from 'lodash';

export function usePartnerComplain(options: UseMutationOptions) {

  return useMutation({
    mutationKey: ['PARTNER_COMPLAIN'],
    mutationFn: (params: PartnerFeedbackFromSocialOrganizationParams) => new PartnerServices().onFeedbackFromSocialOrganization(params),
    onSuccess: async (data: any) => {
      message.success(data?.message || 'Thành công').then(() => null);
      //@ts-ignore
      if (_.isFunction(options.onSuccess)) options.onSuccess(data);
    },
    onError: (error) => dialogUtils.showResponseError(error, 'PARTNER_COMPLAIN'),
  });
}
