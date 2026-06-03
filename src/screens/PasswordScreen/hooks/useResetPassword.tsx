import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { message } from 'antd';

import AuthServices from '@/src/data/auth/services/AuthServices';
import dialogUtils from '@/src/utils/DialogUtils';
import { ResetPasswordParams } from '@/src/data/auth/models/types';

export default function useResetPassword(token: string) {
  const router = useRouter();

  return useMutation({
    mutationKey: ['AUTH_RESET_PASSWORD', token],
    mutationFn: (variables: ResetPasswordParams) =>
      new AuthServices().resetPassword(variables, token),
    onSuccess: (res) => {
      router.push('/login');
      message.success(res?.message);
    },
    onError: (error) =>
      dialogUtils.showResponseError(error, 'AUTH_RESET_PASSWORD'),
  });
}
