import { loginUser, logout, powerList } from './service';
import umiRequest from 'umi-request';

export default {
  namespace: 'login',
  state: {
    
  },
  effects: {
    * loginUser({ payload }, { call, put }) {
      const response = yield call(loginUser, payload);
      return response;
    },
    * logout({ payload }, { call, put }) {
      const response = yield call(logout, payload);
    },
    * powerList({ payload }, { call, put }) {
      const response = yield call(powerList, payload);
      return response;
    },
  },
  reducers: {
    
  },
};
