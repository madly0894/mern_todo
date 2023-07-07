import React from 'react';
import { useController } from 'react-hook-form';

const Input = ({ name, control, type = 'text', defaultValue = '', ...inputProps }) => {
   const { field, fieldState } = useController({
      control,
      name,
      defaultValue,
   });

   return (
      <div className={`form-group ${fieldState.error ? 'form-group-error' : ''}`}>
         <input {...field} type={type} {...inputProps} />

         {fieldState.error && <p className='error-text'>{fieldState.error.message}</p>}
      </div>
   );
};

export default Input;
