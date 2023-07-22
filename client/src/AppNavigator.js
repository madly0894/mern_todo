import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import UserOnline from './UserOnline';
import HomePage from './pages/Home.page';
import UserOffline from './UserOffline';
import SignInPage from './pages/Auth/SignIn.page';
import SignUpPage from './pages/Auth/SignUp.page';

const AppNavigator = () => (
   <Routes>
      <Route path='/' element={<UserOnline />}>
         <Route index element={<HomePage />} />
      </Route>
      <Route path='/auth' element={<UserOffline />}>
         <Route path='sign-in' element={<SignInPage />} />
         <Route path='sign-up' element={<SignUpPage />} />
      </Route>
      <Route path='*' element={<div>Not found</div>} />
   </Routes>
);

export default AppNavigator;
