import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Modal from 'react-modal';
import Input from '../components/Input';
import { API_KEY, DATE_FORMAT, MODAL_CONTENT_STYLE } from '../constants';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteUser, editUser, getUserById } from '../api/users.api';
import { defaultValues, validateSchema } from './AddUserModal';
import { Block, Loading } from 'notiflix';
import dayjs from 'dayjs';

const EditUserModal = ({ show, onHide }) => {
   const queryClient = useQueryClient();

   const { control, reset, setError, handleSubmit, formState } = useForm({
      defaultValues,
      resolver: yupResolver(validateSchema),
   });

   const { mutate: mutateGetUserById } = useMutation({
      mutationFn: getUserById,
      onMutate: () => {
         Block.hourglass('.ReactModal__Content', 'Please wait...');
      },
      onSuccess: ({ data }) => {
         reset({
            ...data,
            dateOfBirth: dayjs(data.dateOfBirth).format(DATE_FORMAT),
         });
      },
      onSettled: () => {
         Block.remove('.ReactModal__Content');
      },
   });

   const { mutate: mutateEditUser, isLoading } = useMutation({
      mutationFn: editUser,
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
         isOpen={!!show}
         onAfterOpen={() => mutateGetUserById(show)}
         onRequestClose={onHide}
         contentLabel='Edit User'
         style={{
            content: MODAL_CONTENT_STYLE,
         }}
         shouldCloseOnOverlayClick={!isLoading}
      >
         <form onSubmit={handleSubmit(validateValues => mutateEditUser({ id: show, body: validateValues }))}>
            <div className='modal-header'>
               <h2>Edit user</h2>
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
               <button className='action edit-action' type='submit' disabled={isLoading}>
                  Update
               </button>
            </div>
         </form>
      </Modal>
   );
};

export default EditUserModal;
