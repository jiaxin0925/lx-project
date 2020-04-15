import { fetchCountryGeo, fetchProgressBar } from './service';
import { fetchCancelProgressBar, fetchcheckIsUpload } from '@/pages/Product-Flags/Mapping/service';

export default {
  namespace: 'leappointsupload',
  state: {
    geo: [],
    CountryMsg: '',
    SSE: {},
  },
  effects: {
    * fetchCountryGeo(_, { call, put }) {
      const response = yield call(fetchCountryGeo);
      yield put({
        type: 'saveGeo',
        payload: response.values,
      });
    },
    * savePagFlag({payload}, {put}) {
      yield put({
        type: 'savePagVal',
        payload: payload
      })
    },
    * ProgressBar({ payload }, {call}) {
      const response = yield call(fetchProgressBar, payload);
      return response
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
    savePagVal(state, action) {
      return { ...state, CountryMsg: action.payload}
    },
    saveSee(state, action) {
      return {...state, curSSE: action.payload}
    }
  }
};
