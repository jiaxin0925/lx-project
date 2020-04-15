import React, {Component} from 'react';
import {connect} from 'dva';
import {
  Table,
  Button,
  message,
  Form,
  Input,
  Divider,
  Modal,
  TreeSelect,
  Row,
  Col,
  Tooltip,
  Empty,
  Pagination,
  ConfigProvider, Select,
} from 'antd';
import _ from 'lodash';
import Style from './flagsSequence.scss'
import Nodata from "@/assets/images/nodata.png";
import enGB from 'antd/es/locale-provider/en_GB';
const { Option } = Select;
const namespace = 'flagsequence';

const mapStateToProps = (state) => {
  const {leapPoints, geo, create, CountryMessage, tableTotal} = state[namespace];
  return {
    leapPoints,
    geo,
    create,
    CountryMessage,
    tableTotal
  };
};

@connect(mapStateToProps)
@Form.create()
class FlagSequence extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: 'Geo/Reg/Sub Reg/Countries',
        dataIndex: 'Geo/Reg/Sub Reg/Countries',
        key: 'Geo/Reg/Sub Reg/Countries',
        render: (text, record) => {
          return (
            <Tooltip title={record['Geo/Reg/Sub Reg/Country']}>
              <div style={{
                height: 30,
                lineHeight: '30px',
              }}>{record['Geo/Reg/Sub Reg/Country']}</div>
            </Tooltip>
          )
        }
      },
      {
        title: 'Operation',
        key: 'action',
        render: (text, record) => {
          return (
            <span>
             <i
               style={{color: '#1890ff', cursor: 'pointer', fontStyle: 'normal', pointerEvents: this.state.isClick}}
               onClick={e => {this.showEditFlag(e, record).then(r => r);
             }}>Edit</i>
             <Divider type="vertical"/>
             <i
               style={{color: '#1890ff', cursor: 'pointer', fontStyle: 'normal', pointerEvents: this.state.isClick}}
               onClick={ () => {this.setState({deleteModal: true, deleteCurFlag: record})}}
             >Delete</i>
           </span>
          );
        },
      }
    ];

    this.state = {
      visible: false,
      editData: {},
      loading: false,
      value: undefined,
      modalValue: undefined,
      isAdd: false,
      grey: true,
      num: 0,
      flagDescriptions: [],
      inputValue: '',
      flagRepeat: [],
      isFlag: true,
      isFlagGeo: [],
      deleteModal: false,
      deleteCurFlag: {},
      tableLoading: false,
      page: 1,
      pageSize: 10,
      curPageSize: 10,
      pageCurrent: 1,
      isChangePage: false,
      isClick: 'auto'
    };
  }

  componentWillMount = async() => {
    const {dispatch} = this.props;
    dispatch({
      type: `${namespace}/fetchCountryGeo`,
    });
  };

  findTableData = async (district, start, count) => {
    const {dispatch} = this.props;
    const params = {
      district: district,
      start: start,
      count: count
    };
    const res = await dispatch({
      type: `${namespace}/fetchLeapPoints`,
      payload: params
    });
    if (res) {
      this.setState({
        tableLoading: false,
        isChangePage: false,
        curPageSize: count,
        pageCurrent: start + 1,
      });
    }
  };

  onChange = value => {
      this.setState({
        grey: false,
        num: 1500,
        value: value,
        tableLoading: true,
        isChangePage: true
      });
      this.findTableData(value, 0, 10);
  };

  onChangeModal = value => {
    this.props.form.setFieldsValue({
      countries: value,
      district: value
    });
    this.setState({modalValue: value});
  };

  showAddFlag = async () => {
    this.setState({editData: {}, isAdd: true});
    const {dispatch} = this.props;
    let create = await dispatch({
      type: `${namespace}/fetchAllDescription`
    });
    if (!_.isEmpty(create)) {
      this.setState({
        visible: true,
        flagDescriptions: create,

      });
    } else {
      this.setState({
        visible: false,
      });
    }
    const obj = {};
    _.map(create, (key) => {
      obj[key] = ''
    });
    this.props.form.setFieldsValue(Object.assign({
      countries: null
    }, obj));
  };

  showEditFlag = async (e, record) => {
    this.setState({editData: record, isAdd: false, isClick: 'none'});
    const {dispatch} = this.props;
    let create = await dispatch({
      type: `${namespace}/fetchAllDescription`
    });
    if (!_.isEmpty(create)) {
      this.setState({visible: true, flagDescriptions: create});
    } else {
      this.setState({visible: false});
    }
    const obj = {};
    _.map(_.omit(record, ['Geo/Reg/Sub Reg', 'countries']), (key, value) => {
      obj[value] = key
    });
    const splitArr = record['Geo/Reg/Sub Reg/Country'];
    if (splitArr.length > 1) {
      this.setState({
        inputValue: record['Geo/Reg/Sub Reg/Country']
      });
      const arr = [record['Geo/Reg/Sub Reg/Country']];
      this.props.form.setFieldsValue(Object.assign({
        countries: arr
      }, obj));
      this.setState({
        modalValue: Object.assign({
          countries: arr
        }, obj)
      })
    } else {
      this.props.form.setFieldsValue(Object.assign({
        countries: new Array(record['Geo/Reg/Sub Reg/Country'])
      }, obj));
      this.setState({
        modalValue: Object.assign({
          countries: new Array(record['Geo/Reg/Sub Reg/Country'])
        }, obj)
      })
    }
  };

  remove = async () => {
    this.setState({
      deleteModal: false,
      tableLoading: true,
      isChangePage: true,
    });
    const {dispatch, CountryMessage} = this.props;
    const  {deleteCurFlag, page, pageSize, value} = this.state;
    const res = await dispatch({
      type: `${namespace}/deleteCountryFlagSeq`,
      payload: {
        recordKey: deleteCurFlag['Geo/Reg/Sub Reg/Country'],
        value: value ? value : CountryMessage,
        start: (page - 1) * pageSize,
        count: pageSize
      },
    });
    if(res) {
      this.setState({
        deleteModal: false,
        pageCurrent: page,
        curPageSize: pageSize,
        tableLoading: false,
        isChangePage: false
      });
      this.props.form.setFieldsValue({
        a: deleteCurFlag['Geo/Reg/Sub Reg/Country']
      })
    }
  };

  setModalVisible = async (modalVisible) => {
    this.setState({editData: {}, isAdd: true, visible: modalVisible, isClick: 'auto'});
    const {dispatch} = this.props;
    let create = await dispatch({
      type: `${namespace}/fetchAllDescription`
    });
    if (!_.isEmpty(create)) {
      this.setState({ flagDescriptions: create});
    }
    const obj = {};
    _.map(create, (key) => {
      obj[key] = ''
    });
    this.props.form.setFieldsValue(Object.assign({
      countries: null
    }, obj));
  };

  handleOk = (e) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        this.setState({isClick: 'auto', tableLoading: true, visible: false, isChangePage: true});
        const { pageSize, page } = this.state;
        let arr = [];
        Object.keys(values).forEach(function(key) {
          if (values[key] === '') {
            delete values[key];
          }
        });
        const updates = _.map(this.state.flagDescriptions, (flag) => {
          return _.isEmpty(values[flag]) ? {
            flag: flag
          } : {
            flag: flag,
            sequence: values[flag]
          }
        });
        const {dispatch, leapPoints} = this.props;
        if (!this.state.isAdd) {
          dispatch({
            type: `${namespace}/addOrUpdateCountryFlagSeq`,
            payload: {
              district: this.state.inputValue ? this.state.inputValue : values.countries,
              updates: updates,
              start: (page - 1) * pageSize,
              count: this.state.curPageSize
            },
            value: this.state.value ? this.state.value : this.state.constructor
          }).then( () => {
            this.setState({
              pageCurrent: 1,
              tableLoading: false,
              isChangePage: false,
            })
          });
        } else {
          this.setState({
            tableLoading: true
          });
          const curTitle = _.map(leapPoints, (item) => {
            return item['Geo/Reg/Sub Reg/Country']
          });
          const isNewFlag = await dispatch({
            type: `${namespace}/addCountryFlagSeq`,
            payload: {
                district: values.countries,
                updates: updates,
                start: (page - 1) * pageSize,
                count: pageSize
            },
            value: curTitle
          });
          if (isNewFlag === 200) {
            this.setState({
              pageCurrent: 1,
              curPageSize: 10,
              isFlag: true,
              tableLoading: false,
              isChangePage: false,
            })
          }
          if(isNewFlag === 1004) {
            this.setState({
              pageCurrent: 1,
              curPageSize: 10,
              tableLoading: false,
              isChangePage: false,
            });
            message.warning('Flags sequence by Geo/Reg/Sub Reg/Countries is duplicate.');
            return false;
          }

        }
        if (this.state.modalValue) {
          this.setState({visible: false});
        } else {
          message.error('Please select countries!');
          this.setState({visible: true});
        }
      }
    });
  };

  isFlagRepeat = (e) => {
    this.props.form.validateFields((err, values) => {
      if (_.indexOf(_.toArray(values), e.target.value, 0) !== -1 && e.target.value.length > 0) {
        message.warning('The flag sequence you entered repeats');
        this.setState({isFlag: true})
      } else {
        this.setState({isFlag: false})
      }
    })
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

  onShowSizeChange = (pageSize) => {
    const { CountryMessage } = this.props;
    const params = {
      start: (1 - 1) * pageSize,
      count: pageSize,
      district: this.state.value ? this.state.value : CountryMessage,
    };
    this.setState({
      tableLoading: true,
      isChangePage: true,
      pageCurrent: 1,
    });
    this.findTableData(params.district, params.start, Number(params.count));
  };

  onShowPageChange = (page, pageSize) => {
    const { CountryMessage } = this.props;
    const params = {
      start: (page - 1) * pageSize,
      count: pageSize,
      district: this.state.value ? this.state.value : CountryMessage
    };
    this.setState({
      tableLoading: true,
      page: page,
      pageSize: pageSize,
      isChangePage: true,
    });
    this.findTableData(params.district, params.start, params.count);
  };

  render() {
    const {leapPoints, geo, create, CountryMessage, tableTotal} = this.props;
    const {getFieldDecorator} = this.props.form;
    const {loading} = this.state;
    const first = this.columns[0];
    const last = this.columns[this.columns.length - 1];
    this.columns = [];
    this.columns.push(first);
    this.columns.push(last);
    if(leapPoints.length > 0 ) {
      const resetColumns = _.keys(_.omit(leapPoints[0], ['Geo/Reg/Sub Reg/Country']));
      _.map(resetColumns, (col) => {
        this.columns.splice(this.columns.length - 1, 0, {
          title: col,
          dataIndex: col,
          key: col,
        })
      });
    }
    this.columns[0].fixed = 'left';
    this.columns[this.columns.length - 1].fixed = 'right';
    const columns = _.uniqBy(this.columns, 'title');
    let locale = {
      emptyText: this.EmptyComponent,
    };
    return (
      <div className={Style.flag_suquence}>
        <div>Geo/Reg/Sub Reg/Countries:</div>
        {getFieldDecorator('district', {
          initialValue: CountryMessage
        })(
          <TreeSelect
            showSearch
            className={Style.TreeSelect}
            // value={CountryMessage}
            dropdownStyle={{maxHeight: 400, overflowY: 'auto'}}
            treeData={geo}
            placeholder="Please select"
            notFoundContent="No Data"
            treeDefaultExpandAll={false}
            locale={locale}
            onChange={this.onChange}
            disabled={this.state.isChangePage}
          />
        )}

        <Button
          className={Style.CreateBtn}
          type="primary"
          onClick={this.showAddFlag}
          disabled={this.state.isChangePage}
        >
          Create
        </Button>
        <Table
          dataSource={leapPoints}
          locale={locale}
          columns={columns}
          pagination={false}
          loading={this.state.tableLoading}
          scroll={{x: (leapPoints.length > 0 && this.columns.length > 7) ? 1500 : 0}}
          style={{ background: `${this.state.grey ? '#fafafa' : 'white'}`, marginBottom: 30}}
          rowKey={record => record['Geo/Reg/Sub Reg/Country']}
        />
        <ConfigProvider locale={enGB}>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <Pagination
              style={{textAlign: 'center'}}
              // showSizeChanger
              onChange={this.onShowPageChange}
              onShowSizeChange={this.onShowSizeChange}
              defaultCurrent={1}
              current={this.state.pageCurrent}
              pageSize={this.state.curPageSize}
              total={Number(tableTotal)}
              disabled={this.state.isChangePage || (leapPoints <= 0)}
              showTotal={(tableTotal, range) => `${range[0]}-${range[1]} of ${tableTotal} items`}
            />
            <Select
              value={this.state.curPageSize + '/page'}
              disabled={this.state.isChangePage || (leapPoints <= 0)}
              className={Style.curPagetion}
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
        <Modal
          title={this.state.isAdd ? 'Create New Flag Sequence' : 'Edit Flag Sequence'}
          width='700px'
          visible={this.state.visible}
          onOk={() => this.setModalVisible(false)}
          onCancel={() => this.setModalVisible(false)}
          maskClosable={false}
          footer={[
            <Button key="back" onClick={() => this.setModalVisible(false)}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={this.handleOk}
              disabled={this.state.isFlag}
            >
              {this.state.isAdd ? 'Add' : 'Save'}
            </Button>,
          ]}
        >
          <Form onSubmit={this.handleSubmit} className="login-form select-form">
            <Row gutter={24}>
              <Col span={10}>
                {
                  this.state.visible ? <Form.Item label={'Geo/Reg/Sub Reg/Countries:'}>
                    {this.state.isAdd ? getFieldDecorator('countries', {
                      initialValue: this.state.editData['Geo/Reg/Sub Reg/Country'],
                      rules: [{required: true, message: 'Please select countries!'}],
                    })(
                      <TreeSelect
                        showSearch
                        className={Style.TreeSelect}
                        // value={this.state.modalValue}
                        dropdownStyle={{maxHeight: 400, overflowY: 'auto'}}
                        treeData={geo}
                        placeholder="Please select"
                        treeDefaultExpandAll={false}
                        allowClear
                        onChange={this.onChangeModal}
                        disabled={!this.state.isAdd}
                      />
                      ) : getFieldDecorator('curCountries', {
                        initialValue: this.state.inputValue
                    })(<Input disabled/>)
                    }
                  </Form.Item> : ''
                }
              </Col>
            </Row>
            <Row gutter={24}>
              {
                _.map(create, (data, index) => {
                  return <Col span={6}>
                    <Form.Item label={data} key={this.state.editData['Geo/Reg/Sub Reg/Country']}>
                      {getFieldDecorator(data, {
                        initialValue: '',
                        rules: [{
                          required: false,
                          pattern: new RegExp('^[0-9]*$', 'g'),
                          message: 'Please input number'
                        }],
                      })(
                        <Input placeholder="Please input" autoComplete="off" onChange={this.isFlagRepeat} key={index}/>,
                      )}
                    </Form.Item>
                  </Col>
                })
              }
            </Row>
          </Form>
        </Modal>
        <Modal
          title="Delete Flag Sequence"
          maskClosable={false}
          visible={this.state.deleteModal}
          onOk={this.remove}
          onCancel={() => {this.setState({deleteModal: false})}}
          footer={[
            <Button
              style={{color: '#1890ff'}} type="link" ghost
              onClick={ () => {this.setState({deleteModal: false})}}
            >
              No
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={this.remove}
            >
              Yes
            </Button>,
          ]}
        >
          <p>Are you sure you want to remove this Flag Sequence?</p>
          <p>The relationship between this flag and countries and products will be removed at the same time.</p>
        </Modal>
      </div>
    );
  }
}

export default FlagSequence;



