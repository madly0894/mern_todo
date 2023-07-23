import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { signIn } from '../api/auth.api';
import { NAVIGATOR_KEYS, QUERY_KEYS } from '../helpers/constants';
import Utils from '../helpers/utils';

export default function useSignIn() {
   const queryClient = useQueryClient();
   const navigate = useNavigate();

   const { mutate: signInMutation } = useMutation({
      mutationFn: signIn,
      onSuccess: data => {
         // Invalidate and refetch
         Utils.setAccessToken(data.accessToken);
         queryClient.setQueryData([QUERY_KEYS.USER], jwtDecode(data.accessToken));
         navigate(NAVIGATOR_KEYS.BASE_URL);
      },
   });

   return signInMutation;
}
