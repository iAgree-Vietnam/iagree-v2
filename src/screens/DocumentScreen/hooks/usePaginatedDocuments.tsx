import { useQuery } from '@tanstack/react-query';
import DocumentServices from '@/src/data/document/services/DocumentServices';
import { DocumentFilterParams } from '@/src/data/document/models/document.types';

type UsePaginatedDocumentsProps = {
    filters: DocumentFilterParams,
}

export default function usePaginatedDocuments(props: UsePaginatedDocumentsProps) {

    const {
        filters,
    } = props;

    return useQuery({
        queryKey: ['DOCUMENT_SCREEN', filters],
        queryFn: () => {
            const queryParams = {
                per_page: 10,
                page: filters.page,
                name: filters.search || null,
            };

            return new DocumentServices().get(queryParams);
        },
        initialData: () => ({
            items: [],
            total: 0,
        }),
    });

}
