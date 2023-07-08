import axios from './axios';
import { API_KEY } from '../constants';

export const getUsers = async params => {
   const response = await axios.get(API_KEY, {
      params: {
         page: params.pageParam || 1,
         limit: 15,
      },
      signal: params.signal,
      notify: '.App-content',
   });
   return response.data;
};
export const getUserById = async id => {
   const response = await axios.get(`${API_KEY}/${id}`, {
      notify: '.ReactModal__Content',
   });
   return response.data;
};
export const addUser = body =>
   axios.post(`${API_KEY}/add`, body, {
      notify: '.ReactModal__Content',
   });
export const editUser = ({ id, body }) =>
   axios.put(`${API_KEY}/${id}/edit`, body, {
      notify: '.ReactModal__Content',
   });
export const deleteUser = id =>
   axios.delete(`${API_KEY}/${id}/delete`, {
      notify: '.App-content',
   });
export const deleteAllUsers = ids =>
   axios.delete(`${API_KEY}/delete`, {
      params: {
         ids,
      },
      notify: '.App-content',
   });
