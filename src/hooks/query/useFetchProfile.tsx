import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Constants from '@/src/constants/Constants';
import AuthServices from '@/src/data/auth/services/AuthServices';
import _ from 'lodash';
import { useAccountContext } from '@/src/contexts/AccountContext';
import { message } from 'antd';
import { AxiosError } from 'axios';
import { signOut } from '@/lib/shim/next-auth-react';
import AuthRouteUtils from '@/src/data/auth/utils/AuthRouteUtils';

export default function useFetchProfile() {
    const accessToken = Cookies.get(Constants.KEY_ACCESS_TOKEN)||null;
    const accountContext = useAccountContext();
    const queryClient = useQueryClient();
    const router = useRouter();

    return useQuery({
        queryKey: ['AUTH_FETCH_PROFILE'],
        queryFn: () => new AuthServices().getFullInfo(accountContext.accessToken as string),
        enabled: !!accountContext.accessToken,
        onError: (error) => {
            if (error instanceof AxiosError && error.response?.status === 401) {
                signOut({ redirect: false }); // From next-auth/react
                Cookies.remove(Constants.KEY_ACCESS_TOKEN);
                accountContext.setAccessToken(null);
                queryClient.setQueryData(['AUTH_FETCH_PROFILE'], null);
                message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            }
        },
    });

    // return useQuery({
    //     queryKey: ['AUTH_FETCH_PROFILE'],
    //     queryFn: () => new AuthServices().getFullInfo(accessToken as string),
    //     enabled: !_.isEmpty(accessToken),
    //     staleTime: 0,
    //     cacheTime: 0,
    // });

}
