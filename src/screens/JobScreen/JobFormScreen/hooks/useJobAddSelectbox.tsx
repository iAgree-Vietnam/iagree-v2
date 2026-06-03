import { useQuery, UseQueryResult } from "@tanstack/react-query";
import JobServices from "../../../../data/job/services/JobServices";
import { JobSelectboxResource } from "@/src/data/job/models/job.types";

const defaultDataResource = {
  items: [],
  total: 0,
};
interface UseJobAddSelectboxOptions {
  initialData?: JobSelectboxResource | null;
}

export default function useJobAddSelectbox(
  options?: UseJobAddSelectboxOptions
): UseQueryResult<JobSelectboxResource> {
  return useQuery<JobSelectboxResource>({
    queryKey: ["JOB_SELECTBOX"],
    queryFn: () => new JobServices().getSelectBoxes(),
    // queryFn: () => new JobServices().getSelectBoxesTest(),
    // initialData: () => ({
    //   salaries: defaultDataResource,
    //   // categories: defaultDataResource,
    //   categories: [],
    //   categoryServices: [],
    //   services: [],
    //   experiences: defaultDataResource,
    //   times: defaultDataResource,
    //   locations: defaultDataResource,
    //   tags: defaultDataResource,
    //   skills: [],
    // }),
    initialData: options?.initialData as unknown as JobSelectboxResource,

    staleTime: 1000 * 60 * 60 * 24 * 3, // cache 3 ngày
    // gcTime: 1000 * 60 * 60 * 24 * 3,
    refetchOnWindowFocus: false,
    retry: false,
  });
}
