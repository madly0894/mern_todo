import * as React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSignOut } from '../hooks/useSignOut';
import { getAccessToken, removeAccessToken } from '../utils';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '../constants';
import jwtDecode from 'jwt-decode';

const pathname = {
   '/': (
      <>
         List of <span className='inline-text'>Employees</span>
      </>
   ),
   '/auth/sign-in': 'Sign In',
   '/auth/sign-up': 'Sign Up',
};

const Header = () => {
   const location = useLocation();

   const token = getAccessToken();

   const { data } = useQuery({
      queryKey: [QUERY_KEY.user],
      retry: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      initialData: token && jwtDecode(token),
      onError: () => {
         removeAccessToken();
      },
   });

   const onSignOut = useSignOut();

   return (
      <header>
         <h1 className='title'>{pathname[location.pathname]}</h1>

         {!token ? (
            <ul className='right-block'>
               <li>
                  <NavLink to='/auth/sign-in'>Sign In</NavLink>
               </li>
               <li>
                  <NavLink to='/auth/sign-up'>Sign Up</NavLink>
               </li>
            </ul>
         ) : (
            <div className='right-block'>
               <p>
                  {data.name} (@{data.username})
               </p>

               <button className='action delete-action' onClick={onSignOut}>
                  Sign Out
               </button>
            </div>
         )}
      </header>
   );
};

export default Header;
