import $api from './api';
import { QUERY_KEY } from '../helpers/constants';
import Utils from '../helpers/utils';
import jwtDecode from 'jwt-decode';

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

export const refresh = async () => {
   const response = await $api.get(`${QUERY_KEY.auth}/refresh`, {
      Authorization: null,
   });
   const user = jwtDecode(response.data.accessToken);
   return user;
};
