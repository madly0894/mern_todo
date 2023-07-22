import { useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '../helpers/constants';
import Utils from '../helpers/utils';
import { refresh } from '../api/auth.api';

export default function useRefresh() {
   return useQuery({
      queryKey: [QUERY_KEY.user],
      queryFn: refresh,
      retry: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      onError: () => {
         Utils.removeAccessToken();
      },
      enabled: !!Utils.getAccessToken(),
   });
}
