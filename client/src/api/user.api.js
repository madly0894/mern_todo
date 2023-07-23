import $api from './api';
import { API_KEYS } from '../helpers/constants';

export const getUser = async params => {
   const response = await $api.get(API_KEYS.USER, {
      notify: {
         el: '#root',
         message: 'Please wait...',
      },
   });
   return response.data;
};

export const deleteUser = async () => {
   const response = await $api.delete(API_KEYS.USER, {
      notify: '.App',
   });
   return response.data;
};
