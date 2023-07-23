import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { signOut } from '../api/auth.api';
import { NAVIGATOR_KEYS, QUERY_KEYS } from '../helpers/constants';
import Utils from '../helpers/utils';

export function useSignOut() {
   const queryClient = useQueryClient();
   const navigate = useNavigate();

   const { mutate: signOutMutation } = useMutation({
      mutationFn: signOut,
      onSuccess: () => {
         // Invalidate and refetch
         Utils.removeAccessToken();
         queryClient.setQueryData([QUERY_KEYS.USER], null);
         navigate(NAVIGATOR_KEYS.SIGN_IN);
      },
   });

   return signOutMutation;
}
