import * as React from 'react';
import * as dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Modal from 'react-modal';
import Input from '../components/Input';
import { QUERY_KEY, DATE_FORMAT, MODAL_CONTENT_STYLE } from '../constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { editEmployee, getEmployeeById } from '../api/employees.api';
import { defaultValues, validateSchema } from './AddEmployeeModal';
import { getOwnYear } from '../utils';

const EditEmployeeModal = ({ show, onHide }) => {
   const queryClient = useQueryClient();

   const { control, reset, setError, handleSubmit } = useForm({
      defaultValues,
      resolver: yupResolver(validateSchema),
   });

   const { mutate: mutateGetEmployeeById, isLoading: isLoadingGetEmployeeById } = useMutation({
      mutationFn: getEmployeeById,
      onSuccess: data => {
         reset({
            ...data,
            dateOfBirth: dayjs(data.dateOfBirth).format(DATE_FORMAT),
         });
      },
   });

   const { mutate: mutateEditEmployee, isLoading: isLoadingEditEmployee } = useMutation({
      mutationFn: editEmployee,
      onError: error => {
         error.response.data?.errors.forEach(err => {
            setError(err.path, {
               message: err.msg,
            });
         });
      },
      onSuccess: (data, variables, context) => {
         // Invalidate and refetch
         queryClient.invalidateQueries({ queryKey: [QUERY_KEY.employees] });
         // Hide modal
         onHide();
      },
   });

   return (
      <Modal
         isOpen={!!show}
         onAfterOpen={() => mutateGetEmployeeById(show)}
         onRequestClose={onHide}
         contentLabel='Edit Employee'
         style={{
            content: MODAL_CONTENT_STYLE,
         }}
         shouldCloseOnOverlayClick={!isLoadingGetEmployeeById || isLoadingEditEmployee}
         closeTimeoutMS={300}
      >
         <form onSubmit={handleSubmit(validateValues => mutateEditEmployee({ id: show, body: validateValues }))}>
            <div className='modal-header'>
               <h3>Edit employee</h3>
               <button type='button' className='close-action' onClick={onHide}>
                  <i className='material-icons'>clear</i>
               </button>
            </div>

            <div className='modal-content'>
               <Input autoFocus name='name' control={control} placeholder='Name' />
               <Input name='surname' control={control} placeholder='Surname' />
               <Input
                  type='date'
                  name='dateOfBirth'
                  control={control}
                  placeholder='Date of birth'
                  min={dayjs(getOwnYear(35)).format(DATE_FORMAT)}
                  max={dayjs(getOwnYear(18)).format(DATE_FORMAT)}
                  helperText='Birth date must be between 18 and 35 years ago'
               />
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

export default EditEmployeeModal;
