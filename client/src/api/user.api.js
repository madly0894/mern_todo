import $api from './api';
import { QUERY_KEY } from '../constants';

export const getUser = async () => {
   const response = await $api.get(QUERY_KEY.user, {
      notify: '.App',
   });
   return response.data;
};
