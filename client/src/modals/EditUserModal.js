import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Modal from 'react-modal';
import Input from '../components/Input';
import { API_KEY, DATE_FORMAT, MODAL_CONTENT_STYLE } from '../constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { editUser, getUserById } from '../api/users.api';
import { defaultValues, validateSchema } from './AddUserModal';
import dayjs from 'dayjs';

const EditUserModal = ({ show, onHide }) => {
   const queryClient = useQueryClient();

   const { control, reset, setError, handleSubmit } = useForm({
      defaultValues,
      resolver: yupResolver(validateSchema),
   });

   const { mutate: mutateGetUserById, isLoading: isLoadingGetUserById } = useMutation({
      mutationFn: getUserById,
      onSuccess: data => {
         reset({
            ...data,
            dateOfBirth: dayjs(data.dateOfBirth).format(DATE_FORMAT),
         });
      },
   });

   const { mutate: mutateEditUser, isLoading: isLoadingEditUser } = useMutation({
      mutationFn: editUser,
      onError: error => {
         error.response.data?.errors.forEach(err => {
            setError(err.path, {
               message: err.msg,
            });
         });
      },
      onSuccess: () => {
         // Invalidate and refetch
         queryClient.invalidateQueries({ queryKey: [API_KEY, show] });
         onHide();
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
         shouldCloseOnOverlayClick={!isLoadingEditUser || isLoadingGetUserById}
      >
         <form onSubmit={handleSubmit(validateValues => mutateEditUser({ id: show, body: validateValues }))}>
            <div className='modal-header'>
               <h2>Edit user</h2>
               <button type='button' className='close-action' onClick={onHide}>
                  <i className='material-icons'>clear</i>
               </button>
            </div>

            <div className='modal-content'>
               <Input autoFocus name='name' control={control} placeholder='Name' />
               <Input name='surname' control={control} placeholder='Surname' />
               <Input type='date' name='dateOfBirth' control={control} placeholder='Date of birth' />
            </div>

            <div className='modal-footer'>
               <button className='action edit-action' type='submit'>
                  Update
               </button>
            </div>
         </form>
      </Modal>
   );
};

export default EditUserModal;
