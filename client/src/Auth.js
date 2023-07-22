import * as React from 'react';
import useRefresh from './hooks/useRefresh';
import jwtDecode from 'jwt-decode';

export const AuthContext = React.createContext();
const Auth = ({ children }) => {
   const { data = {}, isFetching } = useRefresh();

   const value = React.useMemo(() => {
      const useData = data?.accessToken && jwtDecode(data.accessToken);
      if (useData) {
         return useData;
      }
      return null;
   }, [data?.accessToken]);

   if (isFetching) {
      return 'Loading...';
   }

   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default Auth;
