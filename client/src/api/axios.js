import axios from 'axios';
import { Block, Notify } from 'notiflix';

const $api = axios.create({ baseURL: 'http://localhost:8081/api/' });

$api.interceptors.request.use(config => {
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

      if (err.response) {
         Notify.failure(`${err.response.status}: ${err.response.statusText}`);
         throw err;
      }

      Notify.failure(err.message);

      throw err;
   },
);

export default $api;
