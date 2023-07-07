import axios from './axios';
import { API_KEY } from '../constants';
import { Block } from 'notiflix';

export const getUsers = async () => {
   Block.hourglass('.table', 'Please wait...');

   try {
      const { data } = await axios.get(API_KEY);

      return data;
   } catch (err) {
      throw err;
   } finally {
      Block.remove('.table');
   }
};
export const getUserById = id => axios.get(`${API_KEY}/${id}`);
export const addUser = body => axios.post(`${API_KEY}/add`, body);
export const editUser = ({ id, body }) => axios.put(`${API_KEY}/${id}/edit`, body);
export const deleteUser = id => axios.delete(`${API_KEY}/${id}/delete`);
