import * as React from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from '../../components/Input';
import useSignIn from '../../hooks/useSignIn';

const validationSchema = yup.object().shape({
   username: yup.string().required(),
   password: yup.string().min(6).required(),
});

const SignIn = () => {
   const { control, handleSubmit } = useForm({
      defaultValues: {
         username: '',
         password: '',
      },
      resolver: yupResolver(validationSchema),
   });

   const signInMutation = useSignIn();

   return (
      <div className='form-block'>
         <form onSubmit={handleSubmit(signInMutation)}>
            <div className='modal-header'>
               <h3>Sign In</h3>
            </div>

            <div className='modal-content'>
               <Input autoFocus name='username' control={control} placeholder='Username' />
               <Input name='password' control={control} placeholder='Password' type='password' />
            </div>

            <div className='modal-footer'>
               <button className='action add-action' type='submit'>
                  Sign In
               </button>
            </div>
         </form>
      </div>
   );
};

export default SignIn;
