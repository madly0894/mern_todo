import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { QUERY_KEY } from '../constants';
import Utils from '../utils';
import { deleteUser } from '../api/user.api';

export function useDeleteUser() {
   const queryClient = useQueryClient();
   const navigate = useNavigate();

   const { mutate: deleteUserMutation } = useMutation({
      mutationFn: deleteUser,
      onSuccess: () => {
         // Invalidate and refetch
         Utils.removeAccessToken();
         queryClient.setQueryData([QUERY_KEY.user], null);
         navigate('/auth/sign-in');
      },
   });

   return deleteUserMutation;
}
