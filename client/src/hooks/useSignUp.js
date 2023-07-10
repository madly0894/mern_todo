import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../api/auth.api';
import jwtDecode from 'jwt-decode';
import { QUERY_KEY } from '../constants';
import { setAccessToken } from '../utils';

export default function useSignUp() {
   const queryClient = useQueryClient();
   const navigate = useNavigate();

   const { mutate: signUpMutation } = useMutation({
      mutationFn: signUp,
      onSuccess: data => {
         const user = jwtDecode(data.token);
         // Invalidate and refetch
         setAccessToken(data.token);
         queryClient.setQueryData([QUERY_KEY.user], user);
         navigate('/');
      },
   });

   return signUpMutation;
}
