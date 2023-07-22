import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../api/auth.api';
import Utils from '../helpers/utils';

export default function useSignUp() {
   const navigate = useNavigate();

   const { mutate: signUpMutation } = useMutation({
      mutationFn: signUp,
      onSuccess: data => {
         // Invalidate and refetch
         Utils.setAccessToken(data.accessToken);
         navigate('/');
      },
   });

   return signUpMutation;
}
