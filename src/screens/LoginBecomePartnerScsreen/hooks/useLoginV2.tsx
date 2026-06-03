import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import dialogUtils from "@/src/utils/DialogUtils";
import { LoginParams } from "@/src/data/auth/models/types";
import { message } from "antd";
import Cookies from "js-cookie";
import Constants from "@/src/constants/Constants";
import { PartnerRouteUtils } from "@/src/data/partner/utils/PartnerRouteUtils";
import { useRouter } from "next/router";

export default function useLoginV2() {
  const router = useRouter();

  return useMutation({
    mutationKey: ["AUTH_LOGIN"],
    mutationFn: async (variables: LoginParams) => {
      const signInResponse = await signIn("credentials", {
        ...variables,
        redirect: false,
      });

      // Parse status code from error message
      if (signInResponse?.error) {
        const errorParts = signInResponse.error.split(":");
        let customStatus = 401; // default NextAuth status
        let errorMessage = signInResponse.error;

        if (errorParts.length >= 2) {
          const errorType = errorParts[0];
          errorMessage = errorParts[1];

          // Map error types to correct status codes
          if (errorType === "WRONG_PASSWORD") {
            customStatus = 400; // Use server's original status
          } else if (errorType === "EMAIL_NOT_VERIFIED") {
            customStatus = 401; // Keep 401 for email verification
          } else if (errorType === "UNKNOWN_ERROR") {
            customStatus = 500; // Generic server error
          }
        }

    

        if (customStatus === 401) {
          // Email not verified - return object để LoginScreen handle
          return {
            status: customStatus,
            error: errorMessage,
            ok: false,
          };
        } else {
          // Wrong password (400) hoặc other errors - throw để trigger onError
          const error = new Error(errorMessage);
          (error as any).status = customStatus; // Attach status to error
          throw error;
        }
      }

      return signInResponse;
    },
    onSuccess: async (result) => {
      if (result?.ok) {
        message.success("Đăng nhập thành công");
        Cookies.set(Constants.IS_REGISTER_BECOME_PARTNER, "true");
        const ROUTE_PRE_LOGIN = Cookies.get(Constants.ROUTE_PRE_LOGIN);

        if (!ROUTE_PRE_LOGIN) {
          Cookies.set(
            Constants.ROUTE_PRE_LOGIN,
            PartnerRouteUtils.toPartnerRegisterGetStart()
          );
        }

        router.replace(ROUTE_PRE_LOGIN as string).then(() => null);
      }
    },
    onError: (error: any) => {
      dialogUtils.showResponseError(
        { response: { data: { message: error.message } } },
        "AUTH_LOGIN"
      );
    },
  });
}
