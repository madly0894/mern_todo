import { serialize } from 'object-to-formdata';
import $api from './api';
import { API_KEYS, SERIALIZE_OPTIONS } from '../helpers/constants';

export const getEmployees = async params => {
   const response = await $api.get(API_KEYS.EMPLOYEES, {
      params: {
         page: params.pageParam || 1,
         limit: 15,
      },
      signal: params.signal,
      notify: '.App-content',
   });
   return response.data;
};
export const getEmployee = async id => {
   const response = await $api.get(API_KEYS.EMPLOYEE(id), {
      notify: '.ReactModal__Content',
   });
   return response.data;
};
export const addEmployee = async body =>
   $api.post(API_KEYS.ADD_EMPLOYEE, body, {
      notify: '.ReactModal__Content',
   });

export const editEmployee = async ({ id, body }) =>
   $api.put(API_KEYS.EDIT_EMPLOYEE(id), body, {
      notify: '.ReactModal__Content',
   });
export const deleteEmployee = async id =>
   $api.delete(API_KEYS.DELETE_EMPLOYEE(id), {
      notify: '.App-content',
   });
export const deleteEmployees = async ids =>
   $api.delete(API_KEYS.DELETE_EMPLOYEES, {
      params: {
         ids,
      },
      notify: '.App-content',
   });
export const getEmployeePicture = async id => {
   const response = await $api.get(API_KEYS.EMPLOYEE_PICTURE(id));
   return response.data;
};
export const uploadEmployeePicture = async ({ id, picture }) =>
   $api.put(API_KEYS.EMPLOYEE_PICTURE(id), serialize({ picture }, SERIALIZE_OPTIONS));
