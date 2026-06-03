import { JobResource, JobSubmitResponseResource } from "../models/job.types";
import StringUtils from "../../../utils/StringUtils";
import qs from "qs";

export default class JobRouteUtils {
  static toScreen(queryParams: any) {
    return ["/jobs", new URLSearchParams(queryParams)].join("?");
  }

  static toListScreen(queryParams: any) {
    return ["/jobs/list", new URLSearchParams(queryParams)].join("?");
  }

  static toJobsSearchScreen(params?: {
    search?: string | null;
    categoryIds?: number[];
  }) {
    const query = qs.stringify(
      {
        search: params?.search || undefined,
        categoryIds: params?.categoryIds,
      },
      {
        arrayFormat: "comma",
        skipNulls: true,
      }
    );
    return `/jobs-search${query ? `?${query}` : ""}`;
  }

  static toDetailUrl(jobResource: JobResource | JobSubmitResponseResource) {
    return `/jobs/${StringUtils.slugify(jobResource.name)}-${
      jobResource.jobId
    }`;
  }

  static toJobDetailUrlFromChat(jobId?: number, jobName?: string) {
    return `/jobs/${StringUtils.slugify(jobName || "")}-${jobId}`;
  }

  static toAddScreen() {
    return `/jobs/add`;
  }

  static toEditUrl(jobResource: JobResource) {
    return `/jobs/edit/${jobResource.jobId}`;
  }

  static toApplyUrl(jobResource: JobResource) {
    return `/jobs/apply/add/${jobResource.jobId}`;
  }
}
