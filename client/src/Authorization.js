import * as React from 'react';
import useUser from './hooks/useUser';

const Authorization = ({ children }) => {
   const { isFetching } = useUser();

   if (isFetching) {
      return 'Loading...';
   }

   return <>{children}</>;
};

export default Authorization;
