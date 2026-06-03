import { useMutation, useQueryClient } from "@tanstack/react-query";
import JobServices from "@/src/data/job/services/JobServices";
import dialogUtils from "@/src/utils/DialogUtils";
import {
  JobReactionParams,
  JobResource,
} from "@/src/data/job/models/job.types";
import { message } from "antd";
import { useAccountContext } from "@/src/contexts/AccountContext";

interface UseJobReactionOption {
  onSuccess?: () => void;
}

export default function useJobReaction(options?: UseJobReactionOption) {
  const { auth: fullProfileResource } = useAccountContext();
  const queryClient = useQueryClient();

  const mutationQuery = useMutation({
    mutationKey: ["JOB_REACTION"],
    mutationFn: (variables: JobReactionParams) =>
      new JobServices().onReaction(variables.jobId),
    onSuccess: (data: any, variables) => {
      message.success(data?.message || "Thành công").then(() => null);

      queryClient
        .getQueryCache()
        .findAll(["HOME_SCREEN"])
        .forEach(({ queryKey }) => {
          queryClient.setQueryData(queryKey, (tanStackPageData: any) => {
            return {
              ...tanStackPageData,
              jobs: {
                items: tanStackPageData.jobs.items.map(
                  (jobResource: JobResource) => {
                    if (jobResource.jobId !== variables.jobId)
                      return jobResource;

                    return {
                      ...jobResource,
                      isLiked: !jobResource.isLiked,
                    };
                  }
                ),
              },
            };
          });
        });

      queryClient
        .getQueryCache()
        .findAll(["JOBS_SCREEN"])
        .forEach(({ queryKey }) => {
          queryClient.setQueryData(queryKey, (tanStackPageData: any) => {
            return {
              ...tanStackPageData,
              items: tanStackPageData.items.map((jobResource: JobResource) => {
                if (jobResource.jobId !== variables.jobId) return jobResource;

                return {
                  ...jobResource,
                  isLiked: !jobResource.isLiked,
                };
              }),
            };
          });
        });

      queryClient
        .getQueryCache()
        .findAll(["JOB_DETAIL_SCREEN", variables.jobId])
        .forEach(({ queryKey }) => {
          queryClient.setQueryData(queryKey, (tanStackPageData: any) => {
            return {
              ...tanStackPageData,
              isLiked: !tanStackPageData.isLiked,
            };
          });
        });

      options?.onSuccess?.();
    },
    onError: (error: any) =>
      dialogUtils.showResponseError(error, "JOB_REACTION"),
  });

  return {
    ...mutationQuery,
    mutate: (values: JobReactionParams) => {
      if (!fullProfileResource)
        return message.error("Bạn cần phải đăng nhập để sử dụng chức năng này");

      mutationQuery.mutate(values);
    },
  };
}
