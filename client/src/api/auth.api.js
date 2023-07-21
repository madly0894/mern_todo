import $api from './api';
import { QUERY_KEY } from '../helpers/constants';
import Utils from '../helpers/utils';

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

export const signOut = async () => {
   const response = await $api.post(
      `${QUERY_KEY.auth}/sign-out`,
      { accessToken: Utils.getAccessToken() },
      {
         notify: '.App',
      },
   );
   return response.data;
};
