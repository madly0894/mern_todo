import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from '../api/user.api';
import { NAVIGATOR_KEYS, QUERY_KEYS } from '../helpers/constants';
import Utils from '../helpers/utils';

export function useDeleteUser() {
   const queryClient = useQueryClient();
   const navigate = useNavigate();

   const { mutate: deleteUserMutation } = useMutation({
      mutationFn: deleteUser,
      onSuccess: () => {
         // Invalidate and refetch
         Utils.removeAccessToken();
         queryClient.setQueryData([QUERY_KEYS.USER], null);
         navigate(NAVIGATOR_KEYS.SIGN_IN);
      },
   });

   return deleteUserMutation;
}
