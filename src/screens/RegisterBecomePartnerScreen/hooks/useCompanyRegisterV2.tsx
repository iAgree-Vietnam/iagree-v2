import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { message } from 'antd';
import Cookies from 'js-cookie';

import AuthServices from '@/src/data/auth/services/AuthServices';
import dialogUtils from '@/src/utils/DialogUtils';
import { RegisterParams, RegisterResponse } from '@/src/data/auth/models/types';
import AuthRouteUtils from '@/src/data/auth/utils/AuthRouteUtils';
import Constants from '@/src/constants/Constants';

export default function useCompanyRegisterV2() {

    const router = useRouter();

    return useMutation({
        mutationKey: ['AUTH_REGISTER_V2'],
        mutationFn: (variables: RegisterParams) => new AuthServices().companyRegister(variables),
        onSuccess: ({email}: RegisterResponse, variables: RegisterParams) => {
            message.success('Hãy kiểm tra email của bạn. Sau đó nhập mã OTP trong hộp thư để xác thực tài khoản.').then(() => null);
            Cookies.set(Constants.KEY_VERIFY_EMAIL, email);
            Cookies.set(Constants.KEY_PASSWORD, variables.password);
            router.replace(AuthRouteUtils.toVerifyOtpV2()).then(() => null);
        },
        onError: (error) => dialogUtils.showResponseError(error, 'AUTH_REGISTER_V2'),
    });

}
