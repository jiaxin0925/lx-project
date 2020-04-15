import { fetchByTable, fetchByOperator, fetchAuditDate } from './service';

export default {
  namespace: 'User',
  state: {
    Object: [],
    Operator: [],
    Operation: [],
    AuditData: [],
    AuditTime: [],
    tableTotal: '',
    curObject: '',
    curOperator: '',
    curOperation: '',
    curStartTime: '',
    curEndTime: '',
    saveTableObjectValue: ''

  },
  effects: {
    * fetchByTable({ payload }, { call, put }) {
      const response = yield call(fetchByTable);
      yield put({
        type: 'saveTable',
        payload: response.values
      });
    },
    * fetchByOperator({ payload }, {call, put }) {
      const response = yield call(fetchByOperator, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveOperator',
          payload: response.values,
        });
        return true;
      }
    },
    * fetchAuditDate({ payload }, {call, put}) {
      let objs = payload.object;
      const response = yield call(fetchAuditDate, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveAuditData',
          payload: {
            AuditData: response.values,
            tableTotal: response.total,
            curObject: objs
          }
        })
        return response
      }
    },
    * saveAuditPage({ payload }, { put }) {
      yield put({
        type: 'saveAuditPages',
        payload: {
          AuditTime: payload.startTime + payload.endTime,
          curObject: payload.curObject,
          curOperation: payload.curOperation,
          curOperator: payload.curOperator,
          curStartTime: payload.curStartTime,
          curEndTime: payload.curEndTime
        }
      })
    },
    * saveTableObject( {payload} , {put}) {
      yield put({
        type: 'saveTableObjectVal',
        payload: payload
      })
    }
  },
  reducers: {
    saveTable(state, action) {
      return { ...state, Object: action.payload}
    },
    saveOperator(state, action) {
      return {...state, Operator: action.payload}
    },
    saveAuditData(state, action) {
      return {
        ...state,
        AuditData: action.payload.AuditData,
        tableTotal: action.payload.tableTotal,
        curObject: action.payload.curObject
      }
    },
    saveAuditPages(state, action) {
      return {
        ...state,
        curObject: action.payload.curObject,
        curOperator: action.payload.curOperator,
        curOperation: action.payload.curOperation,
        curStartTime: action.payload.curStartTime,
        curEndTime: action.payload.curEndTime
      }
    },
    saveTableObjectVal(state, action) {
      return{
        ...state,
        saveTableObjectValue: action.payload
      }
    }
  },
};
