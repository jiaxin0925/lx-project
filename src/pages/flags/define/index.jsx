import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Button, Input, Divider, Modal, Form, Pagination, Spin, Empty, ConfigProvider, message, Select } from 'antd';
import Styles from './flagdefine.scss';
import Nodata from '../../../assets/images/nodata.png';
import enGB from 'antd/es/locale-provider/en_GB';
const { Option } = Select;

const namespace = 'flagDefine';
const mapStateToProps = (state) => {
  const { flags, tableTotal } = state[namespace];
  return {
    flags,
    tableTotal,
  };
};

@connect(mapStateToProps)
@Form.create()
class DefineFlags extends PureComponent {

  state = {
    visible: false,
    loading: false,
    editData: {},
    isEdit: false,
    searchVal: '',
    tableData: [],
    tableTotal: 0,
    isVal: true,
    deleteVisible: false,
    deleteFlagId: '',
    deleteLoading: false,
    tableLoading: false,
    pageSize: 10,
    page: 0,
    curPageSize: 10,
    isChangePage: false,
    disableColor: '#cccccc',
    isClick: 'auto',
    isValueDisable: false,
    pageCurrent: 1,
    isCreate: false
  };


  componentWillMount = async () => {
    const { flags } = this.props;
    this.setState({
      tableLoading: true,
      isChangePage: true,
      disableColor: '',
    });
    if (flags.length <= 0) {
      this.setState({
        tableLoading: true,
        isChangePage: true,
        disableColor: '',
      });
    }
    this.fetchTableData(undefined, 0 , 10);
  };

  fetchTableData = async (value, start, count) => {
    const { dispatch } = this.props;
    const params = {
      start: start,
      count: count,
    };
    Object.keys(params).forEach(function(key) {
      if (params[key] === undefined || params[key] === '') {
        delete params[key];
      }
    });
    const res = await dispatch({
      type: `${namespace}/findAll`,
      payload: params,
    });
    if (res) {
      this.setState({
        tableData: res.values,
        tableTotal: res.total,
        tableLoading: false,
        isChangePage: false,
      });
    }
    return res.values;
  };

  fetchDescriptionData = async (value, start, count) => {
    const { dispatch } = this.props;
    const params = {
      description: value,
      start: start,
      count: count,
    };
    Object.keys(params).forEach(function(key) {
      if (params[key] === undefined || params[key] === '') {
        delete params[key];
      }
    });
    const res = await dispatch({
      type: `${namespace}/findByDescription`,
      payload: params,
    });
    if (res) {
      this.setState({
        tableData: res.values,
        tableTotal: res.total,
        tableLoading: false,
        isChangePage: false,
      });
    }
    return res.values;
  };

  showAddFlag = () => {
    this.setState({
      editData: {
        description: '',
        color: '#ffffff',
      },
      isVal: false,
      deleteFlagId: '',
      isValueDisable: false,
      isEdit: false,
      visible: true,
      isCreate: true
    });
    this.props.form.setFieldsValue({
      id: '',
      description: '',
      color: '#ffffff',
    });
  };

  showEditFlag = async (e, record) => {
    this.setState({
      isVal: false,
      disableColor: '',
      isClick: 'none',
      deleteFlagId: record.id,
      editData: {
        id: record.id,
        description: record.description,
        color: record.color ? record.color : '#ffffff',
      },
      isCreate: true
    });
    const { dispatch } = this.props;
    let isEditable = await dispatch({
      type: `${namespace}/isEditable`,
      payload: record.description,
    });
    if (isEditable) {
      this.setState({
        editData: {
          id: record.id,
          description: record.description,
          color: record.color,
        },
        visible: true,
        isEdit: true,
        tableLoading: true,
        isValueDisable: false,
      });
      this.props.form.setFieldsValue({
        description: record.description,
        id: record.id,
        color: record.color,
      });
    } else {
      message.warning('This flag is already in use，only Flag Color is editable.');
      this.setState({
        editData: {
          id: record.id,
          description: record.description,
          color: record.color,
        },
        isEdit: true,
        isClick: 'auto',
        visible: true,
        isValueDisable: true,
      });
      this.props.form.setFieldsValue({
        description: record.description,
        id: record.id,
        color: record.color,
      });
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { dispatch } = this.props;
    this.props.form.validateFields( async (err, values) => {
      if(!err) {
        this.refs.inputDisFlags.state.value = "";
        this.setState({
          tableLoading: true,
          isChangePage: true,
          loading: true,
        });
        const params = {
          color: values.color ? values.color : '#ffffff',
          description: values.description,
          id: values.id,
          start: 0,
          count: 10,
        };
        Object.keys(params).forEach(function(key) {
          if (params[key] === undefined || params[key] === '') {
            delete params[key];
          }
        });
        const res = await dispatch({
          type: `${namespace}/createOrUpdateFlag`,
          payload: params,
        });
        if (res) {
          this.setState({
            loading: false,
            isClick: 'auto',
            visible: false,
            tableData: res.values,
            tableTotal: res.total,
            tableLoading: false,
            isChangePage: false,
            curPageSize: 10,
            pageCurrent: 1
          });
        } else {
          this.setState({
            loading: false,
            isClick: 'auto',
            visible: false,
            tableLoading: false,
            isChangePage: false,
            curPageSize: 10,
            pageCurrent: 1
          });
        }
      }else{
        this.setState({
          loading: false,
          tableLoading: false
        })
      }
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
      tableLoading: false,
      isClick: 'auto',
      isChangePage: false
    });
  };

  handleSearch = async () => {
    const { dispatch, flags } = this.props;
    const { searchVal } = this.state;
    if (flags.length <= 0) {
      this.setState({
        isChangePage: true,
      });
    }
    this.setState({
      tableLoading: true,
      isCreate: false
    });
    const params = {
      description: searchVal,
      start: 0,
      count: 10,
    };
    Object.keys(params).forEach(function(key) {
      if (params[key] === undefined || params[key] === '') {
        delete params[key];
      }
    });
    const res = await dispatch({
      type: `${namespace}/findByDescription`,
      payload: params,
    });
    if (res) {
      this.setState({
        tableData: res.values,
        tableTotal: res.total,
        tableLoading: false,
        isChangePage: false,
        curPageSize: 10,
        pageCurrent: 1,
      });
    }
  };

  onColorChange = (color) => {
    this.setState({
      editData: {
        color: color.target.value,
      },
    });
  };

  setSearchVal = e => {
    this.setState({ searchVal: e.target.value });
  };

  onFlagBlur = (e) => {
    this.setState({
      isVal: false,
      searchVal: e.target.value,
      editData: {
        description: e.target.value
      }
    });
  };

  showDeleteModule = (type) => {
    this.setState({
      deleteFlagId: type.id,
      deleteVisible: true,
    });
  };

  deleteFlag = async () => {
    const { deleteFlagId, page, pageSize } = this.state;
    const { dispatch } = this.props;
    this.setState({
      deleteLoading: true,
    });
    let isLoading = await dispatch({
      type: `${namespace}/deleteFlag`,
      payload: {
        id: deleteFlagId,
        start: page,
        count: pageSize,
      },
    });
    if (isLoading) {
      this.setState({
        tableData: isLoading.values,
        tableTotal: isLoading.total,
        deleteVisible: false,
        deleteLoading: false,
        curPageSize: 10,
        pageCurrent: 1
      });
    }
  };

  EmptyComponent = () => {
    return (
      <Empty
        description={
          <span style={{ display: 'flex', flexDirection: 'column' }}>
            <b>We didn’t find any results</b>
            <span>Try checking your spelling or using other query conditions</span>
          </span>
        }
        image={Nodata}
      >
      </Empty>
    );
  };

  onShowSizeChange = (pageSize) => {
    const { searchVal, isCreate} = this.state;
    this.setState({
      tableLoading: true,
      isChangePage: true,
      curPageSize: pageSize,
      pageCurrent: 1
    });
    if (isCreate){
      this.fetchTableData(searchVal, 0, pageSize)
    }else{
      this.fetchDescriptionData(searchVal, (1 - 1) * pageSize, pageSize);
    }
  };

  onShowPageChange = (page, pageSize) => {
    const { searchVal, isCreate} = this.state;
    this.setState({
      tableLoading: true,
      isChangePage: true,
      pageCurrent: page
    });
    if (isCreate){
      this.fetchTableData(searchVal, (page - 1) * pageSize, pageSize)
    }else{
      this.fetchDescriptionData(searchVal, (page - 1) * pageSize, pageSize);
    }
  };

  render() {
    const { flags } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { loading, tableTotal } = this.state;
    const columns = [
      {
        title: 'Flag Description',
        dataIndex: 'description',
        key: 'description',
        width: '25%',
        render: (text, record) => {
          return (
            <span style={{ textAlign: 'center' }}>
              {record.description}
            </span>
          );
        },
      },
      {
        title: 'Flag Color',
        dataIndex: 'color',
        key: 'color',
        width: '25%',
        render: (text) => {
          return (
            <div style={{
              boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
              padding: '2px',
              borderRadius: '5px',
              display: 'inline-block',
            }}>
              <div style={{ backgroundColor: text, height: '20px', width: '40px', borderRadius: '5px' }}/>
            </div>
          );
        },
      },
      {
        title: 'Operation',
        key: 'action',
        width: '25%',
        render: (text, record) => {
          return (
            <span>
              <i style={{ color: '#1890ff', cursor: 'pointer', fontStyle: 'normal', pointerEvents: this.state.isClick }}
                 onClick={e => {
                   this.showEditFlag(e, record).then(r => r);
                 }}>Edit</i>
              <Divider type="vertical"/>
                <i style={{
                  color: '#1890ff',
                  cursor: 'pointer',
                  fontStyle: 'normal',
                  pointerEvents: this.state.isClick,
                }}
                   onClick={this.showDeleteModule.bind(this, record)}
                >Delete</i>
            </span>
          );
        },
      },
    ];
    let locale = {
      emptyText: this.EmptyComponent,
    };
    return (
      <Spin size="large" style={{ zIndex: 99999 }} spinning={this.state.deleteLoading}>
        <div className={Styles.flag_define}>
          <div className='search-title'>Search a Flag</div>
          <div className={Styles.searchContent}>
            <div>
              <Input
                placeholder="input search text"
                ref='inputDisFlags'
                onChange={this.setSearchVal}
                className={Styles.searchInp}
                allowClear={true}
              />
              <Button
                onClick={this.handleSearch}
                disabled={this.state.isChangePage}
                className={Styles.searchBtn}
              >
                Search
              </Button>
            </div>
            <Button type="primary" disabled={this.state.isChangePage} onClick={this.showAddFlag}>Create</Button>
          </div>

          <Table
            columns={columns}
            dataSource={this.state.tableData}
            pagination={false}
            locale={locale}
            loading={this.state.tableLoading}
            rowKey={record => record.id}
            style={{
              paddingBottom: 30
            }}
          />
          <ConfigProvider locale={enGB}>
            <div style={{textAlign: 'center', display: 'flex', justifyContent: 'center'}}>
              <Pagination
                style={{ textAlign: 'center'}}
                onChange={this.onShowPageChange}
                onShowSizeChange={this.onShowSizeChange}
                defaultCurrent={1}
                current={this.state.pageCurrent}
                pageSize={this.state.curPageSize}
                total={tableTotal}
                disabled={this.state.isChangePage || (flags <= 0)}
                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
              />
              <Select
                value={this.state.curPageSize + '/page'}
                disabled={this.state.isChangePage || (flags <= 0)}
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

          <Modal
            maskClosable={false}
            title={this.state.isEdit ? 'Edit Flag' : 'Create New Flag'}
            visible={this.state.visible}
            onOk={() => this.handleCancel(false)}
            onCancel={() => this.handleCancel(false)}
            footer={[
              <Button
                key="back"
                onClick={this.handleCancel}
                disabled={this.state.isVal}
                style={{ color: this.state.disableColor }}
              >
                Cancel
              </Button>,
              <Button
                key="submit"
                type="primary"
                loading={loading}
                onClick={this.handleSubmit}
                disabled={this.state.isVal}
              >
                {this.state.isEdit ? 'Save' : 'Add'}
              </Button>,
            ]}
          >
            <Form onSubmit={this.handleSubmit} className="login-form">
              <Form.Item label={'ID'} style={{ display: 'none' }}>
                {getFieldDecorator('id', {
                  pattern: new RegExp(/\D/, 'g'),
                  message: 'Please enter number Or !',
                })(
                  <Input placeholder="ID" disabled={this.state.isEdit} allowClear={true}/>,
                )}
              </Form.Item>
              <Form.Item label={'Flag Description'}>
                {getFieldDecorator('description', {
                  rules: [{ required: true, message: 'Please input Flag Description!' }],
                })(
                  <Input
                    placeholder="Please Input Flag Description"
                    disabled={this.state.isValueDisable}
                    autoComplete="off"
                    onChange={this.onFlagBlur}
                    allowClear={true}
                  />,
                )}
              </Form.Item>
              <Form.Item label={'Flag Color'}>
                {getFieldDecorator('color', {
                })(
                  <Input type="color" style={{ outline: 'none', width: 60 }} onChange={this.onColorChange}/>,
                )}
              </Form.Item>
            </Form>
          </Modal>
          <Modal
            maskClosable={false}
            title="Delete Flag"
            visible={this.state.deleteVisible}
            onOk={this.handleOk}
            onCancel={() => {
              this.setState({ deleteVisible: false });
            }}
            footer={[
              <Button key="back" onClick={() => {
                this.setState({ deleteVisible: false });
              }}>
                No
              </Button>,
              <Button
                key="submit"
                type="primary"
                style={{backgroundColor: '#1890ff', borderColor: '#1890ff'}}
                onClick={this.deleteFlag}
              >
                Yes
              </Button>,
            ]}
          >
            <p>Are you sure you want to remove this Flag?</p>
            <p>The relationship between this flag and countries and products will be removed at the same time.</p>
          </Modal>
        </div>
      </Spin>
    );
  }
}

export default DefineFlags;
