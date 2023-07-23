import * as React from 'react';
import useUser from './hooks/useUser';

const Authorization = ({ children }) => {
   const { isFetching } = useUser();

   if (isFetching) {
      return null;
   }

   return <>{children}</>;
};

export default Authorization;
