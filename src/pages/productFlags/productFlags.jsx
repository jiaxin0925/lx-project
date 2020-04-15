import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Upload, Input, Form, Checkbox, Modal, TreeSelect, Spin, Empty, Collapse } from 'antd';
import './productFlags.scss';
import _ from 'lodash';
import Nodata from '@/assets/images/nodata.png';

const CheckboxGroup = Checkbox.Group;
const { Panel } = Collapse;

const namespace = 'productFlags';

const mapStateToProps = (state) => {
  const { productFlags, total, region, saveFlags, ableFlags, editFlags, countries, partNumber, flags, sale, product, models, saveModalFlags } = state[namespace];
  return {
    productFlags,
    total,
    region,
    saveFlags,
    ableFlags,
    editFlags,
    countries,
    partNumber,
    flags,
    sale,
    product,
    models,
    saveModalFlags,
    editFlagData: {},
  };
};

@connect(mapStateToProps)
@Form.create()
class ProductFlags extends Component {

  constructor(props) {
    super(props);
    this.columns = [
      {
        title: 'Product Number',
        dataIndex: 'partNumber',
        key: 'partNumber',
        className: 'row_wrap',
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: 'Country',
        dataIndex: 'country',
        key: 'country',
      },
      {
        title: 'Product Type',
        dataIndex: 'productType',
        key: 'productType',
        className: 'row_wrap',
      },
      {
        title: 'Flags',
        dataIndex: 'flags',
        key: 'flags',
      },
      {
        title: 'Leap Points',
        dataIndex: 'leapPoint',
        key: 'leapPoint',
      },
    ];

    this.state = {
      visible: false,
      isCan: true,
      isCanLeap: true,
      isCanFlag: true,
      isSearch: true,
      partNumber: '',
      modalValue: undefined,
      countries: [],
      product: undefined,
      models: undefined,
      flags: undefined,
      itemFlags: undefined,
      sale: undefined,
      isFlags: false,
      flags2: undefined,
      record: {},
      leapPoint2: null,
      current: 0,
      selectedRowKeys: [],
      selectedRowKeysMap: new Map(),
      selectedRowsMap: new Map(),
      loading: false,
      downloading: false,
      countryFlag: true,
      LeapFlag: true,
      isLeaps: undefined,
      tableData: [],
      tableTotal: 0,
      rowData: [],
      count: [],
      curPage: 0,
      curPageSize: 10,
      CalText: 'Expand All Filter Options',
      sun: 1,
    };
  }

  componentWillMount = async () => {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/fetchCountryGeo`,
    });
    this.columns.splice(this.columns.length, 0, {
      title: 'Operation',
      key: 'action',
      render: (text, record) => {
        if (record.editable === true) {
          return (
            <span>
            <i style={{ fontStyle: 'normal', color: '#1890ff', cursor: 'pointer' }} onClick={e => {
              this.showEditFlag(e, record);
            }}>Edit</i>
          </span>
          );
        } else {
          return (
            <span style={{ cursor: 'not-allowed', color: '#ccc' }}>
                Edit
              </span>
          );
        }
      },
    });
    this.setState({
      countryFlag: true,
      LeapFlag: true,
    });
  };

  findTableData = async (isLeaps, page, pageSize) => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        // init
        this.setState({
          tableData: [],
          tableTotal: 0,
          downloading: true,
        });
        const { partNumber, flags, sale, product, models, countries } = this.state;
        const { dispatch } = this.props;
        const params = {
          partNumber: partNumber.length > 0 ?  partNumber.split(',') : values.partNumber,
          country: countries,
          flags: flags,
          salesStatus: sale,
          productType: product,
          models: models,
          currentPage: page,
          pageSize: pageSize,
          leaps: isLeaps,
        };
        Object.keys(params).forEach(function(key) {
          if (params[key] === undefined || params[key] === '' || params[key] === []) {
            delete params[key];
          }
        });
        const res = await dispatch({
          type: `${namespace}/findProductFlagsPaged`,
          payload: params,
        });
        if (res) {
          _.map(res.values, (item, index) => {
            return res.values[index].id = index;
          });
          this.setState({
            selectedRows: [],
            selectedRowKeys: [],
            selectedRowsMap: new Map(),
            selectedRowKeysMap: new Map(),
            loading: false,
            downloading: false,
            tableData: res.values,
            tableTotal: res.total,
            rowData: [],
            curPage: page,
            curPageSize: pageSize
          });
          if (!isLeaps) {
            if (res.total === 0) {
              this.setState({
                isCanFlag: true,
                isCanLeap: true,
              });
            } else {
              this.setState({
                isCanFlag: false,
                isCanLeap: true,
              });
            }
          }
          if (isLeaps) {
            if (res.total === 0) {
              this.setState({
                isCanLeap: true,
                isCanFlag: true,
              });
            } else {
              this.setState({
                isCanLeap: false,
                isCanFlag: true,
              });
            }
          }
        }
      }
    });
  };

  showEditFlag = async (e, record) => {
    this.setState({
      editFlagData: {
        countries: record.country,
        partNumber: record.partNumber,
        productType: record.productType,
        flags: record.flags,
      },
    });
    if (record.flags !== null) {
      this.props.form.setFieldsValue({
        saveModalFlags: record.flags.split(','),
      });
    } else {
      this.props.form.setFieldsValue({
        saveModalFlags: [],
      });
    }
    this.props.form.setFieldsValue({
      leapPoint2: record.leapPoint,
    });

    if (this.state.isFlags) {
      let params = {
        country: record.country[0] + record.country[1],
        partNumber: record.partNumber,
        description: record.description,
        flags: record.flags,
      };
      const { dispatch } = this.props;
      let isDone = await dispatch({
        type: `${namespace}/fetchByCountry`,
        payload: params,
      });
      if (isDone) {
        this.setState({
          visible: true,
        });
      }
    } else {
      this.setState({
        visible: true,
      });
    }
  };

  handleSubmit = async (isLeaps) => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        this.setState({
          rowData: [],
          curPage: 0,
          curPageSize: 10,
          tableData: [],
        });
        const { dispatch, countries } = this.props;
        this.setState({
          current: 1,
          downloading: true,
        });
        dispatch({
          type: `${namespace}/savePageVal`,
          payload: {
            partNumber: values.partNumber,
            countries: values.countries,
            flags: values.flags,
            sale: values.sale,
            product: values.product,
            models: values.models,
          },
        });
        const params = {
          partNumber: _.isNil(values.partNumber) ? null : _.isArray(values.partNumber) ? values.partNumber : values.partNumber.split(','),
          country: this.state.modalValue ? this.state.modalValue : countries,
          flags: values.flags,
          salesStatus: values.sale,
          productType: values.product,
          models: values.models,
          currentPage: 0,
          pageSize: 10,
          leaps: isLeaps,
        };
        Object.keys(params).forEach(function(key) {
          if (params[key] === undefined || params[key] === '' || params[key] === ['']) {
            delete params[key];
          }
        });
        const res = await dispatch({
          type: `${namespace}/findProductFlagsPaged`,
          payload: params,
        });
        if (res) {
          _.map(res.values, (item, index) => {
            return res.values[index].id = index;
          });
          this.setState({
            selectedRows: [],
            selectedRowKeys: [],
            selectedRowsMap: new Map(),
            selectedRowKeysMap: new Map(),
            loading: false,
            downloading: false,
            tableData: res.values,
            tableTotal: res.total,
          });
          if (!isLeaps) {
            if (res.total === 0) {
              this.setState({
                isCanFlag: true,
                isCanLeap: true,
              });
            } else {
              this.setState({
                isCanFlag: false,
                isCanLeap: true,
              });
            }
          }
          if (isLeaps) {
            if (res.total === 0) {
              this.setState({
                isCanLeap: true,
                isCanFlag: true,
              });
            } else {
              this.setState({
                isCanLeap: false,
                isCanFlag: true,
              });
            }
          }
        }
      }
      this.setState({
        isCan: !_.isEmpty(this.state.modalValue),
      });
    });

  };

  onChangeModal = async value => {
    const { dispatch, partNumber } = this.props;
    dispatch({
      type: `${namespace}/saveProductVal`,
      payload: {
        partNumber: partNumber,
        countries: new Array(value),
      },
    });
    let params = {
      country: value,
    };
    const res = await dispatch({
      type: `${namespace}/fetchByCountries`,
      payload: params,
    });
    if (res) {
      this.props.form.setFieldsValue({
        countries: value,
      });
      this.setState({
        countryFlag: false,
        LeapFlag: false,
        modalValue: value,
        isSearch: false,
        isCan: false,
        countries: value,
        itemFlags: res.values,
      });
      if (_.isEmpty(value)) {
        this.setState({
          isSearch: true,
          isCan: true,
        });
      }
    }
  };

  clearCatiy = () => {
    this.setState({
      itemFlags: [],
    });
  };

  searchFlags = () => {
    this.setState({
      isLeaps: false,
      isFlags: true,
      current: 1,
    });
    this.findTableData(false, 0, 10);
    this.columns = _.slice(this.columns, [0], [4]);
    this.columns.splice(this.columns.length, 0, {
      title: 'Flags',
      dataIndex: 'flags',
      key: 'flags',
      render: (text, record) => {
        if (record.flags !== null) {
          return (
            _.map(record.flags.split(','), (item, index) => {
              return (
                <div key={index}>{item}</div>
              );
            })
          );
        }
      },
      width: 150,
    });

    this.columns.splice(this.columns.length, 0, {
      title: 'Operation',
      key: 'action',
      render: (text, record) => {
        if (record.editable === true) {
          return (
            <span>
            <i style={{ fontStyle: 'normal', color: '#1890ff', cursor: 'pointer' }} onClick={e => {
              this.showEditFlag(e, record).then(r => r);
            }}>Edit</i>
          </span>
          );
        } else {
          return (
            <span style={{ cursor: 'not-allowed', color: '#ccc' }}>
               Edit
              </span>
          );
        }
      },
    });
  };

  searchLeapPoints = () => {
    this.setState({
      isFlags: false,
      current: 1,
    });
    this.setState({ isLeaps: true });
    this.findTableData(true, 0, 10);
    // this.handleSubmit(true);
    this.columns = _.slice(this.columns, [0], [4]);
    this.columns.splice(this.columns.length, 0, {
      title: 'Leap Points',
      dataIndex: 'leapPoint',
      key: 'leapPoint',
      width: 150,
    });

    this.columns.splice(this.columns.length, 0, {
      title: 'Operation',
      key: 'action',
      render: (text, record) => {
        return (
          <span>
            <i style={{ fontStyle: 'normal', color: '#1890ff', cursor: 'pointer' }} onClick={e => {
              this.showEditFlag(e, record).then(r => r);
            }}>Edit</i>
          </span>
        );
      },
    });

  };

  download = async (type) => {
    const onDownloadFinish = () => this.setState({ downloading: false});
    this.setState({ current: 1,  downloading: true});
    const { dispatch } = this.props;
    const { rowData, isLeaps } = this.state;
    if (rowData.length > 0) {
      const values = rowData;
      _.map(values, item => {
        for (let key in item) {
          if (key === 'editable') {
            delete item[key];
          }
          if (key === 'id') {
            delete item[key];
          }
        }
        return item;
      });
      await dispatch({
        type: `${namespace}/downloadSelected`,
        payload: {
          type: type === 'flags' ? 'selectedFlags' : 'selectedLeapPoints',
          values: values,
          onDownloadFinish: onDownloadFinish,
        },
      });
      // // 查询表格数据
      // this.findTableData(isLeaps, 0, 10);
    } else if (!_.isEmpty(this.state.modalValue)) {
      this.setState({
        current: 1,
        downloading: true,
      });
      let values = {
        country: this.state.modalValue,
        partNumber: _.isNil(this.state.partNumber) ? null : _.isArray(this.state.partNumber) ? this.state.partNumber : this.state.partNumber.split(','),
        flags: this.state.flags,
        salesStatus: this.state.sale,
        productType: this.state.product,
        models: this.state.models,
        leaps: isLeaps,
      };
      dispatch({
        type: `${namespace}/download`,
        payload: {
          type: type,
          values: values,
          onDownloadFinish: onDownloadFinish,
        },
      });
      // // 查询表格数据
      // this.findTableData(isLeaps, 0, 10);
    }
  };

  affiliatedTableTableChangePage = (page, pageSize) => {
    const { selectedRowKeysMap, current, isLeaps } = this.state;
    this.setState({
      current: page,
      downloading: true,
      curPage: page,
      curPageSize: pageSize,
      rowData: [],
      tableData: [],
    });
    selectedRowKeysMap.set(current, []);
    this.findTableData(isLeaps, page, pageSize);
  };

  handleChangeProduct = (value) => {
    this.props.form.setFieldsValue({
      product: value,
    });
    this.setState({
      product: value,
    });
    const { dispatch, partNumber, countries, flags, sale } = this.props;
    dispatch({
      type: `${namespace}/saveProductVal`,
      payload: {
        partNumber: partNumber,
        countries: countries,
        flags: flags,
        sale: sale,
        product: value,
      },
    });
  };

  handleChangeModels = (value) => {
    this.props.form.setFieldsValue({
      models: value,
    });
    this.setState({
      models: value,
    });
    const { dispatch, partNumber, countries, flags, sale, product } = this.props;
    dispatch({
      type: `${namespace}/saveProductVal`,
      payload: {
        partNumber: partNumber,
        countries: countries,
        flags: flags,
        sale: sale,
        product: product,
        models: value,
      },
    });
  };

  handleChangeFlagsItem = (value) => {
    this.props.form.setFieldsValue({
      flags: value,
    });
    this.setState({
      flags: value,
    });
    const { dispatch, partNumber, countries } = this.props;
    dispatch({
      type: `${namespace}/saveProductVal`,
      payload: {
        partNumber: partNumber,
        countries: countries,
        flags: value,
      },
    });
  };

  handleChangeSale = (value) => {
    const newArray = _.map(value, (item) => {
      return item.substring(0, 2);
    });
    this.props.form.setFieldsValue({
      sale: newArray,
    });
    this.setState({
      sale: newArray,
    });
    const { dispatch, partNumber, countries, flags } = this.props;
    dispatch({
      type: `${namespace}/saveProductVal`,
      payload: {
        partNumber: partNumber,
        countries: countries,
        flags: flags,
        sale: value,
      },
    });
  };

  // model的flags
  handleChangeFlag = (value) => {
    const { editFlagData } = this.state;
    this.setState({
      editFlagData: {
        flags: value,
        countries: editFlagData.countries,
        partNumber: editFlagData.partNumber,
        productType: editFlagData.productType,
      },
    });
  };
  // model的Leap points
  handleChangeLeap = (e) => {
    this.props.form.setFieldsValue({
      leapPoint2: e.target.value,
    });
    this.setState({
      leapPoint2: e.target.value,
    });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleSubmitFlags = (e) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        this.setState({
          downloading: true,
          visible: false,
        });
        const { editFlagData } = this.state;
        if (this.state.isFlags) {
          let params = {
            countries: editFlagData.countries.split(','),
            partNumber: editFlagData.partNumber,
            productType: editFlagData.productType,
            flags: values.saveModalFlags,
            leaps: this.state.isLeaps,
          };
          Object.keys(params).forEach(function(key) {
            if (params[key] === undefined || params[key] === '' || params[key] === null) {
              delete params[key];
            }
          });
          const { dispatch } = this.props;
          let isDone = await dispatch({
            type: `${namespace}/updateFlags`,
            payload: params,
          });
          if (isDone) {
            const { isLeaps, curPage, curPageSize } = this.state;
            this.findTableData(isLeaps, curPage, curPageSize);
          }
        } else {
          const { editFlagData } = this.state;
          let params = {
            country: editFlagData.countries.split(','),
            partNumber: editFlagData.partNumber,
            productType: editFlagData.productType,
            leapPoint: this.state.leapPoint2,
            leaps: this.state.isLeaps,
          };
          const { dispatch } = this.props;
          let isDone = await dispatch({
            type: `${namespace}/updateLeapPoints`,
            payload: params,
          });
          if (isDone) {
            const { isLeaps, curPage, curPageSize } = this.state;
            this.findTableData(isLeaps, curPage, curPageSize);
          }
        }
      }
    });
  };

  setModalVisible = (modalVisible) => {
    this.setState({ visible: modalVisible });
  };
  onSelectChange = (keys, rows) => {
    let { selectedRowKeysMap, selectedRowsMap, current } = this.state;
    selectedRowKeysMap.set(current, keys);
    selectedRowsMap.set(current, rows.length > 0 ? rows : null);
    this.setState({
      selectedRowKeys: keys,
      rowData: rows,
    });
  };

  saveProductVal = (e) => {
    const { dispatch, countries, flags } = this.props;
    dispatch({
      type: `${namespace}/saveProductVal`,
      payload: {
        partNumber: e.target.value,
        countries: countries,
        flags: flags,
      },
    });
    this.setState({
      partNumber: e.target.value,
    });
  };

  onChangeCollapse = () => {
    if (this.state.sun++ % 2) {
      this.setState({
        CalText: 'Collapse All Filter Options',
      });
    } else {
      this.setState({
        CalText: 'Expand All Filter Options',
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

  fetchPartNumber = (reps) => {
    if(reps.file.response !== undefined && reps.file.response){
      if (reps.file.status === "done"){
        if (reps.file.response.values.length > 0){
          if (this.state.partNumber.indexOf(reps.file.response.values) === -1){
            this.props.form.setFieldsValue({
              partNumber: this.state.partNumber += reps.file.response.values + ','
            });
          }
        }
      }
    }
  };

  render() {
    const { region, editFlags } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { selectedRowKeys, itemFlags } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    let locale = {
      emptyText: this.EmptyComponent,
    };
    const token = localStorage.getItem('dpc-data-management');
    return (
      <Spin size="large"
            style={{
              position: 'absolute',
              top: '30%',
            }}
            spinning={this.state.downloading}
            tip="Loading..."
      >
        <div className="productFlags">
          <Modal
            title={this.state.isFlags ? 'EDIT FLAGS' : 'EDIT LEAP POINT'}
            visible={this.state.visible}
            className="flag-modal-item"
            onOk={() => this.setModalVisible(false)}
            onCancel={() => this.setModalVisible(false)}
            footer={[
              <Button key="back" onClick={this.handleCancel}>
                Cancel
              </Button>,
              <Button key="submit" type="primary" onClick={this.handleSubmitFlags}>
                Save
              </Button>,
            ]}
          >
            <Form onSubmit={this.handleSubmitFlags} className="flag-item">
              {this.state.isFlags ? (
                  <Form.Item>
                    {getFieldDecorator('saveModalFlags', {
                      // initialValue: saveModalFlags
                    })(
                      <CheckboxGroup options={editFlags} onChange={this.handleChangeFlag} className="flag-checkbox"/>,
                    )}
                  </Form.Item>
                ) :
                (
                  <Form.Item>
                    {getFieldDecorator('leapPoint2', {
                      initialValue: '',
                      rules: [
                        {
                          pattern: new RegExp('^[0-9]*$', 'g'),
                          message: 'Please enter a number type!',
                        },
                      ],
                    })(
                      <Input
                        placeholder="input with clear icon"
                        allowClear
                        onChange={this.handleChangeLeap}
                        maxLength={6}
                      />,
                    )}
                  </Form.Item>
                )}

            </Form>
          </Modal>

          <Form labelCol={{ span: 24 }} onSubmit={this.handleSubmit} style={{ marginLeft: '10px' }}>
            <Form.Item label="Product Number" colon={false}>
              {getFieldDecorator('partNumber', {
                // initialValue: partNumber,
                // rules: [{ required: true, message: 'Please input your Product Number!' }],
              })(<Input
                  style={{ 'width': '300px' }}
                  autoComplete="off"
                  onChange={this.saveProductVal}
                  placeholder="Please input"
                  allowClear={true}
                />,
              )}
              {/* <div style={{display: "inline-flex"}}> */}
                <a
                  href={`${process.env.API_ENV}/api/v1/basedata/product/flags/download/partNumberTemplate?dpc-data-management-token=` + token}
                  download={'price-list'}
                >
                  <Button type="primary" ghost className="download-btn">Download Template</Button>
                </a>
                <Upload
                  name='file'
                  action={`${process.env.API_ENV}/api/v1/basedata/product/flags/upload/partNumbers?dpc-data-management-token=` + token}
                  onChange={this.fetchPartNumber}
                >
                  <Button type="primary" ghost>
                    Upload Product Number
                  </Button>
                </Upload>
                {/* <a href={`${process.env.API_ENV}/api/v1/basedata/product/flags/download/partNumberTemplate?dpc-data-management-token=` + token}>
                  <Button type="primary" ghost style={{"marginLeft":"16px"}}>Download All Products</Button>
                </a> */}
              {/* </div> */}
            </Form.Item>
            <Form.Item label="Geo/Reg/Sub Reg/Countries:" colon={false}>
              {getFieldDecorator('countries', {
                // initialValue: countries,
                rules: [{ required: true, message: 'Please select Geo/Reg/Sub Reg/Countries!' }],
              })(
                <TreeSelect
                  showSearch
                  className="productTreeSelect"
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={region}
                  placeholder="Please select"
                  notFoundContent="No Data"
                  treeDefaultExpandAll={false}
                  allowClear
                  onFocus={this.clearCatiy}
                  onSelect={this.onChangeModal}
                />,
              )}
            </Form.Item>
            <Form.Item label="Flags" colon={false}>
              {getFieldDecorator('flags', {
                // initialValue: flags,
                rules: [{ required: false, message: 'Please select Flags!' }],
              })(
                <CheckboxGroup
                  options={itemFlags}
                  onChange={this.handleChangeFlagsItem}
                  className="flag-checkbox flag-checkbox-flag"
                />,
              )}
            </Form.Item>
            <Collapse
              bordered={false}
              onChange={this.onChangeCollapse}
              // style={{ marginRight: 10 }}
            >
              <Panel
                showArrow={false}
                header={
                  <div
                    style={{
                      color: '#1890ff',
                      userSelect: 'none',
                      textAlign: 'right',
                    }}
                  >
                    {this.state.CalText}
                  </div>}
                key="1"
              >
                <Form.Item label="Sales Status" colon={false}>
                  {getFieldDecorator('sale', {
                    // initialValue: sale,
                    rules: [{ required: false, message: 'Please select Sales Status!' }],
                  })(
                    <CheckboxGroup className="flag-checkbox-Status"
                                   options={
                                     ['12-Announce & Available', '13-Preannounce/Early Or',
                                       '16-Limited Availability', '17-W/D from Marketing',
                                       '18-Change in Progress', '19-W/D fm MFG/LTD AVAIL',
                                       '20-Constrained - MFG', '22-Available, Non-RFA',
                                       '23-Preannounced/Disclos', '24-Order,can\'t delivery']
                                   }
                                   onChange={this.handleChangeSale}/>,
                  )}
                </Form.Item>
                <Form.Item label="Product Type" colon={false}>
                  {getFieldDecorator('product', {
                    // initialValue: product,
                    rules: [{ required: false, message: 'Please select Product Type!' }],
                  })(
                    <CheckboxGroup className="flag-checkbox flag-checkbox-Status" options={['CTO', 'LFO', 'OPTION', 'SERVICE']}
                                   onChange={this.handleChangeProduct}/>,
                  )}
                </Form.Item>
                <Form.Item label="Models" colon={false}>
                  {getFieldDecorator('models', {
                    // initialValue: models,
                    rules: [{ required: false, message: 'Please select Models!' }],
                  })(
                    <CheckboxGroup className="flag-checkbox flag-checkbox-Status" options={['Standard Models', 'Custom Models']}
                                   onChange={this.handleChangeModels}/>,
                  )}
                </Form.Item>
              </Panel>
            </Collapse>
          </Form>

          <a style={{ float: 'left', zIndex: 99, marginBottom: '10px', position: 'relative' }} download={'price-list'}>
            <Button type="primary" ghost onClick={this.searchFlags} disabled={this.state.countryFlag}>Search
              Flags</Button>
          </a>

          <a style={{ float: 'left', zIndex: 99, marginBottom: '10px', marginLeft: '10px', position: 'relative' }}
             download={'price-list'}
          >
            <Button type="primary" ghost onClick={this.searchLeapPoints} disabled={this.state.LeapFlag}>Search Leap
              Points</Button>
          </a>

          <a
            style={{ float: 'left', zIndex: 99, marginBottom: '10px', marginLeft: '10px', position: 'relative' }}
            download={'price-list'}
            onClick={() => {
              this.download('flags');
            }}
          >
            <Button type="primary" icon="download" disabled={this.state.isCanFlag}>Download Flags</Button>
          </a>

          <a
            style={{ float: 'left', zIndex: 99, marginBottom: '10px', marginLeft: '10px', position: 'relative' }}
            download={'price-list'}
            onClick={() => {
              this.download('leapPoints');
            }}
          >
            <Button type="primary" icon="download" disabled={this.state.isCanLeap}>Download Leap Points</Button>
          </a>

          <Table
            bordered
            dataSource={this.state.tableData}
            loading={this.state.loading}
            locale={locale}
            pagination={{
              current: this.state.current,
              pageSize: 10,
              total: this.state.tableTotal,
              onChange: this.affiliatedTableTableChangePage,
            }}
            rowSelection={rowSelection}
            rowKey={record => record.id}
            columns={this.columns}/>
        </div>
      </Spin>
    );
  }
}

export default ProductFlags;
