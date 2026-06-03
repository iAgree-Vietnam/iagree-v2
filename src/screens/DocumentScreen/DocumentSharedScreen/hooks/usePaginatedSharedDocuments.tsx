import { useQuery } from '@tanstack/react-query';
import DocumentServices from '@/src/data/document/services/DocumentServices';

export default function usePaginatedSharedDocuments() {

    const queryParams = { type: 1 }

    return useQuery({
        queryKey: ['DOCUMENT_SHARED_SCREEN', queryParams],
        queryFn: () => {
            return new DocumentServices().getShared(queryParams);
        },
        initialData: () => [],
    });

}
