import { useQuery } from '@tanstack/react-query';
import jwtDecode from 'jwt-decode';
import { QUERY_KEY } from '../constants';
import Utils from '../utils';

export default function useUser() {
   const token = Utils.getAccessToken();

   const { data } = useQuery({
      queryKey: [QUERY_KEY.user],
      retry: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      initialData: token && jwtDecode(token),
      onError: () => {
         Utils.removeAccessToken();
      },
   });

   return {
      user: data ?? null,
   };
}
