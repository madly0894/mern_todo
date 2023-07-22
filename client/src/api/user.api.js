import $api from './api';
import { QUERY_KEY } from '../helpers/constants';

export const getUsers = async () => {
   const response = await $api.get(QUERY_KEY.user, {
      notify: '.App',
   });
   return response.data;
};

export const getUser = async id => {
   const response = await $api.get(`${QUERY_KEY.user}/${id}`, {
      notify: '.App',
   });
   return response.data;
};

export const deleteUser = async () => {
   const response = await $api.delete(QUERY_KEY.user, {
      notify: '.App',
   });
   return response.data;
};
