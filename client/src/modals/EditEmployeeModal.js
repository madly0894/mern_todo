import * as React from 'react';
import * as dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDropzone } from 'react-dropzone';
import Modal from 'react-modal';
import { Avatar, Spinner } from '@chakra-ui/react';
import Input from '../components/Input';
import { editEmployee, getEmployee, getEmployeePicture, uploadEmployeePicture } from '../api/employees.api';
import { defaultValues, validateSchema } from './AddEmployeeModal';
import { QUERY_KEYS, DATE_FORMAT, MODAL_CONTENT_STYLE } from '../helpers/constants';
import Utils from '../helpers/utils';

const EditEmployeeModal = ({ show, onHide }) => {
   const queryClient = useQueryClient();

   const { control, reset, setError, handleSubmit, setValue, watch } = useForm({
      defaultValues,
      resolver: yupResolver(validateSchema),
   });

   const { mutate: mutateGetEmployeeById, isLoading: isLoadingGetEmployeeById } = useMutation({
      mutationFn: getEmployee,
      onSuccess: ({ picturePath, name, surname, dateOfBirth, patronymic }) => {
         reset({
            name,
            surname,
            patronymic,
            dateOfBirth: dayjs(dateOfBirth).format(DATE_FORMAT),
            picture: picturePath,
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
      onSuccess: () => {
         // Invalidate and refetch
         queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EMPLOYEES] });
         // Hide modal
         onHide();
      },
   });

   const {
      mutate: mutateUploadPicture,
      isLoading: isLoadingUploadPicture,
      isSuccess: isSuccessUploadPicture,
   } = useMutation({
      mutationFn: uploadEmployeePicture,
      onSuccess: (data, variables) => {
         // Invalidate and refetch
         queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PICTURE] });
      },
   });

   const { data, isFetching: isFetchingGetPicture } = useQuery({
      queryKey: [QUERY_KEYS.PICTURE],
      queryFn: () => getEmployeePicture(show),
      onSuccess: (data, variables, context) => {
         // Invalidate and refetch
         isSuccessUploadPicture && queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EMPLOYEES] });
      },
      enabled: !!show,
   });

   const { getRootProps, getInputProps, open } = useDropzone({
      accept: {
         'image/*': [],
      },
      onDrop: acceptedFiles => acceptedFiles.length > 0 && mutateUploadPicture({ id: show, picture: acceptedFiles[0] }),
      disabled: isFetchingGetPicture || isLoadingUploadPicture,
      multiple: false,
      noClick: true,
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
         shouldCloseOnOverlayClick={
            !isLoadingGetEmployeeById || !isLoadingEditEmployee || !isFetchingGetPicture || !isLoadingUploadPicture
         }
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
               <div className='top-line'>
                  <div className='avatar-field' {...getRootProps()}>
                     <input {...getInputProps()} />
                     <div className='avatar'>
                        <div className='file-img'>
                           <Avatar size='full' src={data?.picturePath} alt='Photo' loading='lazy' />
                        </div>
                        <span className='edit-av edit' onClick={open}>
                           {isFetchingGetPicture || isLoadingUploadPicture ? (
                              <Spinner />
                           ) : (
                              <i className='material-icons'>edit</i>
                           )}
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
               <button className='action edit-action' type='submit'>
                  Update
               </button>
            </div>
         </form>
      </Modal>
   );
};

export default EditEmployeeModal;
