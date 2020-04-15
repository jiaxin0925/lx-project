import { findAll, createOrUpdateFlag, deleteFlag, findByDescription, isEditable } from './service';
import { message } from 'antd';

export default {
  namespace: 'flagDefine',
  state: {
    flags: [],
    tableTotal: ''
  },
  effects: {

    * isEditable({ payload }, { call, put }){
      const response = yield call(isEditable, payload);
        return response.value
    },

    * findAll({ payload }, { call, put }) {
      const response = yield call(findAll, payload);
      yield put({
        type: 'saveFlags',
        payload: response.values,
        tableTotal: response.total
      });
      return response
    },

    * findByDescription({ payload }, { call, put }) {
      const response = yield call(findByDescription, payload);
      yield put({
        type: 'saveFlags',
        payload: response.values,
        tableTotal: response.total
      });
      return response
    },

    * createOrUpdateFlag({ payload }, { call, put }) {
      const response = yield call(createOrUpdateFlag, payload);
      if(response.code >= 1000){
        message.error(response.message);
        return false;
      }
      if (response.code === 200) {
        const response = yield call(findAll, payload);
        yield put({
          type: 'saveFlags',
          payload: response.values,
          tableTotal: response.total
        });
        return response
      }
        return true;
    },

    * deleteFlag({ payload }, { call, put }) {
      const response = yield call(deleteFlag, payload);
      if (response.code === 200) {
        const response = yield call(findAll, payload);
        yield put({
          type: 'saveFlags',
          payload: response.values,
        });
        return response
      }
    },
  },
  reducers: {
    saveFlags(state, action) {
      return { ...state, flags: action.payload, tableTotal: action.tableTotal};
    }
  },
};
