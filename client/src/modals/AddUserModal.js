import React from 'react';
import * as dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Modal from 'react-modal';
import Input from '../components/Input';
import { API_KEY, DATE_FORMAT, MODAL_CONTENT_STYLE } from '../constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addUser } from '../api/users.api';
import { Block } from 'notiflix';

export const validateSchema = yup.object().shape({
   name: yup.string().required('Name field is required'),
   surname: yup.string().required('Surname field is required'),
   dateOfBirth: yup.string().required('Date of birth field is required'),
});

export const defaultValues = {
   name: '',
   surname: '',
   dateOfBirth: dayjs().format(DATE_FORMAT),
};

const AddUserModal = ({ show, onHide }) => {
   const queryClient = useQueryClient();

   const { control, reset, setError, handleSubmit, formState } = useForm({
      defaultValues,
      resolver: yupResolver(validateSchema),
   });

   const { mutate: mutateAddUser, isLoading } = useMutation({
      mutationFn: addUser,
      onMutate: () => {
         Block.hourglass('.ReactModal__Content', 'Please wait...');
      },
      onError: (error, variables, context) => {
         error.response.data?.errors.forEach(err => {
            setError(err.path, {
               message: err.msg,
            });
         });
      },
      onSuccess: () => {
         // Invalidate and refetch
         queryClient.invalidateQueries({ queryKey: [API_KEY] });
         onHide();
      },
      onSettled: () => {
         Block.remove('.ReactModal__Content');
      },
   });

   return (
      <Modal
         isOpen={show}
         onRequestClose={() => {
            onHide();
            reset();
         }}
         contentLabel='Add User'
         style={{
            content: MODAL_CONTENT_STYLE,
         }}
         shouldCloseOnOverlayClick={!isLoading}
      >
         <form onSubmit={handleSubmit(mutateAddUser)}>
            <div className='modal-header'>
               <h2>Add user</h2>
               <button type='button' className='close-action' onClick={onHide} disabled={isLoading}>
                  <i className='material-icons'>clear</i>
               </button>
            </div>

            <div className='modal-content'>
               <Input autoFocus name='name' control={control} placeholder='Name' />
               <Input name='surname' control={control} placeholder='Surname' />
               <Input type='date' name='dateOfBirth' control={control} placeholder='Date of birth' />
            </div>

            <div className='modal-footer'>
               <button className='action add-action' type='submit' disabled={isLoading}>
                  Add
               </button>
            </div>
         </form>
      </Modal>
   );
};

export default AddUserModal;
