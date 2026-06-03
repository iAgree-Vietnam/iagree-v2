import { useQuery } from '@tanstack/react-query';
import JobServices from '@/src/data/job/services/JobServices';

export default function useFavoriteProjects() {
    return useQuery({
        queryKey: ['JOB_FAVORITE'],
        queryFn: () => {
            return new JobServices().getFavoriteList();
        },
    });

}