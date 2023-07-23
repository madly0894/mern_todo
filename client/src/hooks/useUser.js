import { useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '../helpers/constants';
import Utils from '../helpers/utils';
import { getUser } from '../api/user.api';

export default function useUser() {
   return useQuery({
      queryKey: [QUERY_KEY.user],
      queryFn: getUser,
      retry: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      enabled: !!Utils.getAccessToken(),
      keepPreviousData: true,
   });
}
