import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../api/auth.api';
import jwtDecode from 'jwt-decode';
import { QUERY_KEY } from '../constants';
import { setAccessToken } from '../utils';

export default function useSignIn() {
   const queryClient = useQueryClient();
   const navigate = useNavigate();

   const { mutate: signInMutation } = useMutation({
      mutationFn: signIn,
      onSuccess: data => {
         const user = jwtDecode(data.token);
         // Invalidate and refetch
         setAccessToken(data.token);
         queryClient.setQueryData([QUERY_KEY.user], user);
         navigate('/');
      },
   });

   return signInMutation;
}
