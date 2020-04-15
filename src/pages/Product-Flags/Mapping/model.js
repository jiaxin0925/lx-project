import { fetchFlagsByDistrict, dowflags, fetchCancelProgressBar, fetchcheckIsUpload } from './service';
import {fetchCountryGeo} from "@/pages/flags/sequence/service";

export default {
  namespace: 'flagupload',
  state: {
    flags: [],
    geo: [],
    Country: '',
    flag: '',
    curSSE: {},
    isCAllPress: false,
  },
  effects: {
    * fetchCountryGeo(_, { call, put }) {
      const response = yield call(fetchCountryGeo);
      yield put({
        type: 'saveGeo',
        payload: response.values,
      });
    },
    * fetchFlagsByDistrict({ payload }, {call, put}) {
      const response = yield call(fetchFlagsByDistrict, payload);
      yield put({
        type: 'saveFlags',
        payload: response.values,
        Country: payload
      });
      return response;
    },
    * fetchFlags({ payload }, {put}) {
      yield put({
        type: 'saveFlag',
        payload: payload
      })
    },
    * dowflags({payload}, {call}) {
      yield call(dowflags, payload)
    },
    * CanCelProgressBar({payload}, {call}) {
      const response = yield call(fetchCancelProgressBar, payload);
      return response
    },
    * checkIsUpload({payload}, {call}) {
      const response = yield call(fetchcheckIsUpload, payload);
      return response
    }
  },

  reducers: {
    saveGeo(state, action) {
      return { ...state, geo: action.payload };
    },
    saveFlags(state, action) {
      return { ...state, flags: action.payload, Country: action.Country };
    },
    saveFlag(state, action) {
      return { ...state, flag: action.payload };
    },
    saveSee(state, action) {
      return {...state, curSSE: action.payload}
    },
    isCallProgress(state, action) {
      return {...state, isCAllPress : action.payload}
    }
  }
};
