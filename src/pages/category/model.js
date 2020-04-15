// import { fetchCategory, deleteCategory, editCategory, dragCategory, addCategory, searchCategory, getEditCategory, transferCategory, editCategorySearch, batchCategory } from './service';
import { deleteCategory, editCategory, dragCategory, addCategory, searchCategory, getEditCategory, transferCategory, editCategorySearch, batchCategory } from './service';
import umiRequest from 'umi-request';

export default {
  namespace: 'category',
  state: {
    categoryLeft: [],
    categoryRight: []
  },
  effects: {
    * batchCategory({ payload }, { call, put }) {
      const response = yield call(batchCategory, payload);
      return response.value
    },


    // * fetchCategory({ payload }, { call, put }) {
    //   const response = yield call(fetchCategory, payload);
    //   yield put({
    //     type: 'saveCategoryLeft',
    //     payload: response.value.left,
    //   });
    //   yield put({
    //     type: 'saveCategoryRight',
    //     payload: response.value.right,
    //   });
    //   return true;
    // },
    * deleteCategory({ payload }, { call, put }) {
      const response = yield call(deleteCategory, payload);
      return response;
    },
    * editCategory({ payload }, { call, put }) {
      const response = yield call(editCategory, payload);
      return response
    },
    * editCategorySearch({ payload }, { call, put }) {
      const response = yield call(editCategorySearch, payload);
      return response
    },
    * addCategory({ payload }, { call, put }) {
      const response = yield call(addCategory, payload);
      return response
    },
    * dragCategory({ payload }, { call, put }) {
      const response = yield call(dragCategory, payload);
      return response;
    },
    * searchCategory({ payload }, { call, put }) {
      const response = yield call(searchCategory, payload);
      // if(response.code == 200){
      //   yield put({
      //     type: 'searchCategoryLeft',
      //     payload: response.value.left,
      //   });
      //   yield put({
      //     type: 'searchCategoryRight',
      //     payload: response.value.right,
      //   });
      // }
      return response;
    },
    * getEditCategory({ payload }, { call, put }) {
      const response = yield call(getEditCategory, payload);
      return response.value;
    },
    * transferCategory({ payload }, { call, put }) {
      const response = yield call(transferCategory, payload);
      return response;
    },
  },
  reducers: {
    // saveCategoryRight(state, action) {
    //   return { ...state, categoryRight: action.payload };
    // },
    // saveCategoryLeft(state, action) {
    //   return { ...state, categoryLeft: action.payload };
    // },
    // searchCategoryRight(state, action) {
    //   return { ...state, categoryRight: action.payload };
    // },
    // searchCategoryLeft(state, action) {
    //   return { ...state, categoryLeft: action.payload };
    // }
  },

};
