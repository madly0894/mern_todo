import $api from './api';
import { QUERY_KEY } from '../helpers/constants';

export const getUser = async () => {
   const response = await $api.get(QUERY_KEY.user, {
      notify: {
         el: '#root',
         message: 'Please wait...',
      },
   });
   return response.data;
};

export const deleteUser = async () => {
   const response = await $api.delete(QUERY_KEY.user, {
      notify: '.App',
   });
   return response.data;
};
