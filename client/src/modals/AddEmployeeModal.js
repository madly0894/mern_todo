import * as React from 'react';
import * as dayjs from 'dayjs';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Modal from 'react-modal';
import Input from '../components/Input';
import { QUERY_KEY, DATE_FORMAT, MODAL_CONTENT_STYLE } from '../constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addEmployee } from '../api/employees.api';
import Utils from '../utils';
import Dropzone, { useDropzone } from 'react-dropzone';

export const validateSchema = yup.object().shape({
   name: yup.string().required('Name field is required'),
   surname: yup.string().required('Surname field is required'),
   dateOfBirth: yup.string().required('Date of birth field is required'),
});

export const defaultValues = {
   name: '',
   surname: '',
   patronymic: '',
   secretWord: '',
   dateOfBirth: dayjs(Utils.getOwnYear(18)).format(DATE_FORMAT),
};

const AddEmployeeModal = ({ show, onHide }) => {
   const queryClient = useQueryClient();

   const { control, reset, setError, handleSubmit, formState } = useForm({
      defaultValues,
      resolver: yupResolver(validateSchema),
   });

   const { mutate: mutateAddEmployee, isLoading: isLoadingAddEmployee } = useMutation({
      mutationFn: addEmployee,
      onError: error => {
         error.response.data?.errors.forEach(err => {
            setError(err.path, {
               message: err.msg,
            });
         });
      },
      onSuccess: () => {
         // Invalidate and refetch
         queryClient.invalidateQueries({ queryKey: [QUERY_KEY.employees] });
         // Hide modal
         onHide();
      },
   });

   const onDrop = React.useCallback(acceptedFiles => {
      console.log('file here');
   }, []);

   const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

   return (
      <Modal
         isOpen={show}
         onRequestClose={onHide}
         onAfterClose={() => reset(defaultValues)}
         contentLabel='Add Employee'
         style={{
            content: MODAL_CONTENT_STYLE,
         }}
         shouldCloseOnOverlayClick={!isLoadingAddEmployee}
         closeTimeoutMS={300}
      >
         <form onSubmit={handleSubmit(mutateAddEmployee)}>
            <div className='modal-header'>
               <h3>Add employee</h3>
               <button type='button' className='close-action' onClick={onHide}>
                  <i className='material-icons'>clear</i>
               </button>
            </div>

            <div className='modal-content'>
               <div className='top-line'>
                  <div className='avatar-field' {...getRootProps()}>
                     {/* <img src="https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80" alt="avatar"/> */}
                     <input {...getInputProps()} />
                     {isDragActive ? (
                        <p>Drop the files here...</p>
                     ) : (
                        <div className='avatar'>
                           <span className='edit-av'>
                              <i className='material-icons'>edit</i>
                           </span>
                        </div>
                     )}
                  </div>

                  <Input autoFocus name='name' control={control} placeholder='Name*' />
               </div>
               <Input name='surname' control={control} placeholder='Surname*' />
               <Input name='patronymic' control={control} placeholder='Patronymic' />
               <Input name='secretWord' control={control} placeholder='Secret word' />
               <Input
                  type='date'
                  name='dateOfBirth'
                  control={control}
                  placeholder='Date of birth*'
                  min={dayjs(Utils.getOwnYear(35)).format(DATE_FORMAT)}
                  max={dayjs(Utils.getOwnYear(18)).format(DATE_FORMAT)}
                  helperText='Birth date must be between 18 and 35 years ago'
               />
            </div>

            <div className='modal-footer'>
               <button className='action add-action' type='submit'>
                  Add
               </button>
            </div>
         </form>
      </Modal>
   );
};

export default AddEmployeeModal;
