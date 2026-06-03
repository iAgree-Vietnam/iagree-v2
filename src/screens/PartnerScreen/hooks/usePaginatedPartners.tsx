import { useQuery } from "@tanstack/react-query";
import {
  PartnerFilterParams,
  PartnerResource,
} from "@/src/data/partner/models/partner.types";
import { DatasResource } from "@/src/data/base/models/base.types";
import PartnerServices from "@/src/data/partner/services/PartnerServices";
import StringUtils from "@/src/utils/StringUtils";
import { isEmpty } from "lodash";

interface UsePaginatedPartnersProps {
  filters: PartnerFilterParams;
  sort?: string;
  initData: DatasResource<PartnerResource>;
  per_page?: number;
  enabled?: boolean;

}

export default function usePaginatedPartners(props: UsePaginatedPartnersProps) {
  const { filters, sort, initData, per_page,    enabled = true, // 👈 default true để backward compatible
} = props;

  return useQuery({
    queryKey: ["PARTNERS_SCREEN", filters, sort],
    queryFn: () => {
      const queryParams = {
        per_page: per_page || 12,
        page: filters.page,
        name: filters.search || null,
        position: filters.position || null,
        // locations: filters.locationIds?.join(",") || null,
        location_ids: filters.locationIds?.join(",") || null,
        experience: filters.experienceId || null,
        // tags: filters.tagIds?.join(",") || null,
        tags:  !isEmpty(filters.tagIds)
        ? StringUtils.toPostmanArrayParam(filters.tagIds)
        : null,
        rate: filters.rate || null,
        sort,
        // skills: filters.skillIds?.join(",") || null,
        // skill_ids: filters.skillIds?.join(",") || null,
        skill_ids: !isEmpty(filters.skillIds)
        ? StringUtils.toPostmanArrayParam(filters.skillIds)
        : null,
        // category_projects: filters.categoryIds?.join(",") || null,
        // category_services: filters.categoryServiceIds?.join(",") || null,
        category_project_ids:  !isEmpty(filters.categoryIds)
        ? StringUtils.toPostmanArrayParam(filters.categoryIds)
        : null,

      category_service_ids: filters.categoryServiceIds?.length
        ? filters.categoryServiceIds
        : null,

        // services: filters.serviceIds?.join(",") || null,
        service_ids: !isEmpty(filters.serviceIds)
        ? StringUtils.toPostmanArrayParam(filters.serviceIds)
        : null,
        // languages: filters.languageIds?.join(",") || null,
        // language_ids: filters.languageIds?.join(",") || null,
        language_ids: !isEmpty(filters.languageIds)
        ? StringUtils.toPostmanArrayParam(filters.languageIds)
        : null,
        account_types: filters.accountType || null,
        // accountType: filters.accountType || null,
      };

      return new PartnerServices().get(queryParams);
    },
    initialData: () => initData,
    enabled
  });
}
