import { useMutation } from '@tanstack/react-query';
import { message } from 'antd';

import AuthServices from '@/src/data/auth/services/AuthServices';
import dialogUtils from '@/src/utils/DialogUtils';
import { ForgotPasswordParams } from '@/src/data/auth/models/types';

interface UseForgotPasswordOptions {
  onSuccess: () => void;
}

export default function useForgotPassword(options: UseForgotPasswordOptions) {

  return useMutation({
    mutationKey: ['AUTH_FORGOT_PASSWORD'],
    mutationFn: (variables: ForgotPasswordParams) =>
      new AuthServices().forgotPassword(variables),
    onSuccess: (res) => {
      options.onSuccess();
      message.success(res?.message);
    },
    onError: (error) =>
      dialogUtils.showResponseError(error, 'AUTH_FORGOT_PASSWORD'),
  });
}
