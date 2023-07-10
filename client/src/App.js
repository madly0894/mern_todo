import * as React from 'react';
import { Route, Routes } from 'react-router-dom';

import HomePage from './pages/Home.page';
import SignInPage from './pages/Auth/SignIn.page';
import SignUpPage from './pages/Auth/SignUp.page';
import Header from './layouts/Header';
import UserOnline from './UserOnline';
import UserOffline from './UserOffline';

const App = () => (
   <div className='App'>
      <Header />

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
   </div>
);

export default App;
