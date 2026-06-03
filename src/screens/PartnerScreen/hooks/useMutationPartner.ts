import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';

import PartnerServices from '@/src/data/partner/services/PartnerServices';
import dialogUtils from '@/src/utils/DialogUtils';
import { PartnerUpdateParams } from '@/src/data/partner/models/partner.types';

export function useMutationPartner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['PARTNER_UPDATE'],
    mutationFn: (params: {
      formData: PartnerUpdateParams;
      partnerId: number;
    }) => new PartnerServices().onUpdate(params),
    onSuccess: async (data: any) => {
      message.success('Cập nhật thông tin đối tác thành công.');
      await queryClient.invalidateQueries(['AUTH_FETCH_PROFILE']);
      await queryClient.invalidateQueries(['FETCH_PARTNER_DETAILS']);
    },
    onError: (error) => dialogUtils.showResponseError(error, 'PARTNER_UPDATE'),
  });
}
