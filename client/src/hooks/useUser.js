import { useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '../helpers/constants';
import Utils from '../helpers/utils';
import { getUser } from '../api/user.api';
import { useSignOut } from './useSignOut';

export default function useUser() {
   const signOutMutation = useSignOut();

   return useQuery({
      queryKey: [QUERY_KEY.user],
      queryFn: getUser,
      retry: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      enabled: !!Utils.getAccessToken(),
      keepPreviousData: true,
      onError: err => {
         if (err.response.status !== 401) {
            signOutMutation();
         }
      },
   });
}
