import axios from 'axios';
import { Block, Notify } from 'notiflix';
import { getAccessToken } from '../utils';

const $api = axios.create({
   baseURL: process.env.REACT_APP_API_URL,
});

$api.interceptors.request.use(config => {
   config.headers.Authorization = `Bearer ${getAccessToken()}`;

   if (config?.notify) {
      Block.hourglass(config?.notify, 'Please wait...');
   }

   if (!getAccessToken()) {
      delete config.headers.Authorization;
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

         throw err;
      }

      Notify.failure(err.message);

      throw err;
   },
);

export default $api;
