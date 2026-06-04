import { useQuery } from "@tanstack/react-query";
import JobServices from "../../../data/job/services/JobServices";
import {
  FullJobResource,
  JobResource,
  JobsFilterParams,
} from "../../../data/job/models/job.types";
import { DatasResource } from "../../../data/base/models/base.types";
import { UseQueryResult } from "@tanstack/react-query";
import _, { join } from "lodash";
import { RawJobFilterInfo } from "@/src/data/job/models/job.raw";
import datetimeUtils from "@/src/utils/DatetimeUtils";
import {
  FullJobResourceV2,
  JobResourceV2,
} from "@/src/data/job/models/v2/job.types";
import StringUtils from "@/src/utils/StringUtils";

type usePaginatedJobsProps = {
  filters: JobsFilterParams;
  sort?: string[] | null;
  // initData?: DatasResource<JobResource> & RawJobFilterInfo;
  initData?: DatasResource<JobResourceV2> & RawJobFilterInfo;
  per_page?: number;
  page?: number;
  version?: number;
  targetDisplayCount?: number;
  enabled?: boolean;
};
export default function usePaginatedJobs(
  props: usePaginatedJobsProps
  // ): UseQueryResult<DatasResource<FullJobResource> & RawJobFilterInfo> {
): UseQueryResult<DatasResource<FullJobResourceV2> & RawJobFilterInfo> {
  const {
    filters,
    sort,
    initData,
    per_page,
    targetDisplayCount = 12,
    enabled = true, // 👈 default true để backward compatible
  } = props;

  return useQuery({
    queryKey: [
      "JOBS_SCREEN",
      JSON.stringify(filters),
      sort,
      targetDisplayCount,
    ],
    queryFn: async () => {
      const requestSize = Math.max(targetDisplayCount * 2, 24);

      // const queryParams = {
      //   per_page: per_page || requestSize,
      //   page: filters.page || null,
      //   name: filters.search || null,
      //   category_projects: filters.categoryIds?.join(",") || null,
      //   experience: filters.experienceId || null,
      //   times: filters.timeIds?.join(",") || null,
      //   type: filters.type || null,
      //   status: _.isNumber(filters.statusId)
      //     ? filters.statusId.toString()
      //     : null,
      //   locations: filters?.locationIds?.join(",") || null,
      //   tags: filters.tagIds?.join(",") || null,
      //   sort,
      //   skills: filters.skillIds?.join(",") || null,
      //   category_services: join(filters.categoryServiceIds, ",") || null,
      //   services: join(filters.serviceIds, ",") || null,
      //   //------New query params
      //   // deadline_type: filters?.deadlineType || null, // Loại thời gian: 1 (Theo số ngày), 2 (Ngày cụ thể)
      //   // job_duration_type:
      //   //   filters?.deadlineType !== undefined && filters?.deadlineType === 1
      //   //     ? filters?.jobDurationType || null
      //   //     : null, // Hạn hoàn thành mong muốn (Xuất hiện khi Loại thời gian là 1 (theo số ngày))
      //   // duration:
      //   //   filters?.deadlineType !== undefined && filters?.deadlineType === 1
      //   //     ? filters?.duration || null
      //   //     : null, // Số ngày (Xuất hiện khi Loại thời gian là 1 (theo số ngày))
      //   // start_date:
      //   //   filters?.deadlineType !== undefined && filters?.deadlineType === 2
      //   //     ? filters?.startDate || null
      //   //     : null, // Ngày bắt đầu (Xuất hiện khi Loại thời gian là 2 (ngày cụ thể))
      //   // end_date:
      //   //   filters?.deadlineType !== undefined && filters?.deadlineType === 2
      //   //     ? filters?.endDate || null
      //   //     : null, // Ngày kết thúc (Xuất hiện khi Loại thời gian là 2 (ngày cụ thể))
      //   salary_id: filters?.salaryId || null, //Loại thù lao: 1 (Thoả thuận), 3 (Cố định)
      //   price_min:
      //     filters?.salaryId && filters.salaryId === 1
      //       ? filters?.priceMin || null
      //       : null, // Ngân sách: Từ (VNĐ) (Chỉ áp dụng cho salary_id = 1 (Thoả thuận))
      //   price_max:
      //     filters?.salaryId && filters.salaryId === 1
      //       ? filters?.priceMax || null
      //       : null, // Ngân sách: Đến (VNĐ) (Chỉ áp dụng cho salary_id = 1 (Thoả thuận))
      //   posting_end_date: filters?.postingEndDate
      //     ? datetimeUtils
      //         .getMoment(filters?.postingEndDate, datetimeUtils.LOCAL_DATE)
      //         ?.format(datetimeUtils.BACKEND_DATE_TIME_WITHOUT_HHMMSS)
      //     : null, // Thời hạn ứng tuyển
      //   posted_date_range: filters?.postedDateRange || null, //Thời gian đăng công việc (Hôm nay, trong 3 ngày qua, trong 7 ngày qua, ...)
      //   ...(filters?.statusList ? { statusList: filters?.statusList } : {}),
      // };

      const queryParams = {
        category_project_ids: filters.categoryIds
          ? StringUtils.toPostmanArrayParam(filters.categoryIds)
          : null,
        category_service_ids:filters.categoryServiceIds ? StringUtils.toPostmanArrayParam(
          filters.categoryServiceIds
        ) : null,
        service_ids:filters.serviceIds ?  StringUtils.toPostmanArrayParam(filters.serviceIds) : null,
        skill_ids:filters.skillIds ? StringUtils.toPostmanArrayParam(filters.skillIds) : null,

        per_page: per_page || requestSize,
        page: filters.page || null,
        name: filters.search || null,
        // category_project_ids: filters.categoryIds?.join(",") || null,
        experience: filters.experienceId || null,
        times: filters.timeIds?.join(",") || null,
        type: filters.type || null,
        status: _.isNumber(filters.statusId)
          ? filters.statusId.toString()
          : null,
        locations: filters?.locationIds?.join(",") || null,
        tags: filters.tagIds?.join(",") || null,
        sort,
        // skill_ids: filters.skillIds?.join(",") || null,
        // category_service_ids: join(filters.categoryServiceIds, ",") || null,
        // service_ids: join(filters.serviceIds, ",") || null,
        salary_type: filters?.salaryId || null, //Loại thù lao: 1 (Thoả thuận), 3 (Cố định)
        price_min:
          filters?.salaryId && filters.salaryId === 1
            ? filters?.priceMin || null
            : null, // Ngân sách: Từ (VNĐ) (Chỉ áp dụng cho salary_id = 1 (Thoả thuận))
        price_max:
          filters?.salaryId && filters.salaryId === 1
            ? filters?.priceMax || null
            : null, // Ngân sách: Đến (VNĐ) (Chỉ áp dụng cho salary_id = 1 (Thoả thuận))
        posting_end_date: filters?.postingEndDate
          ? datetimeUtils
              .getMoment(filters?.postingEndDate, datetimeUtils.LOCAL_DATE)
              ?.format(datetimeUtils.BACKEND_DATE_TIME_WITHOUT_HHMMSS_V2)
          : null, // Thời hạn ứng tuyển
        posted_date_range: filters?.postedDateRange || null, //Thời gian đăng công việc (Hôm nay, trong 3 ngày qua, trong 7 ngày qua, ...)
        ...(filters?.statusList ? { statusList: filters?.statusList } : {}),
      };

      // switch (sort) {
      //     case JOB_SORT_PRICE_ASC: {
      //         queryParams.sort = 'price,asc';
      //         break;
      //     }

      //     case JOB_SORT_PRICE_DESC: {
      //         queryParams.sort = 'price,desc';
      //         break;
      //     }
      // }

      // Use Supabase for v2 (default), fall back to legacy API for version=1
      if (props?.version == 1) {
        return new JobServices().get(queryParams) as any;
      }
      return new JobServices().listFromSupabase(queryParams) as any;
    },
    initialData: initData,
    enabled,
  });
}
