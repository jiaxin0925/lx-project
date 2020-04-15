import { findProductFlagsPaged , fetchCountryGeo, download, downloadSelected, fetchByCountry, fetchByCountries, updateLeapPoints, updateFlags } from './service';

export default {
  namespace: 'productFlags',
  state: {
    productFlags: [],
    region: [],
    saveFlags: [],
    total: 0,
    ableFlags: [],
    editFlags: [],
    countries: [],
    partNumber: '',
    flags: [],
    sale: [],
    product: [],
    models: [],
    saveModalFlags: [],
  },
  effects: {
    * download({ payload }, {call, put }) {
      yield call(download, payload);
    },

    * downloadSelected({ payload }, {call, put }) {
      yield call(downloadSelected, payload);
    },

    * fetchByCountry({ payload }, {call, put }) {
      const response = yield call(fetchByCountry, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveEditFlags',
          payload: response.values,
          // saveModalFlags:new Array(payload.flags)
          saveModalFlags: payload.flags ? payload.flags.split(',') : payload.flags
        });
        return true;
      }
    },

    * fetchByCountries({ payload }, {call, put }) {
      const response = yield call(fetchByCountries, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveAbleFlags',
          payload: response.values,
        });
        return response;
      }
    },

    * updateLeapPoints({ payload }, {call, put }) {
      const response = yield call(updateLeapPoints, payload);
      if (response.code === 200) {
        return true;
      }
    },

    * updateFlags({ payload }, {call, put }) {
      const response = yield call(updateFlags, payload);
      if (response.code === 200) {
        return true;
      }
    },

    * fetchCountryGeo(_, { call, put }) {
      const response = yield call(fetchCountryGeo);
      yield put({
        type: 'saveRegion',
        payload: response.values,
      });
    },

    * findProductFlagsPaged({ payload }, { call, put }) {
      const response = yield call(findProductFlagsPaged, payload);
      yield put({
        type: 'saveProductFlags',
        payload: {
          total: response.total,
          values: response.values
        }
      });
      return response
    },
    *savePageVal({ payload }, { put }) {
      yield put({
        type: 'savePagValues',
        payload: {
          partNumber: payload.partNumber,
          countries: payload.countries,
          flags: payload.flags,
          sale: payload.sale,
          product: payload.product,
          models: payload.models
        }
      });
    },
    * saveProductVal({ payload } , { put }) {
      yield put({
        type: 'saveProductVals',
        payload: {
          partNumber: payload.partNumber,
          countries: payload.countries,
          flags: payload.flags,
          sale: payload.sale,
          product: payload.product,
          models: payload.models
        }
      })
      return true
    },
  },
  reducers: {
    saveAbleFlags(state, action) {
      return {...state, ableFlags: action.payload}
    },
    saveEditFlags(state, action) {
      return {...state, editFlags: action.payload, saveModalFlags: action.saveModalFlags}
    },
    saveProductFlags(state, action) {
      return { ...state, total: action.payload.total, productFlags: action.payload.values };
    },
    saveRegion(state, action) {
      return { ...state, region: action.payload };
    },
    savePagValues(state, action) {
      return { ...state,
        partNumber: action.payload.partNumber,
        countries: action.payload.countries,
        flags: action.payload.flags,
        sale: action.payload.sale,
        product: action.payload.product,
        models: action.payload.models
      }
    },
    saveProductVals(state, action) {
      return{ ...state,
        partNumber: action.payload.partNumber,
        countries: action.payload.countries,
        flags: action.payload.flags,
        sale: action.payload.sale,
        product: action.payload.product,
        models: action.payload.models
      }
    }
  },
};
