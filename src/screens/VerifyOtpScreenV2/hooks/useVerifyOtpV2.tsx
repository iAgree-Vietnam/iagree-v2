import { useMutation } from "@tanstack/react-query";
import { message } from "antd";

import AuthServices from "@/src/data/auth/services/AuthServices";
import dialogUtils from "@/src/utils/DialogUtils";
import { VerifyEmailParams } from "@/src/data/auth/models/types";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import Constants from "@/src/constants/Constants";
import { signIn } from "@/lib/shim/next-auth-react";
import { useAccountContext } from "@/src/contexts/AccountContext";

export default function useVerifyOtpV2() {
  const router = useRouter();
  const { setAccessToken, refreshAccount } = useAccountContext(); // 👈 lấy context

  return useMutation({
    mutationKey: ["AUTH_VERIFY_OTP"],
    mutationFn: (variables: VerifyEmailParams) =>
      new AuthServices().verifyOtp(variables),
    onSuccess: async (res) => {
      message.success(res?.message);

      const routePreLogin = Cookies.get(Constants.ROUTE_PRE_LOGIN) || "/";

      const email = Cookies.get(Constants.KEY_VERIFY_EMAIL);
      const password = Cookies.get(Constants.KEY_PASSWORD);
      // await signIn("credentials", {
      //   email,
      //   password,
      //   redirect: true,
      //   callbackUrl: routePreLogin,
      // });
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        dialogUtils.showResponseError(result.error, "AUTH_LOGIN_AFTER_VERIFY");
        return;
      }

      // 2. Backend login xong thường sẽ set cookie access token
      const token = Cookies.get(Constants.KEY_ACCESS_TOKEN);

      if (token) {
        // cập nhật context => header biết là đã login
        setAccessToken(token);
        await refreshAccount();
      }

      // 3. Rồi mới redirect
      router.replace(routePreLogin);

      // router.replace(ROUTE_PRE_LOGIN as string).then(() => null);
    },
    onError: (error) => dialogUtils.showResponseError(error, "AUTH_VERIFY_OTP"),
  });
}
