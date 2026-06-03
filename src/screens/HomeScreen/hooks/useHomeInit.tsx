import { useQuery } from "@tanstack/react-query";
import { HomeInitResource } from "../../../data/home/models/home.types";
import { DefinedUseQueryResult } from "@tanstack/react-query/src/types";
import HomeSuggestServices from "@/src/data/home/services/HomeSuggestServices";

interface UseHomeInitProps {
  initData: Partial<HomeInitResource>;
}
export const SIX_HOURS = 6 * 60 * 60 * 1000; // ms

export default function useHomeInit(
  props: UseHomeInitProps
): DefinedUseQueryResult<HomeInitResource> {
  const initData = props?.initData;

  return useQuery({
    queryKey: ["HOME_SCREEN"],
    queryFn: () => new HomeSuggestServices().init(),
    initialData: () => initData,

    // initialDataUpdatedAt: Date.now(), // đánh dấu là "fresh" ngay bây giờ

    // // cache 4 giờ
    // staleTime: SIX_HOURS, // trong 4h không refetch vì vẫn "fresh"
    // cacheTime: SIX_HOURS, // giữ trong cache 4h sau khi không dùng

    // // tuỳ chọn thêm (đỡ refetch ngoài ý muốn)
    // refetchOnWindowFocus: false,
  });
}
