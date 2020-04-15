import { fetchByCountries, fetchCountryGeo, fetchAllDescription, deleteCountryFlagSeq, addOrUpdateCountryFlagSeq, addCountryFlagSeq } from './service';

export default {
  namespace: 'flagsequence',
  state: {
    leapPoints: [],
    geo: [],
    create: [],
    CountryMessage: '',
    tableTotal: ''
  },
  effects: {
    *addCountryFlagSeq({payload}, {call, put}) {
      const response = yield call(addCountryFlagSeq, payload.district, payload.updates);
      if(response.code === 1004) {
        return response.code;
      }
      if (response.code === 200) {
        const response = yield call(fetchByCountries, payload);
        yield put({
          type: 'saveLeapPoints',
          payload: {
            leapPoints: response.values,
            CountryMessage: payload.district,
            tableTotal: response.total
          }
        });
        return response.code
      }
    },
    * addOrUpdateCountryFlagSeq({payload}, { call, put }) {
      const response = yield call(addOrUpdateCountryFlagSeq, payload.district, payload.updates);
      if (response.code === 200) {
        const response = yield call(fetchByCountries, payload);
        yield put({
          type: 'saveLeapPoints',
          payload: {
            leapPoints: response.values,
            CountryMessage: payload.district,
            tableTotal: response.total
          }
        });
      }
    },

    * deleteCountryFlagSeq({ payload }, { call, put }) {
      const response = yield call(deleteCountryFlagSeq, payload.recordKey);
      if (response.code === 200) {
        const response = yield call(fetchByCountries, payload);
        yield put({
          type: 'saveLeapPoints',
          payload: {
            leapPoints: response.values,
            CountryMessage: payload.district,
            tableTotal: response.total
          }
        });
        return true
      }
    },

    * fetchAllDescription(_, { call, put }) {
      const response = yield call(fetchAllDescription);
      if (response.code === 200) {
        yield put({
          type: 'saveFlagDescriptions',
          payload: response.values,
        });
        return response.values;
      }else{
        return null;
      }
    },

    * fetchCountryGeo(_, { call, put }) {
      const response = yield call(fetchCountryGeo);
      yield put({
        type: 'saveGeo',
        payload: response.values,
      });
    },

    * fetchLeapPoints({payload}, { call, put }) {
      const response = yield call(fetchByCountries, payload);
      yield put({
        type: 'saveLeapPoints',
        payload: {
          leapPoints: response.values,
          CountryMessage: payload.district ? payload.district : payload.value,
          tableTotal: response.total
        },
      });
      return response
    },
    * savePagCountry({payload}, { put }) {
      yield put({
        type: 'saveLeapPoints',
        payload: payload.values,
      });
    },
  },
  reducers: {
    saveLeapPoints(state, action) {
      return { ...state,
        leapPoints: action.payload.leapPoints,
        CountryMessage: action.payload.CountryMessage,
        tableTotal: action.payload.tableTotal
      };
    },
    saveGeo(state, action) {
      return { ...state, geo: action.payload };
    },
    saveFlagDescriptions(state, action) {
      return { ...state, create: action.payload };
    }
  },

};
