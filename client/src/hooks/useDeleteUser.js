import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from '../api/user.api';
import { QUERY_KEY } from '../helpers/constants';
import Utils from '../helpers/utils';

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
