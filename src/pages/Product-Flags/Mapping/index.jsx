import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Select, Button, Form, message, Upload, TreeSelect, Spin, Empty, Modal, Progress } from 'antd';
import _ from 'lodash';
import Styles from './index.scss';
import Nodata from '@/assets/images/nodata.png';
import Uuid from 'react-uuid';

const { Option } = Select;
const token = localStorage.getItem('dpc-data-management');
const namespace = 'flagupload';

const mapStateToProps = (state) => {
  const { flags, geo, Country, flag, curSSE, isCAllPress } = state[namespace];
  return {
    geo,
    flags,
    Country,
    flag,
    curSSE,
    isCAllPress,
  };
};

let sse;

@connect(mapStateToProps)
@Form.create()
class UploadFlags extends PureComponent {
  state = {
    district: undefined,
    flag: undefined,
    isLoading: false,
    isSelect: true,
    visible: false,
    modalValue: '',
    curFlags: [],
    InfoVisible: false,
    RemoveInfo: false,
    curUuid: Uuid(),
    curPercent: 0,
    curStatus: 'active',
    curOpacity: 0,
    curFileList: [],
    UploadInfo: false,
    isCancel: true,
    isCancelInfo: false,
    curTime: '',
    isDisPlay: 'none',
    curClick: false,
    isCSV: false,
    CSVvalue: '',
    iconIsShow: false,
  };

  componentDidMount = async () => {
    const { dispatch} = this.props;
    dispatch({
      type: `${namespace}/fetchCountryGeo`,
    });
    // const res = await dispatch({
    //   type: `${namespace}/checkIsUpload`,
    //   payload: 'FLAG',
    // });
    // if (!isCAllPress) {
    //   if (res){
    //     if (res.values.length > 0) {
    //       if (sse !== undefined) {
    //         sse.close();
    //       }
    //       this.setState({
    //         isSelect: true,
    //         curFileList: [
    //           {name: res.values[0].fileName,uid: res.values[0].requestId,status: 'done'},
    //         ],
    //         curOpacity: 1,
    //         curPercent: Math.floor((res.values[0].finished / res.values[0].total ) * 100),
    //         isCancel: false,
    //         curTime: res.values[0].time,
    //         curClick: true,
    //       });
    //       // this.fetchProgress(res.values[0].requestId);
    //     }
    //   }
    // }

  };

  onChange = value => {
    this.setState({ district: value, flag: undefined });
    if (!_.isEmpty(value)) {
      const { dispatch } = this.props;
      dispatch({
        type: `${namespace}/fetchFlagsByDistrict`,
        payload: value,
      }).then( (res) => {
        if (res) {
          this.setState({
            curFlags: res.values
          });
          if (res.values.length <= 0) {
            this.setState({
              isSelect: true
            })
          }
        }
      });
    }
  };

  onFlagChange = value => {
    this.setState({ flag: value, isSelect: false,});
    if (!_.isEmpty(value)) {
      const { dispatch } = this.props;
      dispatch({
        type: `${namespace}/fetchFlags`,
        payload: value,
      });
    }
  };

  onUploadFinished = (resp) => {
    // init
    this.setState({
      curPercent: 0,
      isCancel: true,
      curOpacity: 0,
      curClick: true,
      isSelect: true,
      isDisPlay: 'block',
      curStatus: 'normal',
    });
    let fileList = [...resp.fileList];
    let that = this;
    fileList = fileList.slice(-1);
    // 设置当前显示文件个数
    this.setState({
      curFileList: fileList,
    });

    if (resp.file.status !== 'uploading') {
      this.setState({
        iconIsShow: true
      })
    }
    if (resp.file.status === "done") {
      // if (resp.file.response !== undefined && resp.file.status === "error") {
      //   message.warn('Your file Product-Flags failed, please Product-Flags it again!');
      //   return false;
      // }
        const event = resp.file.percent;
        if (event) {
          // this.setState({
          //   curOpacity: 1,
          //   isCancel: false,
          //   isDisPlay: 'none',
          // });
          // let Progress_PATH =
          //   `${process.env.API_ENV}`
          //   + '/api/v1/basedata/product/leapPoints/upload/progress?'
          //   + `requestId=` + this.state.curUuid
          //   + `&dpc-data-management-token=` + token
          // ;
          // if (typeof (EventSource) !== "undefined") {
          //   const {dispatch} = this.props;
          //   sse = new EventSource(Progress_PATH);
          //   dispatch({
          //     type: `${namespace}/saveSee`,
          //     payload: sse,
          //   });
          //   sse.addEventListener('PROGRESS', function(e) {
          //     const data = JSON.parse(e.data);
          //     that.setState({
          //       curPercent: Math.floor((data.finished / data.total ) * 100)
          //     });
          //     if (data.completed === true && data.unknownPartNumbers.length > 0) {
          //       that.setState({
          //         visible: true,
          //         modalValue: data.unknownPartNumbers,
          //         isSelect: false,
          //         curOpacity: 1,
          //         curStatus: 'success',
          //         curClick: false,
          //         isDisPlay: 'none',
          //         isCancel: true,
          //       });
          //       sse.close();
          //     }
          //     if (data.completed === true && data.failed === false && data.total === data.finished && data.unknownPartNumbers.length <= 0) {
          //       that.setState({
          //         InfoVisible: true,
          //         isSelect: false,
          //         curOpacity: 1,
          //         curStatus: 'success',
          //         curClick: false,
          //         isDisPlay: 'none',
          //         isCancel: true,
          //       });
          //       sse.close();
          //     }
          //     if (data.completed) {
          //
          //       sse.close();
          //     }
          //   });
          // }
        }
      }
    if (resp.file.status === "done"){
      if (resp.file.response.code === 200) {
        this.setState({
          InfoVisible: true,
          isSelect: false,
          isDisPlay: 'none',
        });
      }
    }
      if (resp.file.status === "removed"){
      this.setState({
        curOpacity: 0,
        isSelect: false,
        visible: false,
        InfoVisible: false,
        curClick: false,
        isDisPlay: 'none',
        curStatus: 'normal'
      });
      // const { dispatch } = this.props;
      // dispatch({
      //   type: `${namespace}/CanCelProgressBar`,
      //   payload: this.state.curUuid
      // }).then( (res) => {
      //   if (res){
      //
      //     sse.close();
      //   }
      // });
    }
    if (resp.file.status === 'error') {
      this.setState({
        curOpacity: 0,
        curPercent: 0,
        isSelect: false,
        isDisPlay: 'none',
      });
    }
    if (resp.file.response !== undefined) {
      if (resp.file.status !== 'removed' && resp.file.response.code === 3002) {
        this.setState({
          UploadInfo: true,
          isDisPlay: 'none',
          isSelect: false,
          curClick: false,
          UploadValue: resp.file.response.message
            .substring(0,  resp.file.response.message.length-2)
            .substring(20)
            .replace(/=/g,',')
        })
      }
      if (resp.file.status !== 'removed' && resp.file.response.code === 3001) {
        this.setState({
          isCSV: true,
          isDisPlay: 'none',
          isSelect: false,
          curClick: false,
          CSVvalue: resp.file.response.message
        })
      }
    }

  };

  // fetchProgress = (id) => {
  //   let that = this;
  //   let Progress_PATH =
  //     `${process.env.API_ENV}`
  //     + '/api/v1/basedata/product/leapPoints/upload/progress?'
  //     + `requestId=` + id
  //     + `&dpc-data-management-token=` + token;
  //   if (typeof (EventSource) !== "undefined") {
  //     sse = new EventSource(Progress_PATH);
  //     sse.addEventListener('PROGRESS', function(e) {
  //       const data = JSON.parse(e.data);
  //       that.setState({
  //         curPercent: Math.floor((data.finished / data.total) * 100)
  //       });
  //       if(data.total === data.finished && data.unknownPartNumbers.length <= 0 && data.completed === true) {
  //         that.setState({
  //           curStatus: 'success',
  //           InfoVisible: true,
  //         });
  //         sse.close()
  //       }
  //       if (data.total === data.finished && data.unknownPartNumbers.length > 0) {
  //         that.setState({
  //           visible: true,
  //           curStatus: 'success',
  //           modalValue: data.unknownPartNumbers,
  //         });
  //         sse.close()
  //       }
  //       if (data.completed) {
  //         sse.close()
  //       }
  //     });
  //   }
  // };

  onRemoveFile = () => {
    return true
  };

  // onCancel = () => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: `${namespace}/CanCelProgressBar`,
  //     payload: this.state.curUuid
  //   }).then( (res) => {
  //     if (res){
  //       this.setState({
  //         curOpacity: 1,
  //         curStatus: 'exception',
  //         isSelect: false,
  //         visible: false,
  //         InfoVisible: false,
  //         curClick: false,
  //         isDisPlay: 'none',
  //       });
  //       if (sse !== undefined) {
  //         sse.close();
  //       }
  //     }
  //   });
  //   dispatch({
  //     type: `${namespace}/isCallProgress`,
  //     payload: true
  //   })
  // };

  EmptyComponent = () => {
    return (
      <div>
        <Empty
          description={
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <b>We didn’t find any results</b>
              <span>Try checking your spelling or using other query conditions</span>
            </div>
          }
          image={Nodata}
        >
        </Empty>
      </div>
    );
  };

  handleOk = () => {
    this.setState({
      visible: false,
    });
  };

  InfoHandleOk = () => {
    this.setState({
      InfoVisible: false,
    });
  };

  render() {
    const { geo } = this.props;
    const {district, flag} = this.state;
    const locale = {
      emptyText: this.EmptyComponent,
    };

    let flagOptions = _.uniq(this.state.curFlags).map((f, index) => <Option style={{ width: '100%' }} key={index} value={f} label={f}>{f}</Option>);
    const token = localStorage.getItem('dpc-data-management');
    return (
      < div>
        <div className={Styles.flags_Upload}>
          <div className={Styles.tagMark} style={{display: this.state.isDisPlay}} />
          <ul>
            <li>
              {/*{getFieldDecorator('district')()}*/}
              <label>Geo/Reg/Sub Reg/Countries:</label>
              <TreeSelect
                showSearch
                style={{ width: '200px' }}
                dropdownStyle={{ maxHeight: 400, overflowY: 'auto' }}
                treeData={geo}
                placeholder="Please select"
                notFoundContent="No Data"
                treeDefaultExpandAll={false}
                locale={locale}
                onChange={this.onChange}
                disabled={this.state.curClick}
              />
            </li>
            <li>
              <label>Flag:</label>
              <Select
                mode="single"
                style={{ width: '200px' }}
                placeholder="select one flag"
                showSearch
                onChange={this.onFlagChange}
                optionLabelProp="label"
                notFoundContent="No Data"
                value={this.state.flag}
                disabled={this.state.curClick}
              >
                {flagOptions}
              </Select>
            </li>
          </ul>
          <div style={{marginTop: 27}}>
            <a
              href={
                `${process.env.API_ENV}/api/v1/basedata/product/flags/download/flagsTemplate?
                dpc-data-management-token=` + token
              }
              style={{ marginLeft: '15px' }}
            >
              <Button type="primary" icon="download" disabled={this.state.curClick}>Download Template</Button>
            </a>
          </div>
          <div style={{ marginTop: 27}}>

            <Upload
              name='file'
              action={
                      `${process.env.API_ENV}/api/v1/basedata/product/leapPoints/upload/flagsCSV2?`
                      + `district=` + district
                      + `&flag=` + flag
                      // + `&requestId=` + this.state.curUuid
                      + `&dpc-data-management-token=${token}`
              }
              onChange={this.onUploadFinished}
              style={{ marginLeft: '15px' }}
              onRemove={this.onRemoveFile}
              accept="text/event-stream"
              fileList={this.state.curFileList}
              showUploadList={{showRemoveIcon: this.state.iconIsShow, showDownloadIcon: false}}
            >
              <Button type="primary" icon="upload" disabled={this.state.isSelect}>
                Import Flags
              </Button>
            </Upload>
            {
              <div
                style={{
                  position: 'absolute',
                  top: 70,
                  left: 0,
                  opacity: this.state.curOpacity,
                }}>
                {this.state.curTime}
              </div>
            }
            {/*<Progress*/}
            {/*  percent={this.state.curPercent}*/}
            {/*  status={this.state.curStatus}*/}
            {/*  style={{*/}
            {/*    opacity: this.state.curOpacity,*/}
            {/*    position: 'absolute',*/}
            {/*    left: 0,*/}
            {/*    width: 235,*/}
            {/*    top: 130,*/}
            {/*  }}*/}
            {/*/>*/}
          </div>
          {/*<Button*/}
          {/*  type="primary"*/}
          {/*  className={Styles.CancelBtn}*/}
          {/*  style={{opacity: this.state.curOpacity}}*/}
          {/*  disabled={this.state.isCancel}*/}
          {/*  onClick={this.onCancel}*/}
          {/*>*/}
          {/*  cancel*/}
          {/*</Button>*/}
        </div>

        <Modal
          title="Upload Info"
          visible={this.state.visible}
          onOk={this.handleOk}
          maskClosable={false}
          onCancel={() => {
            this.setState({ visible: false });
          }}
          footer={[
            <Button
              key="submit"
              type="primary"
              style={{ backgroundColor: '#1890ff', borderColor: '#1890ff', color: '#fff' }}
              onClick={this.handleOk}
            >
              Ok
            </Button>,
          ]}
        >
          <p
            style={{maxHeight: 400, overflow: 'auto'}}
            >Upload flags successfully except the invalid product number as below{"：" + this.state.modalValue}</p>
        </Modal>
        <Modal
          title="Upload Info"
          visible={this.state.InfoVisible}
          onOk={this.InfoHandleOk}
          maskClosable={false}
          onCancel={() => {
            this.setState({ InfoVisible: false });
          }}
          footer={[
            <Button
              key="submit"
              type="primary"
              style={{ backgroundColor: '#1890ff', borderColor: '#1890ff', color: '#fff' }}
              onClick={this.InfoHandleOk}
            >
              Ok
            </Button>,
          ]}
        >
          <p>Upload flags successfully</p>
        </Modal>
        <Modal
          title="Upload Info"
          visible={this.state.UploadInfo}
          onOk={() => {
            this.setState({ UploadInfo: false });
          }}
          maskClosable={false}
          onCancel={() => {
            this.setState({ UploadInfo: false });
          }}
          footer={[
            <Button
              key="submit"
              type="primary"
              style={{ backgroundColor: '#1890ff', borderColor: '#1890ff', color: '#fff' }}
              onClick={() => {
                this.setState({ UploadInfo: false });
              }}
            >
              Ok
            </Button>,
          ]}
        >
          <p>There are still files being processed, please try later.</p>
        </Modal>
        <Modal
          title="Upload Info"
          visible={this.state.isCancelInfo}
          onOk={() => {
            this.setState({ isCancelInfo: false });
          }}
          maskClosable={false}
          onCancel={() => {
            this.setState({ isCancelInfo: false });
          }}
          footer={[
            <Button
              key="submit"
              type="primary"
              style={{ backgroundColor: '#1890ff', borderColor: '#1890ff', color: '#fff' }}
              onClick={() => {
                this.setState({ isCancelInfo: false });
              }}
            >
              Continue to upload
            </Button>,
            <Button
              type="primary"
              style={{ backgroundColor: '#1890ff', borderColor: '#1890ff', color: '#fff' }}
              onClick={() => {
                this.setState({ isCancelInfo: false });
              }}
            >
              Pause
            </Button>
          ]}
        >
          <p>There are still files being processed, please try later.</p>
        </Modal>
        <Modal
          title="Upload Info"
          visible={this.state.UploadInfo}
          onOk={() => {
            this.setState({ UploadInfo: false });
          }}
          maskClosable={false}
          onCancel={() => {
            this.setState({ UploadInfo: false });
          }}
          footer={[
            <Button
              key="submit"
              type="primary"
              style={{ backgroundColor: '#1890ff', borderColor: '#1890ff', color: '#fff' }}
              onClick={() => {
                this.setState({ UploadInfo: false });
              }}
            >
              Ok
            </Button>,
          ]}
        >
          <p>Upload leap points for products failed.</p>
          <p>Leap points should be integer. Please add correct leap points for products as below and upload again.</p>
          <p>{this.state.UploadValue}</p>
        </Modal>
        <Modal
          title="Upload Info"
          visible={this.state.isCSV}
          onOk={this.handleOk}
          maskClosable={false}
          onCancel={() => {this.setState({isCSV: false})}}
          footer={[
            <Button
              key="submit"
              type="primary"
              onClick={() => {this.setState({isCSV: false})}}
              style={{backgroundColor: '#1890ff', borderColor: '#1890ff', color: '#fff'}}
            >
              Ok
            </Button>
          ]}
        >
          <p>{this.state.CSVvalue}</p>
        </Modal>
      </div>
    );
  }
}

export default UploadFlags;
