import React, {PureComponent} from 'react';
import {connect} from 'dva';
import { Button, message, Form, Upload, TreeSelect, Spin, Empty, Modal, Progress } from 'antd';
import Uuid from 'react-uuid';
import Nodata from "@/assets/images/nodata.png";
import Styles from './index.scss';
const namespace = 'leappointsupload';

const token = localStorage.getItem('dpc-data-management');

const mapStateToProps = (state) => {
  const {geo, CountryMsg, SSE} = state[namespace];
  return {
    geo,
    CountryMsg,
    SSE
  };
};
let sse;

@connect(mapStateToProps)
@Form.create()
class UploadLeapPoints extends PureComponent {
  state = {
    district: '',
    flag: undefined,
    isLoading: false,
    modalValue: '',
    InfoVisible: false,
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
    isSelect: true,
    Integer: '',
    UploadValue: '',
    isCSV: false,
    CSVvalue: '',
    iconIsShow: false,
  };

  componentDidMount = async () => {
    const {dispatch} = this.props;
    dispatch({
      type: `${namespace}/fetchCountryGeo`,
    });
    // const res = await dispatch({
    //   type: `${namespace}/checkIsUpload`,
    //   payload: 'LEAPS'
    // });
    // if (res.values.length > 0) {
    //   this.setState({
    //     isSelect: true,
    //     curFileList: [
    //       {name: res.values[0].fileName,uid: res.values[0].requestId,status: 'done'},
    //     ],
    //     curOpacity: 1,
    //     curPercent: Math.floor((res.values[0].finished / res.values[0].total ) * 100),
    //     isCancel: false,
    //     curTime: res.values[0].time,
    //     curClick: true,
    //     curUuid: res.values[0].requestId
    //   });
    //   // this.fetchProgress(res.values[0].requestId);
    // }
    };

  // componentWillUnmount = () => {
  //   if (sse !== undefined) {
  //     sse.close();
  //   }
  // };


  onCountryChange = value => {
    this.setState({district: value, isSelect: false});
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/savePagFlag`,
      payload: value
    })
  };

  onRemoveFile = () => {
    return true
  };

  onUploadFinished = (resp) => {
    let fileList = [...resp.fileList];
    let that = this;
    fileList = fileList.slice(-1);
    // 设置当前显示文件个数
    this.setState({
      curFileList: fileList,
      curPercent: 0,
      curOpacity: 0,
      isCancel: true,
      curClick: true,
      isSelect: true,
      isDisPlay: 'block',
    });
    if (resp.file.status !== "uploading") {
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
        //   isSelect: true,
        //   curClick: true,
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
        //       curPercent: Math.floor((data.finished / data.total ) * 100),
        //       isSelect: true,
        //     });
        //     if (resp.file.response !== undefined && resp.file.response.code === 200) {
        //       if (data.completed === true && data.unknownPartNumbers.length > 0) {
        //         that.setState({
        //           visible: true,
        //           modalValue: data.unknownPartNumbers,
        //           isSelect: false,
        //           curClick: false,
        //           curOpacity: 1,
        //           isDisPlay: 'none',
        //           curStatus: 'success',
        //           isCancel: true,
        //         });
        //         sse.close();
        //       }
        //       if (data.completed === true && data.failed === false && data.total === data.finished && data.unknownPartNumbers.length <= 0) {
        //         that.setState({
        //           InfoVisible: true,
        //           isSelect: false,
        //           curOpacity: 1,
        //           curStatus: 'success',
        //           curClick: false,
        //           isDisPlay: 'none',
        //           isCancel: true,
        //         });
        //         sse.close();
        //       }
        //       if (data.completed === true && data.unknownPartNumbers.length === 0 && data.failed === true) {
        //         that.setState({
        //           InfoVisible: false,
        //           isSelect: false,
        //           curClick: false,
        //           curStatus: 'exception',
        //           curOpacity: 1,
        //           curPercent: 100,
        //           isDisPlay: 'none',
        //           isCancel: true,
        //         });
        //         sse.close();
        //       }
        //     }
        //
        //     if (data.total.length > 0 && data.unknownPartNumbers <= 0) {
        //       that.setState({
        //         InfoVisible: true,
        //       })
        //     }
        //     if (data.completed) {
        //       sse.close();
        //     }
        //   });
        // }
      }
    }
    // console.log(resp.file.status)
    if (resp.file.status === "done"){
      if (resp.file.response.code === 200) {
        this.setState({
          InfoVisible: true,
          isSelect: false,
          curClick: false,
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
      });
      // const { dispatch } = this.props;
      // dispatch({
      //   type: `${namespace}/CanCelProgressBar`,
      //   payload: this.state.curUuid
      // }).then( (res) => {
      //   if (res){
      //
      //     sse.close()
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
              // .substring(0,  resp.file.response.message.length-5)
            .substring(20)
            .replace(/\s/ig,",")
            .replace(/,=,/ig,",")
            .split(',')
            .filter(function(item, index, arr) {
              if (index % 2 !== 1) {
                return item;
              }
            }).join(', ')
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
  //       sse.close();
  //     }
  //   });
  // };

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

  EmptyComponent = () => {
    return (
      <Empty
        description={
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <b>We didn’t find any results</b>
            <span>Try checking your spelling or using other query conditions</span>
          </div>
        }
        image={Nodata}
      >
      </Empty>
    )
  };

  handleOk = () => {
    this.setState({
      visible: false
    })
  };

  InfoHandleOk = () => {
    this.setState({
      InfoVisible: false,
    });
  };

  render() {
    const {geo} = this.props;
    const {district} = this.state;
    let locale = {
      emptyText: this.EmptyComponent,
    };
    const token = localStorage.getItem('dpc-data-management');
    return (
      <div>
        <div className={Styles.leapsUpload_product}>
          <div className={Styles.tagMark} style={{display: this.state.isDisPlay}} />
          <div className={Styles.option}>
            <label style={{marginRight: '10px'}}>Geo/Reg/Sub Reg/Countries:</label>
            <TreeSelect
              showSearch
              style={{width: 200}}
              // value={CountryMsg}
              dropdownStyle={{maxHeight: 400, overflowY: 'auto'}}
              treeData={geo}
              placeholder="Please select"
              treeDefaultExpandAll={false}
              notFoundContent="No Data"
              allowClear
              locale={locale}
              onChange={this.onCountryChange}
              disabled={this.state.curClick}
            />
          </div>
          <div style={{marginTop: 27}}>
            <a
              href={`${
                process.env.API_ENV}/api/v1/basedata/product/flags/download/leapPointsTemplate?dpc-data-management-token=`
                + token}
               style={{marginLeft: 15, marginTop: 26}}
               // download={'Leap Points upload'}
            >
              <Button type="primary" icon="download" disabled={this.state.curClick}>Download Template</Button>
            </a>
          </div>
          <div>
            <Upload
              name='file'
              action={`${process.env.API_ENV}/api/v1/basedata/product/leapPoints/upload/leapPointsCSV2?`
              + `dpc-data-management-token=` + token
              // + `&requestId=` + this.state.curUuid
              + `&district=` + district
              }
              onChange={this.onUploadFinished}
              onRemove={this.onRemoveFile}
              style={{marginLeft: 15}}
              fileList={this.state.curFileList}
              showUploadList={{showRemoveIcon: this.state.iconIsShow, showDownloadIcon: false}}

            >
              <Button type="primary" icon="upload" disabled={this.state.isSelect} style={{marginTop: 26}}>
                Import Leap Points
              </Button>
            </Upload>
            {
              <div style={{
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
          onCancel={() => {this.setState({visible: false})}}
          footer={[
            <Button
              key="submit"
              type="primary"
              onClick={this.handleOk}
              style={{backgroundColor: '#1890ff', borderColor: '#1890ff', color: '#fff'}}
            >
              Ok
            </Button>
          ]}
        >
          <p>Upload leap points successfully except the invalid product number as below{"：" + this.state.modalValue}</p>
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
          <p> Upload leap points successfully </p>
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

export default UploadLeapPoints;
