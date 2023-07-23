import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Notify } from 'notiflix';
import Modal from 'react-modal';
import history from './helpers/history';
import queryClient from './helpers/queryClient';

import App from './App';
import Authorization from './Authorization';
import BrowserRouter from './BrowserRouter';

import './styles/index.scss';
import { NAVIGATOR_KEYS } from './helpers/constants';

// The "init()" function can be used to set custom options as globally.
Notify.init({
   width: '300px',
   position: 'right-bottom',
   closeButton: false,
   timeout: 3500,
   clickToClose: true,
   cssAnimationStyle: 'from-right',
});

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
   <BrowserRouter basename={NAVIGATOR_KEYS.BASE_URL} history={history}>
      <QueryClientProvider client={queryClient}>
         {/*Provide the client to your App*/}
         <Authorization>
            <App />
         </Authorization>
         {/* The rest of your application */}
         <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
   </BrowserRouter>,
);
