import axios from './axios';
import { API_KEY } from '../constants';
import { Block } from 'notiflix';

export const getUsers = async params => {
   Block.hourglass('.App-content', 'Please wait...');
   try {
      const response = await axios.get(API_KEY, {
         params: {
            page: params.pageParam || 1,
            limit: 15,
         },
         signal: params.signal,
      });
      return response.data;
   } catch (err) {
      throw err;
   } finally {
      Block.remove('.App-content');
   }
};
export const getUserById = async id => {
   Block.hourglass('.ReactModal__Content', 'Please wait...');
   try {
      const response = await axios.get(`${API_KEY}/${id}`);
      return response.data;
   } catch (err) {
      throw err;
   } finally {
      Block.remove('.ReactModal__Content');
   }
};
export const addUser = async body => {
   Block.hourglass('.ReactModal__Content', 'Please wait...');
   try {
      await axios.post(`${API_KEY}/add`, body);
      return body;
   } catch (err) {
      throw err;
   } finally {
      Block.remove('.ReactModal__Content');
   }
};
export const editUser = async ({ id, body }) => {
   Block.hourglass('.ReactModal__Content', 'Please wait...');
   try {
      await axios.put(`${API_KEY}/${id}/edit`, body);
   } catch (err) {
      throw err;
   } finally {
      Block.remove('.ReactModal__Content');
   }
};
export const deleteUser = async id => {
   Block.hourglass('.App-content', 'Please wait...');
   try {
      await axios.delete(`${API_KEY}/${id}/delete`);
   } catch (err) {
      throw err;
   } finally {
      Block.remove('.App-content');
   }
};
