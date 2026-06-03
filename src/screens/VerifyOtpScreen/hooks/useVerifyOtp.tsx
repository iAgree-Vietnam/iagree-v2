import { useMutation } from "@tanstack/react-query";
import { message } from "antd";

import AuthServices from "@/src/data/auth/services/AuthServices";
import dialogUtils from "@/src/utils/DialogUtils";
import {
  VerifyEmailParams,
} from "@/src/data/auth/models/types";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import Constants from "@/src/constants/Constants";
import { signIn } from "next-auth/react";

export default function useVerifyOtp() {
  const router = useRouter();

  return useMutation({
    mutationKey: ["AUTH_VERIFY_OTP"],
    mutationFn: (variables: VerifyEmailParams) =>
      new AuthServices().verifyOtp(variables),
    onSuccess: async (res) => {
      message.success(res?.message);
      const ROUTE_PRE_LOGIN = Cookies.get(Constants.ROUTE_PRE_LOGIN);

      const email = Cookies.get(Constants.KEY_VERIFY_EMAIL);
      const password = Cookies.get(Constants.KEY_PASSWORD);

      try {
        const signInResult = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });
        
        // Kiểm tra kết quả đăng nhập
        if (signInResult?.ok) {
          router.push(ROUTE_PRE_LOGIN as string);
        } else {
          router.push('/login?message=please_login_again');
        }
      } catch (error) {
        router.push('/login?message=please_login_again');
      }

            // router.push(AuthRouteUtils.toCheckRole());

    },
    onError: (error) => dialogUtils.showResponseError(error, "AUTH_VERIFY_OTP"),
  });
}
