import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../api/auth.api';
import Utils from '../helpers/utils';

export default function useSignIn() {
   const navigate = useNavigate();

   const { mutate: signInMutation } = useMutation({
      mutationFn: signIn,
      onSuccess: data => {
         // Invalidate and refetch
         Utils.setAccessToken(data.accessToken);
         navigate('/');
      },
   });

   return signInMutation;
}
