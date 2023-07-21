import * as React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Confirm } from 'notiflix';
import { useSignOut } from '../hooks/useSignOut';
import useUser from '../hooks/useUser';
import { useDeleteUser } from '../hooks/useDeleteUser';

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

   const { user } = useUser();

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
         <h1 className='title'>{pathname[location.pathname]}</h1>

         {!user ? (
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
