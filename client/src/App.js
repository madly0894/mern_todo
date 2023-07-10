import * as React from 'react';
import { Route, Routes } from 'react-router-dom';

import Main from './pages/Main';
import SignIn from './pages/Auth/SignIn';
import SignUp from './pages/Auth/SignUp';
import Header from './layouts/Header';
import UserOnline from './UserOnline';
import UserOffline from './UserOffline';

const App = () => (
   <div className='App'>
      <Header />

      <Routes>
         <Route path='/' element={<UserOnline />}>
            <Route index element={<Main />} />
         </Route>
         <Route path='/auth' element={<UserOffline />}>
            <Route path='sign-in' element={<SignIn />} />
            <Route path='sign-up' element={<SignUp />} />
         </Route>
         <Route path='*' element={<div>Not found</div>} />
      </Routes>
   </div>
);

export default App;
