import axios from 'axios';
import { Block, Notify } from 'notiflix';
import { API_KEYS, NAVIGATOR_KEYS, QUERY_KEYS } from '../helpers/constants';
import history from '../helpers/history';
import queryClient from '../helpers/queryClient';
import Utils from '../helpers/utils';

const $api = axios.create({
   withCredentials: true,
   baseURL: process.env.REACT_APP_API_URL,
});

$api.interceptors.request.use(config => {
   config.headers.Authorization = `Bearer ${Utils.getAccessToken()}`;
   config?.notify && Block.hourglass(config.notify.el ?? config.notify, config.notify?.message);
   return config;
});

$api.interceptors.response.use(
   config => {
      config?.data?.message && Notify.success(config.data.message);
      config.config?.notify && Block.remove(config.config.notify.el ?? config.config.notify);
      return config;
   },
   async err => {
      const originalRequest = err?.config;
      originalRequest.notify && Block.remove(originalRequest.notify.el ?? originalRequest.notify);
      if (err?.response) {
         if (err.response.status === 401 && !originalRequest._isRetry) {
            originalRequest._isRetry = true;
            try {
               const response = await axios.get(`${process.env.REACT_APP_API_URL}/${API_KEYS.REFRESH}`, {
                  withCredentials: true,
               });
               Utils.setAccessToken(response.data.accessToken);
               originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
               return axios(originalRequest);
            } catch (e) {
               Utils.removeAccessToken();
               queryClient.setQueryData([QUERY_KEYS.USER], null);
               history.push(NAVIGATOR_KEYS.SIGN_IN);
               Notify.failure(err.response.data?.message);
            }
         } else {
            Notify.failure(err.response.data?.message || `${err.response.status}: ${err.response.statusText}`);
         }
         throw err;
      }
      Notify.failure(err.message);
      throw err;
   },
);

export default $api;
