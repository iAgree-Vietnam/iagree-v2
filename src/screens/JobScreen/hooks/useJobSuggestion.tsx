import { JobSuggest } from "@/src/data/job/models/job.types";
import JobServices from "@/src/data/job/services/JobServices";
import { useQuery } from "@tanstack/react-query";
import { UseQueryResult } from "@tanstack/react-query";
import _ from "lodash";

export default function useJobSuggestion(keyword: string | null): UseQueryResult<JobSuggest[], Error> {
    return useQuery({
        queryKey: ['JOB_SUGGESTION', keyword],
        queryFn: async () => {
            if (!keyword) {
                return [];
            }
            const queryParams = { name: keyword };
            const response = await new JobServices().onSuggest(queryParams);
            return response;
        },
        enabled: !_.isEmpty(keyword),
    });
}