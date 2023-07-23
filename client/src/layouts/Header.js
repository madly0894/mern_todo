import * as React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Confirm } from 'notiflix';
import { useSignOut } from '../hooks/useSignOut';
import { useDeleteUser } from '../hooks/useDeleteUser';
import { useQueryClient } from '@tanstack/react-query';
import { NAVIGATOR_KEYS, QUERY_KEYS } from '../helpers/constants';

const pathnames = {
   [NAVIGATOR_KEYS.BASE_URL]: (
      <>
         List of <span className='inline-text'>Employees</span>
      </>
   ),
   [NAVIGATOR_KEYS.SIGN_IN]: 'Sign In',
   [NAVIGATOR_KEYS.SIGN_UP]: 'Sign Up',
};

const Header = () => {
   const queryClient = useQueryClient();
   const location = useLocation();

   const user = queryClient.getQueryData([QUERY_KEYS.USER]);

   const signOutMutation = useSignOut();
   const deleteUserMutation = useDeleteUser();

   const signOut = () => {
      Confirm.show('Sign out', 'Are you sure you want to sign out?', 'Yes', 'No', () => {
         signOutMutation();
      });
   };

   const deleteUser = () => {
      Confirm.show('Delete user', `Are you sure to delete ${user.username}?`, 'Yes', 'No', () => {
         deleteUserMutation();
      });
   };

   return (
      <header>
         <h1 className='title'>{pathnames[location.pathname]}</h1>

         {!user ? (
            <ul className='right-block'>
               <li>
                  <NavLink to={NAVIGATOR_KEYS.SIGN_IN}>Sign In</NavLink>
               </li>
               <li>
                  <NavLink to={NAVIGATOR_KEYS.SIGN_UP}>Sign Up</NavLink>
               </li>
            </ul>
         ) : (
            <div className='right-block'>
               <p>
                  {user.name} (@{user.username})
               </p>

               <button className='action delete-action' onClick={deleteUser}>
                  Delete user
               </button>
               <button className='action delete-action' onClick={signOut}>
                  Sign Out
               </button>
            </div>
         )}
      </header>
   );
};

export default Header;
