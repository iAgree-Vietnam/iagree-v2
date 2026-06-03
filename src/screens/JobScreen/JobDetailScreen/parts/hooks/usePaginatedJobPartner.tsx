import { useQuery } from '@tanstack/react-query';
import {
    PartnerFilterParams,
    PartnerResource,
} from '@/src/data/partner/models/partner.types';
import { FullJobResource } from '@/src/data/job/models/job.types';
import { DatasResource } from '@/src/data/base/models/base.types';
import PartnerServices from '@/src/data/partner/services/PartnerServices';
import { useMemo } from 'react';

interface TestPartnerFilterParams {
    page: number
}

interface TestPartnerParams {
    id: number,
    avatarUrl: string | null,
    name: string,
    country: string,
    title: string,
    skills: string[],
    price: number,
    coverLetter: string | null,
    projectCompleted: FullJobResource[];
}

interface UsePaginatedPartnersProps {
    filters: TestPartnerFilterParams;
    // initData: DatasResource<PartnerResource>;
    initData: TestPartnerParams[];
    per_page?: number;
}

export default function usePaginatedJobPartner(props: UsePaginatedPartnersProps) {
    const { filters, initData, per_page = 5 } = props;

    const paginated = useMemo(() => {
        const startIndex = ((filters.page || 1) - 1) * per_page;
        const endIndex = startIndex + per_page;
        return {
            data: initData.slice(startIndex, endIndex),
            total: initData.length,
        }
    }, [filters.page, per_page, initData]);

    return {
        data: paginated
    }

    // return useQuery({
    //     queryKey: ['PARTNERS_SCREEN', filters],
    //     queryFn: () => {
    //         const queryParams = {
    //             per_page: per_page || 12,
    //             page: filters.page,
    //             name: filters.search || null,
    //             position: filters.position || null,
    //             locations: filters.locationIds?.join(',') || null,
    //             categories: filters.categoryIds?.join(',') || null,
    //             experience: filters.experienceId || null,
    //             tags: filters.tagIds?.join(',') || null,
    //             rate: filters.rate || null,
    //         };

    //         return new PartnerServices().get(queryParams);
    //     },
    //     initialData: () => initData,
    // });
}
