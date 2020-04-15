import { fetchCategories, fetchLocals, powerList } from '@/services/header';
import { loadUserPreferences } from '@/utils/preferences';

const initPreferences = loadUserPreferences();

export default {
  namespace: 'header',
  state: {
    categories: [],
    preferences: initPreferences,
    locales: [],
    activeMenu: '',
    isShowprice: true
  },
  effects: {
    * fetchCategories(_, { select, call, put }) {
      const statePreferences = yield select(state => state.header.preferences);
      const response = yield call(fetchCategories, statePreferences);
      yield put({
        type: 'saveCategories',
        payload: response.data,
      });
    },
    * fetchLocals(_, {call, put}) {
      const response = yield call(fetchLocals);
      yield put({
        type: 'saveLocals',
        payload: response.data
      })
    },
    * showPrice({payload}, {put}) {
      yield put({
        type: 'saveShowprice',
        payload: payload
      })
    },
    * updatePreferences({payload}, {put}) {
      yield put({
        type: 'saveUpdatePreferences',
        payload: payload
      })
    },
    * powerList({ payload }, { call, put }) {
      const response = yield call(powerList, payload);
      return response;
    },
  },
  reducers: {
    saveCategories(state, action) {
      return { ...state, categories: action.payload };
    },
    saveLocals(state, action) {
      return { ...state, locales: action.payload };
    },
    saveShowprice(state, action) {
      return { ...state, isShowprice: action.payload }
    },
    saveUpdatePreferences(state, action) {
      return { ...state, preferences: action.payload}
    },
    saveActiveMenu(state, action) {
      return { ...state, activeMenu: action.payload}
    }
  },
};
