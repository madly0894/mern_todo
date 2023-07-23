import $api from './api';
import { API_KEYS } from '../helpers/constants';

export const signUp = async body => {
   const response = await $api.post(API_KEYS.SIGN_UP, body, {
      notify: '.form-block',
   });
   return response.data;
};

export const signIn = async body => {
   const response = await $api.post(API_KEYS.SIGN_IN, body, {
      notify: '.form-block',
   });
   return response.data;
};

export const signOut = async () =>
   await $api.post(API_KEYS.SIGN_OUT, {
      notify: '.App',
   });
