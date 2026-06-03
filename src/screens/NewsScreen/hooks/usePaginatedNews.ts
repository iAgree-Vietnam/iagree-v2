import { useQuery } from '@tanstack/react-query';
import _ from 'lodash'; 

import PostServices from '@/src/data/post/services/PostServices';
import { PostFilterParams, PostInitResource } from '@/src/data/post/models/post.types';

interface UsePaginatedNews {
  filters: PostFilterParams;
  initData: PostInitResource;
}

export function usePaginatedNews({filters, initData}: UsePaginatedNews) {

  return useQuery({
    queryKey: ['NEWS_LIST', filters],
    queryFn: () => {
      const queryParams = {
        per_page: 12,
        page: filters.page,
      };

      return new PostServices().get(queryParams);
    },
    initialData: () => initData,
  });
}
