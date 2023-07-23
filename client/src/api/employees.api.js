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
   const data = await response.data;
   return {
      ...data,
      data: data.data.map(obj => ({
         ...obj,
         picturePath: (obj.picturePath && `${process.env.REACT_APP_BACKEND_URL}/images/${obj.picturePath}`) ?? null,
      })),
   };
};
export const getEmployee = async id => {
   const response = await $api.get(`${API_KEYS.EMPLOYEES}/${id}`, {
      notify: '.ReactModal__Content',
   });
   const data = await response.data;
   return {
      ...data,
      picturePath: (data.picturePath && `${process.env.REACT_APP_BACKEND_URL}/images/${data.picturePath}`) ?? null,
   };
};
export const addEmployee = body =>
   $api.post(API_KEYS.ADD_EMPLOYEE, serialize(body, SERIALIZE_OPTIONS), {
      notify: '.ReactModal__Content',
   });

export const editEmployee = ({ id, body }) =>
   $api.put(API_KEYS.EDIT_EMPLOYEE(id), body, {
      notify: '.ReactModal__Content',
   });
export const deleteEmployee = id =>
   $api.delete(API_KEYS.DELETE_EMPLOYEE(id), {
      notify: '.App-content',
   });
export const deleteEmployees = ids =>
   $api.delete(API_KEYS.DELETE_EMPLOYEES, {
      params: {
         ids,
      },
      notify: '.App-content',
   });
