import { useQuery } from "@tanstack/react-query";
import { DefinedUseQueryResult } from "@tanstack/react-query/src/types";
import { IntroduceResource } from "@/src/data/introduce/models/introduce.types";
import IntroduceServices from "@/src/data/introduce/services/IntroduceServices";

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
  });
}
