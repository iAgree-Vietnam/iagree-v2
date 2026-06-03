import { useMutation } from '@tanstack/react-query';
import { message } from 'antd';

import AuthServices from '@/src/data/auth/services/AuthServices';
import dialogUtils from '@/src/utils/DialogUtils';
import { VerifyEmailResendParams } from '@/src/data/auth/models/types';

export default function useVerifyEmailResend() {
  return useMutation({
    mutationKey: ['AUTH_VERIFY_EMAIL_RESEND'],
    mutationFn: (variables: VerifyEmailResendParams) =>
      new AuthServices().verifyEmailResend(variables),
    onSuccess: (res) => {
      message.success(res?.message);
    },
    onError: (error) =>
      dialogUtils.showResponseError(error, 'AUTH_VERIFY_EMAIL_RESEND'),
  });
}
