import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { signOut } from '../api/auth.api';
import { QUERY_KEY } from '../helpers/constants';
import Utils from '../helpers/utils';

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
