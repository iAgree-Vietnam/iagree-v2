import { useQuery } from "@tanstack/react-query";
import {
  FullJobResource,
  JobDetailInitResource,
} from "../../../../data/job/models/job.types";
import JobServices from "../../../../data/job/services/JobServices";
import { UseQueryResult } from "@tanstack/react-query";
import _ from "lodash"; // 🛑 Đảm bảo lodash được import nếu bạn dùng nó

interface UseSelectedJobProps {
  onSuccess?: (fullJobResource: FullJobResource) => void;
  // Giả định initData là JobDetailInitResource (có thể là FullJobResource)
  initData?: JobDetailInitResource | undefined;
}

// 🟢 Định nghĩa lại kiểu trả về rõ ràng
export default function useSelectedJob(
  jobId: number | undefined, // 🟢 Tối ưu: Cho phép jobId là undefined
  props: UseSelectedJobProps,
  queryKey?: number
): UseQueryResult<JobDetailInitResource> {
  // 🟢 Đưa kiểu trả về vào đây
  const { initData, onSuccess } = props;

  // 🟢 Tối ưu hóa: Xây dựng options để đưa initialData vào
  const options = {
    // 🟢 THAY THẾ CHO PHẦN ĐÃ COMMENT
    ...(initData !== undefined ? { initialData: initData } : {}),
  };

  // 🟢 Tối ưu hóa: Dùng _.isNumber(jobId) và ép kiểu jobId thành number
  const validJobId = _.isNumber(jobId) && jobId > 0 ? jobId : 0;

  return useQuery({
    queryKey: ["JOB_DETAIL_SCREEN", validJobId, queryKey],
    // 🟢 CHỈ GỌI QUERYFN KHI jobId HỢP LỆ
    queryFn: () =>
      validJobId ? new JobServices().getFullInfo(validJobId, {}) : null,

    // 🟢 Kích hoạt chỉ khi jobId là số hợp lệ
    enabled: validJobId > 0,

    // 🟢 Khôi phục và sử dụng initialData
    ...options,

    onSuccess: (data) => {
      // 🟢 Sử dụng _.isFunction an toàn
      if (_.isFunction(onSuccess)) onSuccess(data as FullJobResource);
    },
  });
}
