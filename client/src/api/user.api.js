import $api from './api';
import { API_KEYS, SERIALIZE_OPTIONS } from '../helpers/constants';
import { serialize } from 'object-to-formdata';

export const getUser = async params => {
   const response = await $api.get(API_KEYS.USER, {
      notify: {
         el: '#root',
         message: 'Please wait...',
      },
   });
   return response.data;
};
export const updateUser = async body => $api.put(API_KEYS.UPDATE_USER, body);

export const uploadUserPicture = async picture =>
   $api.patch(API_KEYS.USER_PICTURE, serialize({ picture }, SERIALIZE_OPTIONS));

export const deleteUser = async () =>
   $api.delete(API_KEYS.DELETE_USER, {
      notify: '.App',
   });
