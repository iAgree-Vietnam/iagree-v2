import { useQuery } from "@tanstack/react-query";
import { DefinedUseQueryResult } from "@tanstack/react-query/src/types";
import { IntroduceResource } from "@/src/data/introduce/models/introduce.types";
import IntroduceServices from "@/src/data/introduce/services/IntroduceServices";
import { SIX_HOURS } from "../../HomeScreen/hooks/useHomeInit";

interface UseIntroduceProps {
  initData: IntroduceResource;
}

export default function useIntroduce(
  props: UseIntroduceProps
): DefinedUseQueryResult<IntroduceResource> {
  const { initData } = props;

  return useQuery({
    queryKey: ["INTRODUCE_SCREEN"],
    queryFn: () => new IntroduceServices().introduce(),
    initialData: () => initData,
    staleTime: SIX_HOURS, // trong 4h không refetch vì vẫn "fresh"
    cacheTime: SIX_HOURS, // giữ trong cache 4h sau khi không dùng

    // tuỳ chọn thêm (đỡ refetch ngoài ý muốn)
    refetchOnWindowFocus: false,
  });
}
