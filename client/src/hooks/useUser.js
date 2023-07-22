import { useQuery } from '@tanstack/react-query';
import jwtDecode from 'jwt-decode';
import { QUERY_KEY } from '../helpers/constants';
import Utils from '../helpers/utils';

export default function useUser() {
   const accessToken = Utils.getAccessToken();

   const { data } = useQuery({
      queryKey: [QUERY_KEY.user],
      // queryFn: getUser,
      retry: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      initialData: accessToken && jwtDecode(accessToken),
      onError: () => {
         Utils.removeAccessToken();
      },
   });

   return {
      user: data ?? null,
   };
}
