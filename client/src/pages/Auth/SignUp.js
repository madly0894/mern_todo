import * as React from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from '../../components/Input';
import useSignUp from '../../hooks/useSignUp';

const validationSchema = yup.object().shape({
   name: yup.string().required(),
   username: yup.string().required(),
   password: yup.string().min(6).required(),
   passwordConfirmation: yup
      .string()
      .oneOf([yup.ref('password'), null])
      .required(),
});

const SignUp = () => {
   const { control, handleSubmit } = useForm({
      defaultValues: {
         name: '',
         username: '',
         password: '',
         passwordConfirmation: '',
      },
      resolver: yupResolver(validationSchema),
   });

   const signUpMutation = useSignUp();

   return (
      <div className='form-block'>
         <form onSubmit={handleSubmit(signUpMutation)}>
            <div className='modal-header'>
               <h3>Sign Up</h3>
            </div>

            <div className='modal-content'>
               <Input autoFocus name='name' control={control} placeholder='Name' />
               <Input name='username' control={control} placeholder='Username' />
               <Input name='password' control={control} placeholder='Password' type='password' />
               <Input
                  name='passwordConfirmation'
                  control={control}
                  placeholder='Password confirmation'
                  type='password'
               />
            </div>

            <div className='modal-footer'>
               <button className='action add-action' type='submit'>
                  Sign Up
               </button>
            </div>
         </form>
      </div>
   );
};

export default SignUp;
