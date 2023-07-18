import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { signIn } from '../api/auth.api';
import { QUERY_KEY } from '../constants';
import Utils from '../utils';

export default function useSignIn() {
   const queryClient = useQueryClient();
   const navigate = useNavigate();

   const { mutate: signInMutation } = useMutation({
      mutationFn: signIn,
      onSuccess: data => {
         // Invalidate and refetch
         Utils.setAccessToken(data.accessToken);
         queryClient.setQueryData([QUERY_KEY.user], jwtDecode(data.accessToken));
         navigate('/');
      },
   });

   return signInMutation;
}
