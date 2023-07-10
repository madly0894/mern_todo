import $api from './api';
import { QUERY_KEY } from '../constants';

export const signUp = async body => {
   const response = await $api.post(`${QUERY_KEY.auth}/sign-up`, body, {
      notify: '.form-block',
   });
   return response.data;
};

export const signIn = async body => {
   const response = await $api.post(`${QUERY_KEY.auth}/sign-in`, body, {
      notify: '.form-block',
   });
   return response.data;
};
