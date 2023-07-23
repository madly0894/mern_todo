import * as React from 'react';
import * as dayjs from 'dayjs';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDropzone } from 'react-dropzone';
import Modal from 'react-modal';
import Input from '../components/Input';
import { addEmployee } from '../api/employees.api';
import { QUERY_KEYS, DATE_FORMAT, MODAL_CONTENT_STYLE } from '../helpers/constants';
import Utils from '../helpers/utils';

export const validateSchema = yup.object().shape({
   name: yup.string().required('Name field is required'),
   surname: yup.string().required('Surname field is required'),
   dateOfBirth: yup.string().required('Date of birth field is required'),
});

export const defaultValues = {
   name: '',
   surname: '',
   patronymic: '',
   picture: null,
   dateOfBirth: dayjs(Utils.getOwnYear(18)).format(DATE_FORMAT),
};

const AddEmployeeModal = ({ show, onHide }) => {
   const queryClient = useQueryClient();

   const { control, reset, setError, handleSubmit, formState, setValue, watch } = useForm({
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
         queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EMPLOYEES] });
         // Hide modal
         onHide();
      },
   });

   const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
      accept: 'image/*',
      onDrop: acceptedFiles => {
         setValue('picture', acceptedFiles[0]);
      },
      multiple: false,
   });

   const picture = watch('picture');

   const thumbs = (
      <div className='file-img'>
         <img
            src={picture ? URL.createObjectURL(picture) : ''}
            onLoad={() => {
               return picture ? URL.revokeObjectURL(picture) : '';
            }}
         />
      </div>
   );

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
                     <input {...getInputProps()} />

                     <div className='avatar'>
                        {thumbs}
                        <span className='edit-av'>
                           <i className='material-icons'>edit</i>
                        </span>
                     </div>
                  </div>

                  <div className='main-block'>
                     <h3>Main information</h3>
                     <Input autoFocus name='name' control={control} placeholder='Name*' />
                  </div>
               </div>
               <Input name='surname' control={control} placeholder='Surname*' />
               <Input name='patronymic' control={control} placeholder='Patronymic' />
               <Input
                  type='date'
                  name='dateOfBirth'
                  control={control}
                  placeholder='Date of birth*'
                  min={dayjs(Utils.getOwnYear(45)).format(DATE_FORMAT)}
                  max={dayjs(Utils.getOwnYear(18)).format(DATE_FORMAT)}
                  helperText='Birth date must be between 18 and 45 years ago'
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
