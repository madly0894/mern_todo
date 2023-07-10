import $api from './api';
import { QUERY_KEY } from '../constants';

export const getEmployees = async params => {
   const response = await $api.get(QUERY_KEY.employees, {
      params: {
         page: params.pageParam || 1,
         limit: 15,
      },
      signal: params.signal,
      notify: '.App-content',
   });
   return response.data;
};
export const getEmployeeById = async id => {
   const response = await $api.get(`${QUERY_KEY.employees}/${id}`, {
      notify: '.ReactModal__Content',
   });
   return response.data;
};
export const addEmployee = body =>
   $api.post(`${QUERY_KEY.employees}/add`, body, {
      notify: '.ReactModal__Content',
   });
export const editEmployee = ({ id, body }) =>
   $api.put(`${QUERY_KEY.employees}/${id}/edit`, body, {
      notify: '.ReactModal__Content',
   });
export const deleteEmployee = id =>
   $api.delete(`${QUERY_KEY.employees}/${id}/delete`, {
      notify: '.App-content',
   });
export const deleteAllEmployees = ids =>
   $api.delete(`${QUERY_KEY.employees}/delete`, {
      params: {
         ids,
      },
      notify: '.App-content',
   });
