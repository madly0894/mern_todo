import { Outlet, Navigate, useLocation } from 'react-router-dom';
import useUser from './hooks/useUser';

const UserOffline = () => {
   const location = useLocation();

   const { user } = useUser();

   if (!!user) {
      // Redirect them to the /login page, but save the current location they were
      // trying to go to when they were redirected. This allows us to send them
      // along to that page after they login, which is a nicer user experience
      // than dropping them off on the home page.
      return <Navigate to='/' state={{ location }} replace />;
   }

   return <Outlet />;
};

export default UserOffline;
