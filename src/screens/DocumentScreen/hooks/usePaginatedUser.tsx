import { useQuery } from '@tanstack/react-query';

import { DocumentFilterParams } from '@/src/data/document/models/document.types';
import PartnerServices from '@/src/data/partner/services/PartnerServices';

type UsePaginatedUserProps = {
    filters: DocumentFilterParams,
}

export default function usePaginatedUser(props: UsePaginatedUserProps) {

    const {
        filters,
    } = props;

    return useQuery({
        queryKey: ['PARTNERS_SCREEN', filters],
        queryFn: () => {
            const queryParams = {
                per_page: 5,
                page: filters.page,
                name: filters.search || null,
            };

            return new PartnerServices().get(queryParams);
        },
        initialData: () => ({
            items: [],
            total: 0,
        }),
        enabled: !!filters.search?.trim()
    });

}
