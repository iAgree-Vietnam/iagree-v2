import { useQuery } from '@tanstack/react-query';
import DocumentServices from '@/src/data/document/services/DocumentServices';

export default function usePaginatedSharedUsers() {

    return useQuery({
        queryKey: ['DOCUMENT_SHARED_USERS'],
        queryFn: () => {
            return new DocumentServices().getShared();
        },
        initialData: () => [],
    });

}
