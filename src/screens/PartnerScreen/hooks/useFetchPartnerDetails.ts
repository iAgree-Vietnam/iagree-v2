import { useQuery } from '@tanstack/react-query';

import PartnerServices from '@/src/data/partner/services/PartnerServices';

export function useFetchPartnerDetails(partnerId?: number) {

    return useQuery({
        queryKey: ['FETCH_PARTNER_DETAILS', partnerId],
        queryFn: () => new PartnerServices().getFullInfo(partnerId),
        enabled: Boolean(partnerId),
    });

}
