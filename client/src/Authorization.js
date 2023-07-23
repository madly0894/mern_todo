import * as React from 'react';
import useUser from './hooks/useUser';

const Authorization = ({ children }) => {
   const { isFetching, isError } = useUser();

   if (isFetching || isError) {
      return null;
   }

   return <>{children}</>;
};

export default Authorization;
