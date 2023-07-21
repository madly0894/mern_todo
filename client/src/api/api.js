import axios from 'axios';
import { Block, Notify } from 'notiflix';
import { QUERY_KEY } from '../helpers/constants';
import history from '../helpers/history';
import queryClient from '../helpers/queryClient';
import Utils from '../helpers/utils';

const $api = axios.create({
   withCredentials: true,
   baseURL: process.env.REACT_APP_API_URL,
});

$api.interceptors.request.use(config => {
   config.headers.Authorization = `Bearer ${Utils.getAccessToken()}`;

   if (config?.notify) {
      Block.hourglass(config?.notify, 'Please wait...');
   }

   return config;
});

$api.interceptors.response.use(
   config => {
      if (config.data) {
         const { message } = config.data;

         if (message) {
            Notify.success(message);
         }
      }

      if (config.config?.notify) {
         Block.remove(config.config.notify);
      }

      return config;
   },
   async err => {
      if (err.config?.notify) {
         Block.remove(err.config.notify);
      }

      if (err?.response) {
         Notify.failure(err.response?.data?.message || `${err.response.status}: ${err.response.statusText}`);

         if (err.response.status === 401) {
            Utils.removeAccessToken();
            queryClient.setQueryData([QUERY_KEY.user], null);
            history.push('/auth/sign-in');
         }

         throw err;
      }

      Notify.failure(err.message);

      throw err;
   },
);

export default $api;
