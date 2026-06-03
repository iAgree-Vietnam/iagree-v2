import { useQuery } from '@tanstack/react-query';
import UserServices from '@/src/data/user/services/UserServices';
import { UserFilterParams } from '@/src/data/user/models/user.types';

type UseUserListProps = {
  filters: UserFilterParams;
};

export default function useUserList(props: UseUserListProps) {
  const { filters } = props;

  const queryParams: UserFilterParams = {
    ...filters,
    // page: 1,
    // per_page: 5,
  };

  return useQuery({
    queryKey: ['DOCUMENT_USER_LIST', queryParams],
    queryFn: () => {
      return new UserServices().get(queryParams);
    },

    initialData: () => ({
      items: [],
      total: 0,
    }),
    enabled: !!filters.name,
  });
}
