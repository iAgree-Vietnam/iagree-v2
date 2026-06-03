import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { message } from 'antd';
import _ from 'lodash';

import dialogUtils from '@/src/utils/DialogUtils';
import PricingServices from '@/src/data/pricing/services/PricingServices';

export function useAllUserSuspend(options: UseMutationOptions) {

  return useMutation({
    mutationKey: ['ALL_USER_SUSPEND'],
    mutationFn: (formData) =>
      new PricingServices().allUserSuspend(formData),
    onSuccess: async (data: any, variables, context) => {
      message.success('Hủy gói dịch vụ thành công').then(() => null);
      if (_.isFunction(options.onSuccess)) options.onSuccess(data, variables, context);
    },
    onError: (error, variables, context) => {
      if (_.isFunction(options.onError)) options.onError(error, variables, context);
      dialogUtils.showResponseError(error, 'ALL_USER_SUSPEND');
    }
  });
}
