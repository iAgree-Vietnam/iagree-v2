import { useMutation } from "@tanstack/react-query";
// import { message } from "antd";

import AuthServices from "@/src/data/auth/services/AuthServices";
import dialogUtils from "@/src/utils/DialogUtils";

export function useMutationProfile() {
  // const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["AUTH_UPDATE_PROFILE_V2"],
    mutationFn: (formData: FormData) => new AuthServices().updateFullInfo(formData),
    onSuccess: async(data) => {
      // await queryClient.invalidateQueries(["AUTH_FETCH_PROFILE"]);
    },
    onError: (error) => dialogUtils.showResponseError(error, "AUTH_UPDATE_PROFILE_V2"),
  });
}
