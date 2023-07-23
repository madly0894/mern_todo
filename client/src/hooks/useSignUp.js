import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { signUp } from '../api/auth.api';
import { NAVIGATOR_KEYS, QUERY_KEYS } from '../helpers/constants';
import Utils from '../helpers/utils';

export default function useSignUp() {
   const queryClient = useQueryClient();
   const navigate = useNavigate();

   const { mutate: signUpMutation } = useMutation({
      mutationFn: signUp,
      onSuccess: data => {
         // Invalidate and refetch
         Utils.setAccessToken(data.accessToken);
         queryClient.setQueryData([QUERY_KEYS.USER], jwtDecode(data.accessToken));
         navigate(NAVIGATOR_KEYS.BASE_URL);
      },
   });

   return signUpMutation;
}
