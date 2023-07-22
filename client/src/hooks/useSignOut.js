import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { signOut } from '../api/auth.api';
import Utils from '../helpers/utils';

export function useSignOut() {
   const navigate = useNavigate();

   const { mutate: signOutMutation } = useMutation({
      mutationFn: signOut,
      onSuccess: () => {
         // Invalidate and refetch
         Utils.removeAccessToken();
         navigate('/auth/sign-in');
      },
   });

   return signOutMutation;
}
