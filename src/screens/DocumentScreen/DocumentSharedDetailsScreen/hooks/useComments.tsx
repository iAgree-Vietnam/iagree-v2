import { useQuery } from '@tanstack/react-query';
import DocumentServices from '@/src/data/document/services/DocumentServices';

export default function useComments(documentId?: number) {
  return useQuery({
    queryKey: ['DOCUMENT_COMMENT_LIST', documentId],
    queryFn: () => {
      if (documentId)
        return new DocumentServices().getComments(documentId);
      return []
    },
    initialData: () => [],
  });
}
