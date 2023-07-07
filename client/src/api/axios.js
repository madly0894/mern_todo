import axios from 'axios';
import { Notify } from 'notiflix';

const $api = axios.create({ baseURL: 'http://localhost:8081/api/' });

$api.interceptors.response.use(
   config => {
      if (config.data) {
         const { message } = config.data;

         if (message) {
            Notify.success(message);
         }
      }

      return config;
   },
   async error => {
      if (error.response) {
         Notify.failure(`${error.response.status}: ${error.response.statusText}`);

         throw error;
      }

      Notify.failure(error.message);

      throw error;
   },
);

export default $api;
