import React, {Component} from 'react';
import {connect} from 'dva';
import { Table, Button, Form, Spin, Empty, Select, DatePicker, ConfigProvider, Pagination } from 'antd';
import _ from 'lodash'
import Nodata from "@/assets/images/nodata.png";
import enGB from 'antd/es/locale-provider/en_GB';
import Styles from './audit.scss';

const { Option } = Select;
const { RangePicker } = DatePicker;
const namespace = 'User';
const mapStateToProps = (state) => {
  const {AuditData, Object, Operator, tableTotal, curObject, AuditTime, curOperation, curOperator, curStartTime, curEndTime, saveTableObjectValue} = state[namespace];
  return {
    AuditData,
    Operator,
    Object,
    tableTotal,
    curObject,
    AuditTime,
    curOperation,
    curOperator,
    curStartTime,
    curEndTime,
    saveTableObjectValue
  };
};

@connect(mapStateToProps)
@Form.create()
class User extends Component {

  constructor(props) {
    super(props);
    this.columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: 'Object',
        dataIndex: 'Object',
        key: 'Object',
        render: text => (<span>{this.props.saveTableObjectValue}</span>)
      },
      {
        title: 'Operation',
        dataIndex: 'operation',
        key: 'Operation',
      },
      {
        title: 'Operator',
        dataIndex: 'operator',
        key: 'Operator',
      },
      {
        title: 'Operate data',
        dataIndex: 'data',
        key: 'Operate data',
        width: '500px',
        render: data => (
          <div>{JSON.stringify(data, null, 2)}</div>
        ),
      },
      {
        title: 'Operate time',
        dataIndex: 'operateTime',
        key: 'Operate time',
      },
    ];

    this.state = {
      visible: false,
      current: 1,
      object: undefined,
      operator: undefined,
      operation: undefined,
      startTime: undefined,
      endTime: undefined,
      tableObject: undefined,
      loading: false,
      isSearch: true,
      page: 0,
      pageSize: 10,
      curPageSize: 10,
      pageCurrent: 1,
    }
  }

  componentWillMount = async() => {
    const { dispatch, curObject } = this.props;
    dispatch({
      type: `${namespace}/fetchByTable`,
    });
    if (curObject.length > 0 || this.state.object !== undefined) {
      this.setState({
        isSearch: false
      })
    }
  };

  EmptyComponent = () => {
    return (
      <Empty
        description={
          <span style={{display: 'flex', flexDirection: 'column'}}>
            <b>We didn’t find any results</b>
            <span>Try checking your spelling or using other query conditions</span>
          </span>
        }
        image={Nodata}
      >
      </Empty>
    )
  };

  fetchTableDate = async (page, pageSize) => {
    const { dispatch, curObject, curOperator, curOperation, curStartTime, curEndTime} = this.props;
    const { object, operator, operation, startTime, endTime } = this.state;
    const params = {
      start: (page - 1) * pageSize,
      count: pageSize,
      object:  object ? object : curObject,
      operator: curOperator ? curOperator : operator,
      operation: curOperation ? curOperation : operation,
      startTime: curStartTime ? curStartTime : startTime,
      endTime: curEndTime ? curEndTime : endTime
    };
    Object.keys(params).forEach(function(key){
      if(params[key] === undefined || params[key] === '') {
        delete params[key]
      }
    });
    const res = await dispatch({
      type: `${namespace}/fetchAuditDate`,
      payload: params
    });
    if (res){
      this.setState({
        loading: false,
        pageCurrent: page,
        curPageSize: pageSize,
        isSearch: false,
      });
    }
    let objects;
    let objected = object ? object : curObject;
    this.props.Object.forEach((item)=>{
      if(item.table == objected){
        objects = item.name
      }
    });
    await dispatch({
      type: `${namespace}/saveTableObject`,
      payload: objects
    });
  };

  onShowPageChange = (page, pageSize) => {
    this.setState({loading: true, isSearch: true });
    this.fetchTableDate(page, pageSize);
  };

  onShowSizeChange = (pageSize) => {
    this.setState({loading: true, isSearch: true });
    this.fetchTableDate(1, pageSize);
  };

  handBtnSubmitForm = () => {
    this.setState({loading: true, isSearch: true});
    this.fetchTableDate(1, 10);
  };

  saveAuditPageData = (value) => {
    const { dispatch, curOperator ,curOperation, curStartTime, curEndTime, curObject} = this.props;
    dispatch({
      type: `${namespace}/saveAuditPage`,
      payload: {
        curObject: curObject,
        curOperator: curOperator,
        curOperation: curOperation,
        curStartTime: curStartTime,
        curEndTime: curEndTime
      }
    });
  };

  onOkTime = () => {
    this.saveAuditPageData();
  };

  changeTime = (date, dateString) => {
    if (dateString) {
      this.setState({
        startTime: dateString[0],
        endTime: dateString[1]
      });
    }else {
      this.setState({
        startTime: '',
        endTime: ''
      });
    }
  };

  Object_handleChange = async (value) => {
    if(value){
      this.setState({
        object: value,
        isSearch: false
      });
      const { dispatch, curOperator ,curOperation, curStartTime, curEndTime} = this.props;
      let obj_value;
      if(value == "a"){
        obj_value = "product_flag_mapping";
      }else if(value == "b"){
        obj_value = "product_leappoint_mapping";
      }else{
        obj_value = value;
      }
      const res = await dispatch({
        type: `${namespace}/fetchByOperator`,
        payload: obj_value
      });
      if(res){
        dispatch({
          type: `${namespace}/saveAuditPage`,
          payload: {
            curObject: value,
            curOperator: curOperator,
            curOperation: curOperation,
            curStartTime: curStartTime,
            curEndTime: curEndTime
          }
        });
      }
    }else {
      this.setState({
        isSearch: true,
        object: ''
      })
    }
  };

  Operation_handleChange = (value) => {
    if (value) {
      this.setState({operation: value});
      const { dispatch, curObject, curOperator, AuditTime  } = this.props;
      dispatch({
        type: `${namespace}/saveAuditPage`,
        payload: {
          curObject: curObject,
          curOperator: curOperator,
          curOperation: value,
          AuditTime: AuditTime
        }
      });
    }else {
      this.setState({operation: ''});
      const { dispatch, curObject, curOperator, AuditTime  } = this.props;
      dispatch({
        type: `${namespace}/saveAuditPage`,
        payload: {
          curObject: curObject,
          curOperator: curOperator,
          curOperation: '',
          AuditTime: AuditTime
        }
      });
    }
  };

  Operator_handleChange = (value) => {
    if (value) {
      this.setState({operator: value});
      const { dispatch, curObject ,curOperation, AuditTime } = this.props;
      dispatch({
        type: `${namespace}/saveAuditPage`,
        payload: {
          curObject: curObject,
          curOperator: value,
          curOperation: curOperation,
          AuditTime: AuditTime
        }
      });
    }else {
      this.setState({operator: ''});
      const { dispatch, curObject ,curOperation, AuditTime } = this.props;
      dispatch({
        type: `${namespace}/saveAuditPage`,
        payload: {
          curObject: curObject,
          curOperator: '',
          curOperation: curOperation,
          AuditTime: AuditTime
        }
      });
    }
  };
  render() {
    const {getFieldDecorator} = this.props.form;
    const { AuditData, Object, Operator, curObject, curOperator, curOperation, tableTotal } = this.props;
    let ObjectOptions = _.uniq(Object).map(obj => {
      if(obj.name == "Edit Flags In Product Flags/Leap Points"){
        obj.table = "a";
      }else if(obj.name == "Edit Leap Points In Product Flags/Leap Points"){
        obj.table = "b";
      }
      return <Option value={obj.table} label={obj.name}>{obj.name}</Option>
    });
    let OperatorOptions = _.uniq(Operator).map(ope => <Option value={ope} label={ope}>{ope}</Option>);
    let locale = {
      emptyText: this.EmptyComponent,
    };
    return (
      <Spin size="large"
            style={{
              position: 'absolute',
              top: '50%',
            }}
            spinning={false}
      >
        <div className={Styles.User}>
          <Form labelCol={{ span: 5 }} className={Styles.fromOption}>
            <Form.Item colon={false} label="Time:">
              {getFieldDecorator('Time', {
              })(
                <RangePicker
                  showTime={{ format: 'HH:mm:ss' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder={['Start Time', 'End Time']}
                  onOk={this.onOkTime}
                  onChange={this.changeTime}
                  style={{width: '230px', marginLeft: 20}}
                />
                )}
            </Form.Item>
            <Form.Item
              colon={false}
              label="Object:"
              style={{marginLeft: 41}}
            >
              {getFieldDecorator('Object', {
                initialValue: curObject ? curObject : undefined,
                rules: [{
                  required: true,
                  message: 'Please select an object!'
                }],
              })(
                <Select
                  onChange={this.Object_handleChange}
                  notFoundContent="No Data"
                  allowClear
                  placeholder="Please select an object"
                  style={{marginLeft: 18}}
                >
                  {ObjectOptions}
                </Select>
              )}
            </Form.Item>

          </Form>
          <Form labelCol={{ span: 5 }} className={Styles.fromOptions}>
          <Form.Item colon={false} label="Operation:">
            {getFieldDecorator('Operation', {
              initialValue: curOperation ? curOperation : undefined
            })(
              <Select
                onChange={this.Operation_handleChange}
                allowClear
                placeholder="Please select an action item"
                style={{marginLeft: 15}}
              >
                <Option value="INSERT">INSERT</Option>
                <Option value="DELETE">DELETE</Option>
                <Option value="UPDATE">UPDATE</Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item
            colon={false}
            label="Operator:"
            style={{marginLeft: 14}}
          >
            {getFieldDecorator('Operator', {
              initialValue: curOperator ? curOperator : undefined
            })(
              <Select
                allowClear
                onChange={this.Operator_handleChange}
                notFoundContent="No Data"
                placeholder="Please select an operator"
                style={{marginLeft: 15}}
              >
                {OperatorOptions}
              </Select>
            )}
          </Form.Item>
          </Form>
          <Form labelCol={{span: 1}}>
            <Form.Item colon={false}>
              <Button
                type="primary"
                disabled={this.state.isSearch || this.state.object > 0}
                onClick={this.handBtnSubmitForm}
              >
                Search
              </Button>
            </Form.Item>
          </Form>
          <Table
            dataSource={AuditData}
            loading={this.state.loading}
            locale={locale}
            pagination={false}
            columns={this.columns}
            rowKey={record => record.id}
            style={{marginBottom: 30}}
          />
          <ConfigProvider locale={enGB}>
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <Pagination
                style={{textAlign: 'center'}}
                onChange={this.onShowPageChange}
                onShowSizeChange={this.onShowSizeChange}
                defaultCurrent={1}
                pageSize={this.state.curPageSize}
                current={this.state.pageCurrent}
                total={AuditData.length <= 0 ? 0 : tableTotal}
                disabled={AuditData.length <= 0}
                showTotal={(tableTotal, range) => `${range[0]}-${range[1]} of ${tableTotal} items`}
              />
              <Select
                value={this.state.curPageSize + '/page'}
                disabled={this.state.isChangePage || (AuditData <= 0)}
                className={Styles.curPagetion}
                style={{ width: 120 }}
                onChange={this.onShowSizeChange}
              >
                <Option value="10">10/page</Option>
                <Option value="20">20/page</Option>
                <Option value="30">30/page</Option>
                <Option value="40">40/page</Option>
              </Select>
            </div>
          </ConfigProvider>
        </div>
      </Spin>
    )
  }
}

export default User;
