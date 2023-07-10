import * as React from 'react';
import { useController } from 'react-hook-form';

const Input = ({ name, control, type = 'text', defaultValue = '', helperText, ...inputProps }) => {
   const { field, fieldState } = useController({
      control,
      name,
      defaultValue,
   });

   return (
      <div className={`form-group ${fieldState.error ? 'form-group-error' : ''}`}>
         <input {...field} type={type} {...inputProps} />

         {(fieldState.error || helperText) && (
            <p className={`helper-text ${fieldState.error ? 'error-text' : ''}`}>
               {fieldState.error?.message || helperText}
            </p>
         )}
      </div>
   );
};

export default Input;
