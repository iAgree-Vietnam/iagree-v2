import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import Cookies from "js-cookie";
import { signOut } from "@/lib/shim/next-auth-react";
import _ from "lodash";

import AuthServices from "@/src/data/auth/services/AuthServices";
import Constants from "@/src/constants/Constants";
import { useAccountContext } from "@/src/contexts/AccountContext";

export function useLogout(options?: UseMutationOptions) {
  const queryClient = useQueryClient();
  const { setAccessToken, logout } = useAccountContext();

  const clearSession = async () => {
    Cookies.remove(Constants.KEY_ACCESS_TOKEN);

    sessionStorage.clear();
    localStorage.clear();

    setAccessToken(null);

    queryClient.setQueryData(["AUTH_FETCH_PROFILE"], null);
    await queryClient.invalidateQueries(["HOME_SCREEN"]);
    logout();
    signOut({ redirect: false });
  };

  return useMutation({
    mutationKey: ["AUTH_LOGOUT"],
    mutationFn: () => new AuthServices().logout(),
    onSuccess: async (data, variables, context) => {
      await clearSession();

      if (_.isFunction(options?.onSuccess)) {
        options?.onSuccess(data, variables, context);
      }
    },
    // onError: (error) => dialogUtils.showResponseError(error, 'AUTH_LOGOUT'),
  });
}
