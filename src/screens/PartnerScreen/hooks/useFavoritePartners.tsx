import { useQuery } from '@tanstack/react-query';
import PartnerServices from '@/src/data/partner/services/PartnerServices';

export default function useFavoritePartners() {

    return useQuery({
        queryKey: ['PARTNERS_FAVORITE'],
        queryFn: () => {
            return new PartnerServices().getFavoriteList();
        },
    });

}
