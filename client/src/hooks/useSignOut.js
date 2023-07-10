import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { QUERY_KEY } from '../constants';
import Utils from '../utils';
import { signOut } from '../api/auth.api';

export function useSignOut() {
   const queryClient = useQueryClient();
   const navigate = useNavigate();

   const { mutate: signOutMutation } = useMutation({
      mutationFn: signOut,
      onSuccess: () => {
         // Invalidate and refetch
         Utils.removeAccessToken();
         queryClient.setQueryData([QUERY_KEY.user], null);
         navigate('/auth/sign-in');
      },
   });

   return signOutMutation;
}
