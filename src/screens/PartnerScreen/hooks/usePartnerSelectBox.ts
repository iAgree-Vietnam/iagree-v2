import { useQuery, UseQueryResult } from '@tanstack/react-query';
import PartnerServices from '@/src/data/partner/services/PartnerServices';
import { PartnerSelectBoxResource } from '@/src/data/partner/models/partner.types';

const defaultDataResource = {
  items: [],
  total: 0,
};

export function usePartnerSelectBox(): UseQueryResult<PartnerSelectBoxResource> {
  return useQuery<PartnerSelectBoxResource>({
    queryKey: ['PARTNER_SELECT_BOX'],
    queryFn: () => new PartnerServices().getSelectBoxes(),
    // queryFn: () => new PartnerServices().getSelectBoxesTest(),
    initialData: () => ({
      // categories: defaultDataResource,
      categories: [],
      categoryServices: [],
      services: [],
      experiences: defaultDataResource,
      languages: defaultDataResource,
      locations: defaultDataResource,
      tags: defaultDataResource,
      // skills: defaultDataResource,
      // banks: defaultDataResource,
      skills: [],
      banks: [],
    }),
  });
}