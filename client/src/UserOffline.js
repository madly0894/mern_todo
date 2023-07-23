import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Utils from './helpers/utils';
import { NAVIGATOR_KEYS } from './helpers/constants';

const UserOffline = () => {
   const location = useLocation();

   if (!!Utils.getAccessToken()) {
      // Redirect them to the /login page, but save the current location they were
      // trying to go to when they were redirected. This allows us to send them
      // along to that page after they login, which is a nicer user experience
      // than dropping them off on the home page.
      return <Navigate to={NAVIGATOR_KEYS.BASE_URL} state={{ location }} replace />;
   }

   return <Outlet />;
};

export default UserOffline;
