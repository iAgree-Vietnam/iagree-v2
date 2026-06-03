import { useMutation } from '@tanstack/react-query';
import { message } from 'antd';

import AuthServices from '@/src/data/auth/services/AuthServices';
import dialogUtils from '@/src/utils/DialogUtils';
import { ChangePasswordParams } from '@/src/data/auth/models/types';

interface UseChangePasswordOptions {
  onSuccess: () => void;
}

export default function useChangePassword(options: UseChangePasswordOptions) {
  return useMutation({
    mutationKey: ['AUTH_CHANGE_PASSWORD'],
    mutationFn: (variables: ChangePasswordParams) =>
      new AuthServices().changePassword(variables),
    onSuccess: (res) => {
      options.onSuccess();
      message.success(res?.message);
    },
    onError: (error) =>
      dialogUtils.showResponseError(error, 'AUTH_CHANGE_PASSWORD'),
  });
}
