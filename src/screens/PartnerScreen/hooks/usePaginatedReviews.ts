import { useQuery } from '@tanstack/react-query';

import PartnerServices from '@/src/data/partner/services/PartnerServices';
import { PartnerFilterParams, ReviewResource } from '@/src/data/partner/models/partner.types';
import { DatasResource } from '@/src/data/base/models/base.types';
import _ from 'lodash';

interface UsePaginatedReviews {
  partnerId: number;
  filters: Partial<PartnerFilterParams>;
  initData?: DatasResource<ReviewResource>;
}

export function usePaginatedReviews({filters, initData, partnerId}: UsePaginatedReviews) {

  return useQuery({
    queryKey: ['PARTNER_RATING', partnerId, filters],
    queryFn: () => {
      const queryParams = {
        per_page: 3,
        page: filters.page,
        rate: filters.rate,
      };

      return new PartnerServices().getReviews(partnerId,queryParams);
    },
    initialData: () => initData,
  });
}
