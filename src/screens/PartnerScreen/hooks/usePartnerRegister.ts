import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';

import PartnerServices from '@/src/data/partner/services/PartnerServices';
import dialogUtils from '@/src/utils/DialogUtils';
import { PartnerRegisterParams } from '@/src/data/partner/models/partner.types';
import _ from 'lodash';

// export function usePartnerRegister(options: UseMutationOptions) {
export function usePartnerRegister(
  options: UseMutationOptions<any, unknown, PartnerRegisterParams>
) {
  // const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['PARTNER_REGISTER'],
    mutationFn: (formData: PartnerRegisterParams) =>
      new PartnerServices().onRegister(formData),
    onSuccess: async (data, variables, context) => {
      // message.success('Đơn đăng ký đang chờ phê duyệt.').then(() => null);
      await queryClient.invalidateQueries(['AUTH_FETCH_PROFILE']);
      await queryClient.invalidateQueries(['FETCH_PARTNER_DETAILS']);
      // router.push(PartnerRouteUtils.toProfileUrl());
      if (_.isFunction(options.onSuccess)) options.onSuccess(data, variables, context);

    },
    onError: (error) =>
      dialogUtils.showResponseError(error, 'PARTNER_REGISTER'),
  });
}
