import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { message } from 'antd';
import _ from 'lodash';

import PartnerServices from '@/src/data/partner/services/PartnerServices';
import dialogUtils from '@/src/utils/DialogUtils';
import { PartnerConnectParams, } from '@/src/data/partner/models/partner.types';

export function usePartnerConnect(options: UseMutationOptions<any, any, PartnerConnectParams>) {

  return useMutation({
    mutationKey: ['PARTNER_CONNECT'],
    mutationFn: (formData: PartnerConnectParams) =>
      new PartnerServices().onConnect(formData),
    onSuccess: async (data: any, variables, context) => {
      message.success('Gửi yêu cầu kết nối đối tác thành công.').then(() => null);
      if (_.isFunction(options.onSuccess)) options.onSuccess(data, variables, context);
    },
    onError: (error, variables, context) => {
      if (_.isFunction(options.onError)) options.onError(error, variables, context);
      dialogUtils.showResponseError(error, 'PARTNER_CONNECT');
    }
  });
}
