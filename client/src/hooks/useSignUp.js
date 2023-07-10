import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { signUp } from '../api/auth.api';
import { QUERY_KEY } from '../constants';
import Utils from '../utils';

export default function useSignUp() {
   const queryClient = useQueryClient();
   const navigate = useNavigate();

   const { mutate: signUpMutation } = useMutation({
      mutationFn: signUp,
      onSuccess: data => {
         // Invalidate and refetch
         Utils.setAccessToken(data.token);
         queryClient.setQueryData([QUERY_KEY.user], jwtDecode(data.token));
         navigate('/');
      },
   });

   return signUpMutation;
}
