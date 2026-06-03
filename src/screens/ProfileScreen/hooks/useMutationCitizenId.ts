import { useMutation } from "@tanstack/react-query";

import AuthServices from "@/src/data/auth/services/AuthServices";
import dialogUtils from "@/src/utils/DialogUtils";

export function useMutationCitizenId() {

  return useMutation({
    mutationKey: ["AUTH_UPDATE_CITIZEN_ID"],
    mutationFn: (citizenId: string) => new AuthServices().updateCitizenId(citizenId),
    onSuccess: async(data) => {
      // await queryClient.invalidateQueries(["AUTH_FETCH_PROFILE"]);
      // message.success(data?.message).then(() => null);
    },
    onError: (error) => dialogUtils.showResponseError(error, "AUTH_UPDATE_CITIZEN_ID"),
  });
}
