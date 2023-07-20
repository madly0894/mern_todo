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

   const [files, setFiles] = React.useState([]);

   const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
      accept: 'image/*',
      onDrop: acceptedFiles => {
         setFiles(
            acceptedFiles.map(file =>
               Object.assign(file, {
                  preview: URL.createObjectURL(file),
               }),
            ),
         );
      },
   });

   const thumbs = files.map(file => (
      <div className='file-img' key={file.name}>
         <img
            src={file.preview}
            onLoad={() => {
               URL.revokeObjectURL(file.preview);
            }}
         />
      </div>
   ));

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
               <div className='top-line' {...getRootProps()}>
                  <div className='avatar-field'>
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
