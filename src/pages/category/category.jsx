import React, { Component } from 'react';
import { Spin, Alert, Modal, Input, Button, Icon, Form, Upload, message, Radio, Select, Progress } from 'antd';
import { connect, router } from 'dva';
import './category.scss';
import _ from 'lodash';
import uuid from 'react-uuid';
import $ from '../../assets/jquery-vendor.js'

import zTree from 'ztree';

import 'ztree/css/zTreeStyle/zTreeStyle.css';
import { async } from 'q';
import { relative } from 'path';

const namespace = 'category';
const { confirm } = Modal;
const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;
let nodeIds = [];
let nodeLeftIds = [];
let parentAry = [];
let checkedNodes = [];
let addNum = 0;
let renderLeft = false;
let renderRight = false;

const mapStateToProps = (state) => {
  const { categoryLeft, categoryRight } = state[namespace];
  return {
    categoryLeft,
    categoryRight
  };
};

let newCount = 1;
const TREE_LEVEL = 3;

@connect(mapStateToProps)
@Form.create()
class Category extends Component {

  constructor(props) {
    super(props);
    this.state = {
      block: false,
      blockRight: false,
      enlargeLeft: true,
      enlargeRight: true,
      visible: false,
      imageUrl: null,
      description: null,
      demoUrl: null,
      datasheetUrl: null,
      learnMore: null,
      treeNodeId: null,
      loadBlock: false,
      uploadLoad: false,
      treeNodePid: null,
      editNode: null,
      sae: null,
      vendorName: undefined,
      treeNodesParrentId: null,
      res_search: null,
      restSearch: true,
      overview: null,
      saeValue: true,
      visibility: null,
      categoryLeft:[],
      categoryRight:[],
      sse: undefined,
      leftPercent:1,
      rightPercent:1,
      sseLoadBtn: true,
      sseLoadRight:true,
      sseLoadLeft:true,
    }
  }

  batchData = (value) => {
    if(this.state.sse !== undefined) {
      this.state.sse.close();
    }
    this.setState({
      leftPercent:1,
      rightPercent:1,
    });
    let leftRemain = 0;
    let rightRemain = 0;
    let timerLeft;
    let timerRight;
    if(!renderRight){
      timerLeft = setInterval(()=>{
        this.setState({
          leftPercent:this.state.leftPercent+1,
        });
      },200);
      this.setState({
        sseLoadLeft:true,
      })
    }
    if(!renderLeft){
      timerRight = setInterval(()=>{
        this.setState({
          rightPercent:this.state.rightPercent+1,
        });
      },200);
      this.setState({
        sseLoadRight:true,
      })
    }
    const token = localStorage.getItem('dpc-data-management');
    const openIds = value.map(v => '&openIds=' + v).join("");
    const _sse = new EventSource(`${process.env.API_ENV}/api/v1/category/categories/sse?dpc-data-management-token=${token}${openIds}`);
    this.setState({ sse: _sse });
    let leftTree = [];
    let rightTree = [];
    const _this = this;
    this.setState({
      categoryLeft:leftTree,
      categoryRight:rightTree,
      sseLoadBtn:true,
    });
    if(!renderRight){
      _this.leftTreeData(leftTree);
    }
    if(!renderLeft){
      _this.rightTreeData(rightTree);
    }
    _sse.addEventListener('CATEGORY_STREAM', function(e) {
      const data = JSON.parse(e.data);
      leftTree.push(...data.left.nodes);
      rightTree.push(...data.right.nodes);
      if(!renderRight){
        _this.leftTreeData(leftTree);
      }
      if(!renderLeft){
        _this.rightTreeData(rightTree);
      }
      if(data.completed) {
        _sse.close();
        clearInterval(timerLeft);
        clearInterval(timerRight);
        _this.setState({
          categoryLeft:leftTree,
          categoryRight:rightTree,
          leftPercent:100,
          rightPercent:100,
        },()=>{
          setTimeout(()=>{
            _this.setState({
              sseLoadBtn:false,
              sseLoadRight: false,
              sseLoadLeft: false,
            });
          },1000);
          renderLeft = false;
          renderRight = false;
        });
      }else{
        leftRemain = Math.floor(((data.left.total - data.left.remain) / data.left.total) * 100);
        rightRemain = Math.floor(((data.right.total - data.right.remain) / data.right.total) * 100);
        _this.setState({
          leftPercent:_this.state.leftPercent > leftRemain ? _this.state.leftPercent : leftRemain,
          rightPercent:_this.state.rightPercent > rightRemain ? _this.state.rightPercent : rightRemain,
        });
      }
    });
    _sse.addEventListener('error', function(e) {
      message.error("Network error, Please refresh");
      clearInterval(timerLeft);
      clearInterval(timerRight);
      _this.setState({
        sseLoadBtn:false,
        sseLoadRight: false,
        sseLoadLeft: false,
      });
      renderLeft = false;
      renderRight = false;
    })
  };

  componentWillMount = () => {
    this.batchData([]);
  }

  resizeFn(){
    $("#treeDemo").css('width',$("#right").width() + "px");
    $("#treeDemo2").css('width',$("#right").width() + "px");
    window.onresize = function(){
      $("#treeDemo").css('width',$("#right").width() + "px");
      $("#treeDemo2").css('width',$("#right").width() + "px");
    }
  }


  leftTreeData = (value) => {
    let settingLeft = {
      view: {
        expandSpeed:"",
        addDiyDom: this.addId,
        addHoverDom: this.addHoverDom,
        removeHoverDom: this.removeHoverDom,
        selectedMulti: false
      },
      check: {
        enable: true
      },
      edit: {
        enable: true,
        showRemoveBtn: this.showRemoveBtn,
        showRenameBtn: this.showRenameBtn,
        drag:{
          inner: this.dropInner,
        }
      },
      data: {
        simpleData: {
          enable: true
        }
      },
      callback: {
        beforeDrag: this.beforeDrag,
        beforeDrop: this.beforeDropLeft,
        beforeRemove: this.beforeRemove,
        beforeRename: this.beforeRename,
        onRemove: null,
        onRename: null,
        onDrop: this.zTreeOnDropLeft,
        onExpand: this.zTreeOnExpand,
        beforeEditName: this.beforeEditName,
        onCheck: this.onCheckLeft,
      }
    };
    checkedNodes = [];
    nodeLeftIds = [];
    $(document).ready(function(){
      $.fn.zTree.init($("#treeDemo"), settingLeft, value);
      setTimeout(function(){
        $("#treeDemo li a.level2").css("background","#7CAFEC");
        $("#treeDemo li a.level3").css("background","#26E4B9");
        $("#treeDemo li a.level4").css("background","#B8E986");
        $("#treeDemo li a.level5").css("background","#ADABAB");
      },1);
    })
  }

  rightTreeData = (value) => {
    this.setState({
      blockRight: false
    })
    let settingRight = {
      view: {
        expandSpeed:"",
        addDiyDom: this.addIdRight,
        addHoverDom: this.addHoverDomRight,
        removeHoverDom: this.removeHoverDomRight,
        selectedMulti: false,
      },
      check: {
        enable: true
      },
      edit: {
        enable: true,
        showRemoveBtn: false,
        showRenameBtn: false
      },
      data: {
        simpleData: {
          enable: true,
        }
      },
      callback: {
        beforeDrag: this.beforeDragRight,
        beforeDrop: this.beforeDrop,
        onDrop: this.zTreeOnDrop,
        onExpand: this.zTreeOnExpandRight,
        onCheck: this.onCheck,
      }
    };
    nodeIds = [];
    $(document).ready(function(){
      $.fn.zTree.init($("#treeDemo2"), settingRight, value);
      setTimeout(function(){
        $("#treeDemo2 li a.level2").css("background","#B8E986");
        $("#treeDemo2 li a.level3").css("background","#ADABAB");
      },1);
    })
  }

  zTreeOnExpand(){
      $("#treeDemo li a.level2").css("background","#7CAFEC");
      $("#treeDemo li a.level3").css("background","#26E4B9");
      $("#treeDemo li a.level4").css("background","#B8E986");
      $("#treeDemo li a.level5").css("background","#ADABAB");
  }

  zTreeOnExpandRight(){
    $("#treeDemo2 li a.level2").css("background","#B8E986");
    $("#treeDemo2 li a.level3").css("background","#ADABAB");
  }

  renderOneData = async (value) => {
    this.refs.searchLeft.state.value=undefined;
    renderLeft = true;
    this.batchData(value);
  }


  onCheckLeft = (event, treeId, treeNode) =>{
    checkedNodes = [];
    nodeLeftIds = [];
    let pNode = null;
    let zTree = $.fn.zTree.getZTreeObj("treeDemo");
    let nodes = zTree.getCheckedNodes();
    for (let j=0, k=nodes.length; j<k; j++) {
      nodes[j].checkedOld = nodes[j].checked;
      if(treeNode.pId == nodes[j].id){
        pNode = nodes[j];
        zTree.checkNode(nodes[j], false, false);
      }
    }
    for (let i=0, l=nodes.length; i<l; i++) {
      if(nodes[i].id == treeNode.id){
        let parentNode = treeNode.getParentNode() ? treeNode.getParentNode().children : false;
        if(parentNode){
          let nodeAll = parentNode.every((item) => {
            return item.checked == true;
          });
          if(pNode){
            if(nodeAll){
              zTree.checkNode(pNode, true, true);
            }
          }
        }
      }
    }
    let checkedAll = zTree.getCheckedNodes();
    for(let i=0; i<checkedAll.length; i++){
      if(checkedAll[i].checked && checkedAll[i].deletable){
        checkedNodes.push(checkedAll[i]);
      }
    }
    let nodeParent = checkedAll;
    for (let m=0, n=nodeParent.length; m<n; m++) {
      if(nodeParent[m].getParentNode()){
        if(nodeParent[m].getParentNode().checked){
          nodeLeftIds.push(nodeParent[m].getParentNode().id);
          continue;
        }
      }
      nodeLeftIds.push(nodeParent[m].id);
    }
    nodeLeftIds = Array.from(new Set(nodeLeftIds));
  }

  onCheck = (event, treeId, treeNode) => {
    let nodeAry = [];
    let zTree = $.fn.zTree.getZTreeObj("treeDemo2");
    let nodes = zTree.getCheckedNodes();
    let pNode = null;
    for (let j=0, k=nodes.length; j<k; j++) {
      nodes[j].checkedOld = nodes[j].checked;
      if(treeNode.pId == nodes[j].id){
        pNode = nodes[j];
        zTree.checkNode(nodes[j], false, false);
      }
    }
    for (let i=0, l=nodes.length; i<l; i++) {
      if(nodes[i].id == treeNode.id){
        let parentNode = treeNode.getParentNode() ? treeNode.getParentNode().children : false;
        if(parentNode){
          let nodeAll = parentNode.every((item) => {
            return item.checked == true;
          });
          if(pNode){
            if(nodeAll){
              zTree.checkNode(pNode, true, true);
            }
          }
        }
      }
    }
    let nodeParent = zTree.getCheckedNodes();
    for (let m=0, n=nodeParent.length; m<n; m++) {
      if(nodeParent[m].getParentNode()){
        if(nodeParent[m].getParentNode().checked){
          if(nodeParent[m].parentAtLeft){
            parentAry.push(nodeParent[m].getParentNode().id);
          }
          nodeAry.push(nodeParent[m].getParentNode().id);
          continue;
        }
      }
      nodeAry.push(nodeParent[m].id);
    }
    parentAry = Array.from(new Set(parentAry));
    nodeIds = Array.from(new Set(nodeAry));
  }
  dropInner(treeId, nodes, targetNode){
    if (targetNode && targetNode.dropInner === false) {
      return false;
    }
    return true;
  }

  beforeDrag(treeId, treeNodes) {
    for (let i=0,l=treeNodes.length; i<l; i++) {
      if (treeNodes[i].drag === false) {
        return false;
      }
    }
    return true;
  }


  beforeDragRight(treeId, treeNodes){
    if(treeNodes[0].level > 1){
      for (let i=0,l=treeNodes.length; i<l; i++) {
        if (treeNodes[i].drag === false) {
          return false;
        }
      }
      return true;
    }else{
      if(treeNodes[0].drag){
        return true;
      }
      return false;
    }
  }
  beforeDrop = (treeId, treeNodes, targetNode, moveType) => {
    if(targetNode){
      if(targetNode.level >= TREE_LEVEL){
        this.setState({
          treeNodesParrentId:treeNodes[0].pId
        })
        return true;
      }else{
        return false;
      }
    }
    return targetNode ? targetNode.drop !== false : true;
  }

  beforeDropLeft = async (treeId, treeNodes, targetNode, moveType) => {
    if(targetNode.level == 0){
      return false;
    }
    return targetNode ? targetNode.drop !== false : true;
  }

  filter(treeId, parentNode, childNodes) {
    if (!childNodes) return null;
    for (let i=0, l=childNodes.length; i<l; i++) {
      childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
    }
    return childNodes;
  }
  beforeRemove = async (treeId, treeNode) => {
    if(treeNode.fromRight){
      if((checkedNodes.length > 0 && treeNode.checked) || checkedNodes < 1){
        confirm({
          title: 'Do you want to delete the category on left tree. Category will be displayed on right tree again.',
          onOk:async () => {
            this.setState({
              sseLoadBtn: true,
            })
            this.zTreeOnRemove(null,treeId, treeNode);
          },
          onCancel:async () => {
            this.renderOneData([treeNode.pId]);
          },
        });
      }else{
        Modal.warning({
          title: "Please select this category and delete",
        });
        this.batchData([treeNode.pId]);
        return false;
      }
    }else{
      confirm({
        title: "Please confirm to delete this category: " + treeNode.id,
        onOk:async () => {
          this.setState({
            sseLoadBtn: true,
          })
          this.zTreeOnRemove(null,treeId, treeNode);
        },
        onCancel:async () => {
          this.renderOneData([treeNode.pId]);
        },
      });
    }
  }



  zTreeOnDropLeft = async (event, treeId, treeNodes, targetNode, moveType) => {
    this.refs.searchLeft.state.value=undefined;
    this.setState({
      sseLoadBtn: true
    })
    let categoryLeft = this.state.categoryLeft;
    let dropParentId = null;
    for(let i=0; i<categoryLeft.length; i++){
      if(categoryLeft[i].id == treeNodes[0].id){
        dropParentId = categoryLeft[i].pId;
        break;
      }
    }
    if((nodeLeftIds.length > 0 && treeNodes[0].checked) || (nodeLeftIds.length < 1) || (treeNodes[0].drag && treeNodes[0].level <= 3)){
      if(!targetNode || targetNode.level == 0){
        Modal.warning({
          title: "Please drag this category again",
        });
        this.renderOneData([]);
        return;
      }
      const { dispatch } = this.props;
      let getIds = [];
      let params = {};
      getIds = _.map(treeNodes[0].getParentNode().children, child => child.id);
      let nodeSortAry = [];
      if(nodeLeftIds.length > 0){
        for(let i=0; i<getIds.length; i++){
          let flag = true;
          for(let j=0; j<nodeLeftIds.length; j++){
            if(nodeLeftIds[j] == getIds[i] && getIds[i] != treeNodes[0].id){
              flag = false;
            }
          }
          if(flag){
            nodeSortAry.push(getIds[i]);
          }
        }
        getIds = nodeSortAry;
      }
      let sortIds = _.fill(getIds, treeNodes[0].id ,_.indexOf(getIds, targetNode.id),_.indexOf(getIds, targetNode.id));
      if(nodeLeftIds.length > 0){
        let num = sortIds.indexOf(treeNodes[0].id);
        let arr = [];
        for(let m=0; m<nodeLeftIds.length; m++){
          arr.push(nodeLeftIds[m]);
        }
        nodeLeftIds.unshift(num + 1, 0);
        Array.prototype.splice.apply(sortIds, nodeLeftIds);
        nodeLeftIds = arr;
      }
      params = {
        draggedIds: (nodeLeftIds.length > 0 && treeNodes[0].checked) ? nodeLeftIds : [treeNodes[0].id],
        ids: sortIds,
        pId: treeNodes[0].getParentNode().id,
        rightToLeft: false
      }
      let codeMsg = await dispatch({
        type: `${namespace}/dragCategory`,
        payload: params
      });
      console.log(codeMsg);
      if(!codeMsg){
        Modal.warning({
          title: 'Network exception, please try again',
        });
        this.renderOneData([]);
        return;
      }
      if(codeMsg.code != 200){
          Modal.warning({
            title: codeMsg.message,
          });
      }else{
        if(codeMsg.values.length > 0){
          Modal.warning({
            title: _.map(codeMsg.values,item => {return item.id}).join(",") + " can not be dragged & dropped to this level",
          });
        }
      }
      this.renderOneData([treeNodes[0].pId,dropParentId]);
    }else{
      Modal.warning({
        title: "Please drag this checked category",
      });
      this.renderOneData([treeNodes[0].pId,dropParentId]);
      return;
    }
  }

  zTreeOnDrop = async (event, treeId, treeNodes, targetNode, moveType) => {
    this.setState({
      sseLoadBtn: true
    })
    if(targetNode){
      if((nodeIds.length > 0 && treeNodes[0].checked) || (nodeIds.length < 1)){
        this.refs.searchRight.state.value=undefined;
        this.refs.searchLeft.state.value=undefined;
        if(targetNode.level >= TREE_LEVEL){
          const { dispatch } = this.props;
          let getIds = [];
          let params = {};
          getIds = _.map(treeNodes[0].getParentNode().children, child => child.id);
          params = {
            draggedIds: nodeIds.length > 0 ? nodeIds : [treeNodes[0].id],
            ids: _.fill(getIds, treeNodes[0].id ,_.indexOf(getIds, targetNode.id),_.indexOf(getIds, targetNode.id)),
            pId: treeNodes[0].getParentNode().id,
            rightToLeft: true
          }
          let codeMsg = await dispatch({
            type: `${namespace}/dragCategory`,
            payload: params
          });
          console.log(codeMsg);
          if(codeMsg){
            if(codeMsg.code != 200){
              if(codeMsg.code == 2003){
                let atParent = nodeIds.length > 0 ? parentAry.join(",") : [treeNodes[0].id]
                Modal.warning({
                  title: "Categories already exist on left tree：" + atParent,
                });
              }else{
                Modal.warning({
                  title: codeMsg.message,
                });
              }
            }
            this.batchData([treeNodes[0].pId,this.state.treeNodesParrentId]);
          }else{
            Modal.warning({
              title: "Network exception, please try again",
            });
            this.batchData([]);
          }
        }
      }else{
        Modal.warning({
          title: "Please drag this checked category",
        });
        this.batchData([treeNodes[0].pId,this.state.treeNodesParrentId]);
        return;
      }
    }else{
      Modal.warning({
        title: "Please drag this category again",
      });
      this.batchData([treeNodes[0].pId,this.state.treeNodesParrentId]);
      return;
    }
  }

  zTreeOnRemove = async (event, treeId, treeNode) => {
    const { dispatch } = this.props;
    if(treeNode.fromRight){
      this.refs.searchRight.state.value=undefined;
      this.refs.searchLeft.state.value=undefined;
      let params = {
        ids: checkedNodes.length < 1 ? [treeNode.id] : _.map(checkedNodes,(item) => {return item.id})
      }
      let codeMsg = await dispatch({
        type: `${namespace}/deleteCategory`,
        payload: params
      });
      if(codeMsg.code == 200){
        this.batchData([treeNode.pId]);
      }else{
        Modal.warning({
          title: codeMsg.message,
        });
        this.renderOneData([]);
      }
    }else{
      this.refs.searchLeft.state.value=undefined;
      let params = {
        ids: [treeNode.id]
      }
      let codeMsg = await dispatch({
        type: `${namespace}/deleteCategory`,
        payload: params
      });
      if(codeMsg.code == 200){
        this.renderOneData([treeNode.pId]);
      }else{
        Modal.warning({
          title: codeMsg.message,
        });
        this.renderOneData([]);
      }
    }
  }

  beforeRename(treeId, treeNode, newName) {
    if (newName.length == 0) {
      setTimeout(function() {
        let zTree = $.fn.zTree.getZTreeObj("treeDemo");
        zTree.cancelEditName();
        Modal.warning({
          title: "node name cannot be empty",
        });
      }, 0);
      return false;
    }
    return true;
  }

  addId (treeId, treeNode) {
    let sObj = $("#" + treeNode.tId + "_span");
    let addStr;
    let isSae;
    if(treeNode.sae == 1){
      isSae = "SAE";
      addStr = "<span style='font-size:14px;' id='id_" + treeNode.tId
    + "' title='id' onfocus='this.blur();'>("+treeNode.id+") <span style='color:#fff;background:#8246AF;padding:0 3px'>"+isSae+"</span></span>";
    }else{
      addStr = "<span style='font-size:14px;' id='id_" + treeNode.tId
    + "' title='id' onfocus='this.blur();'>("+treeNode.id+")</span>";
    }
    sObj.after(addStr);
  };
  addIdRight (treeId, treeNode) {
    let sObj = $("#" + treeNode.tId + "_span");
    let addStr;
    if(treeNode.new){
      addStr = "<span style='font-size:14px;' id='id_" + treeNode.tId + "' title='id' onfocus='this.blur();'>("+treeNode.id+") <span style='color:#E1140A;background:#FFEEED;padding:0 3px'>NEW</span></span>";
    }else{
      addStr = "<span style='font-size:14px;' id='id_" + treeNode.tId + "' title='id' onfocus='this.blur();'>("+treeNode.id+")</span>";
    }
    sObj.after(addStr);
  };

  addHoverDom = (treeId, treeNode) => {
    const { dispatch } = this.props;
    let sObj = $("#" + treeNode.tId + "_span");
    if(!treeNode.addable){
      return false;
    }
    if(treeNode.addable && treeNode.level == 3){
      return false;
    }
    if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0 || treeNode.level > TREE_LEVEL) return;
    let addStr = "<span class='button add' id='addBtn_" + treeNode.tId
      + "' title='add node' onfocus='this.blur();'></span>";
    sObj.next("span").after(addStr);
    let btn = $("#addBtn_"+treeNode.tId);
    if (btn) btn.bind("click", async () => {
      this.setState({
        sseLoadBtn: true,
      })
      let params = {
        name: "new node" + (newCount),
        level: treeNode.level+1,
        pId: treeNode.id
      }
      let getId = await dispatch({
        type: `${namespace}/addCategory`,
        payload: params
      });
      if(getId.code == 200){
        this.setState({
          visible: true,
          saeValue: true,
          restSearch:true
        });
        this.setState({
          treeNodeId:getId.value,
          treeNodePid: treeNode.id
        })
        let params = {
          id: getId.value,
        }
        let values = await dispatch({
          type: `${namespace}/getEditCategory`,
          payload: params
        });
        this.props.form.setFieldsValue({
          imageUrl: values.imageUrl,
          description: values.description,
          demoUrl: values.demoUrl,
          datasheetUrl: values.dataSheetUrl,
          learnMore: values.learnMore,
          sae: values.sae,
          vendorName: values.vendor ? values.vendor : undefined,
          res_search:values.restrictedSearch,
          overview: values.overview,
          visibility: values.visibility
        });
        this.setState({
          editNode:values
        });
        if(values.sae == 1){
          this.setState({
            saeValue: false
          })
        }else{
          this.setState({
            saeValue: true
          })
        }
        addNum = 1;
        return false;
      }else{
        Modal.warning({
          title: getId.message,
        });
        this.renderOneData([]);
        return false;
      }
    });
  };
  addHoverDomRight  = (treeId, treeNode) => {
    if(!treeNode.parentAtLeft){
      return;
    }
    if ($("#dragBtn_"+treeNode.tId).length>0) return;
    const { dispatch } = this.props;
    let sObj = $("#" + treeNode.tId + "_span");
    let addStr = "<span class='button add trans' id='dragBtn_" + treeNode.tId
      + "' title='move to the parent' onfocus='this.blur();'></span>";
    sObj.next("span").after(addStr);
    let btn = $("#dragBtn_"+treeNode.tId);
    if (btn) btn.bind("click", async () => {
      confirm({
        title: 'Do you want to move to the left under the parent node?',
        onOk: async () => {
          this.setState({
            sseLoadBtn: true,
          })
          this.refs.searchLeft.state.value=undefined;
          this.refs.searchRight.state.value=undefined;
          let params = {
            id: treeNode.id
          }
          let getId = await dispatch({
            type: `${namespace}/transferCategory`,
            payload: params
          });
          if(getId.code == 200){
            this.batchData([treeNode.id]);
            return false;
          }else{
            Modal.warning({
              title: getId.message,
            });
            this.setState({
              sseLoadBtn: false,
            })
            return false;
          }
        },
        onCancel() {
        },
      });
    });
  }
  removeHoverDom(treeId, treeNode) {
    $("#addBtn_"+treeNode.tId).unbind().remove();
  };

  removeHoverDomRight(treeId,treeNode){
    $("#dragBtn_"+treeNode.tId).unbind().remove();
  }

  showRemoveBtn(treeId, treeNode) {
    if(!treeNode.configurable){
      return false;
    }
    if(!treeNode.deletable){
        return false;
    }else{
      if(treeNode.children){
        if(treeNode.children.length > 0){
          return false;
        }else{
          return true;
        }
      }else{
        if(treeNode.deletable){
          return true;
        }
      }
      return treeNode.isParent ? false: true;
    }
  }
  showRenameBtn(treeId, treeNode) {
    if(!treeNode.left){
      return false;
    }
    if(treeNode.editable){
      return true;
    }else{
      if(!treeNode.configurable){
        return true;
      }
      if(!treeNode.editable){
          return false;
      }
      if(treeNode.level <= TREE_LEVEL){
        return true;
      }else{
        return false;
      }
    }
  }


  // CancelSelect() {
  //   let treeObj = $.fn.zTree.getZTreeObj("treeDemo");
  //   let nodes = treeObj.getSelectedNodes();
  //   if(nodes.length>0){
  //   //  treeObj.cancelSelectedNode(nodes[0]);
  //   }
  // }

  handleLeftSearch = async () => {
    this.setState({
      leftPercent: 0,
      block:false,
    })
    let value = this.refs.searchLeft.state.value;
    if(value != undefined && value.trim().length > 0){
      let timer = setInterval(()=>{
        this.setState({
          leftPercent:this.state.leftPercent >= 100 ? 100 : this.state.leftPercent+1,
          sseLoadLeft:true,
          sseLoadBtn: true,
        })
      },500);
      const { dispatch } = this.props;
      let params = {
        left: true,
        q: value
      }
      let leftData = await dispatch({
        type: `${namespace}/searchCategory`,
        payload: params
      });
      if(leftData.code == 200){
        this.leftTreeData(leftData.value.left);
      }else if(leftData.code == 2012){
        this.setState({
          block: true
        })
        $.fn.zTree.init($("#treeDemo"), {}, []);
      }else{
        Modal.warning({
          title: leftData.message,
        });
      }
      clearInterval(timer);
      this.setState({
        leftPercent:100,
      },()=>{
        setTimeout(()=>{
          this.setState({
            sseLoadLeft:false,
            sseLoadBtn: false,
          })
        },500)
      })
    }else{
      this.renderOneData([]);
    }
  };

  handleRightSearch = async () => {
    this.setState({
      blockRight:false,
      rightPercent: 0,
    });
    let value = this.refs.searchRight.state.value;
    if(value != undefined && value.trim().length > 0){
      let timer = setInterval(()=>{
        this.setState({
          rightPercent:this.state.rightPercent >= 100 ? 100 : this.state.rightPercent+1,
          sseLoadRight:true,
          sseLoadBtn: true,
        })
      },500);
      const { dispatch } = this.props;
      let params = {
        left: false,
        q: value
      }
      let rightData = await dispatch({
        type: `${namespace}/searchCategory`,
        payload: params
      });
      if(rightData.code == 200){
        this.rightTreeData(rightData.value.right);
      }else if(rightData.code == 2012){
        this.setState({
          blockRight: true
        })
        $.fn.zTree.init($("#treeDemo2"), {}, []);
      }else{
        Modal.warning({
          title: rightData.message,
        });
      }
      clearInterval(timer);
      this.setState({
        rightPercent:100,
      },()=>{
        setTimeout(()=>{
          this.setState({
            sseLoadRight:false,
            sseLoadBtn: false,
          })
        },500)
      })
    }else{
      renderRight = true;
      this.batchData([]);
    }
  };

  enlargeLeftFn = () => {
    this.setState({
      enlargeLeft: !this.state.enlargeLeft
    })
  };

  enlargeRightFn = () => {
    this.setState({
      enlargeRight: !this.state.enlargeRight
    })
  }


  beforeEditName = async (treeId, treeNode) => {
    if(treeNode.configurable){
      this.setState({
        restSearch:true
      })
    }else{
      this.setState({
        restSearch:false
      })
    }
    this.setState({
      treeNodeId: treeNode.id,
      treeNodePid: treeNode.pId
    });
    const {dispatch} = this.props;
    let params = {
      id: treeNode.id,
    }
    let values = await dispatch({
      type: `${namespace}/getEditCategory`,
      payload: params
    });
    this.props.form.setFieldsValue({
      imageUrl: values.imageUrl,
      description: values.description,
      demoUrl: values.demoUrl,
      datasheetUrl: values.dataSheetUrl,
      learnMore: values.learnMore,
      sae: values.sae,
      vendorName: values.vendor ? values.vendor : undefined,
      res_search:values.restrictedSearch,
      overview: values.overview,
      visibility: values.visibility
    });
    if(values.sae == 1){
      this.setState({
        saeValue: false
      })
    }else{
      this.setState({
        saeValue: true
      })
    }
    this.setState({
      editNode:values,
      visible: true,
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    if(this.state.uploadLoad){
      return;
    }
    if(this.state.restSearch){
      this.props.form.validateFields(async (err, values) => {
        if (!err) {
          let editValue = this.state.editNode;
          if(editValue.imageUrl == values.imageUrl && editValue.description == values.description && editValue.demoUrl == values.demoUrl && editValue.dataSheetUrl == values.datasheetUrl && editValue.learnMore == values.learnMore && editValue.sae == values.sae && editValue.vendor == values.vendorName && editValue.restrictedSearch == values.res_search && editValue.overview == values.overview && editValue.visibility == values.visibility && addNum == 0){
              this.handleCancel();
          }else{
            addNum = 0;
            this.setState({
              visible: false,
              sseLoadBtn: true,
            })
            const {dispatch} = this.props;
            let params = {
              id: this.state.treeNodeId,
              imageUrl: values.imageUrl,
              description: values.description,
              demoUrl: values.demoUrl,
              datasheetUrl: values.datasheetUrl,
              learnMore: values.learnMore,
              sae: values.sae,
              vendorName: values.vendorName ? values.vendorName : null,
              res_search:values.res_search,
              overview: values.overview,
              visibility: values.visibility
            }
            let create = await dispatch({
              type: `${namespace}/editCategory`,
              payload: params
            });
            if (create.code == 200) {
              this.props.form.setFieldsValue({
                imageUrl: null,
                description:null,
                demoUrl:null,
                datasheetUrl:null,
                learnMore: null,
                sae: null,
                vendorName: null,
                res_search:values.res_search,
                overview:values.overview,
                visibility:values.visibility
              });
              this.renderOneData([this.state.treeNodePid]);
            } else {
              message.error(create.message);
              this.setState({
                sseLoadBtn: false,
              })
            }
          }
        }else{
          if(!values.sae){
            message.warning("Please maintain SAE!");
          }
        }
      });
    }else{
      this.props.form.validateFields(async (err, values) => {
        if (!err) {
          let editValue = this.state.editNode;
          if(editValue.imageUrl == values.imageUrl && editValue.restrictedSearch == values.res_search && editValue.overview == values.overview && editValue.visibility == values.visibility){
            this.handleCancel();
          }else{
            this.setState({
              visible: false,
              sseLoadBtn: true,
            })
            const {dispatch} = this.props;
            let params = {
              id: this.state.treeNodeId,
              res_search:values.res_search,
              overview:values.overview,
              visibility:values.visibility,
              imageUrl: values.imageUrl,
            }
            let create = await dispatch({
              type: `${namespace}/editCategorySearch`,
              payload: params
            });
            if (create.code == 200) {
              this.props.form.setFieldsValue({
                res_search: null,
                overview: null,
                visibility: null
              });
              this.renderOneData([this.state.treeNodePid]);
            } else {
              message.error(create.message);
              this.setState({
                sseLoadBtn: false,
              })
            }
          }
        }
      });
    }
  };

  handleCancel = async e => {
    if(this.state.uploadLoad){
      return;
    }
    this.setState({
      visible: false,
      uploadLoad: false
    });
    this.props.form.setFieldsValue({
      imageUrl: null,
      description:null,
      demoUrl:null,
      datasheetUrl:null,
      learnMore: null,
      sae: null,
      vendorName: undefined,
      res_search: null,
      overview: null,
      visibility: null
    });
    if(addNum == 1){
      addNum = 0;
      const { dispatch } = this.props;
      let params = {
        ids: [this.state.treeNodeId]
      }
      let codeMsg = await dispatch({
        type: `${namespace}/deleteCategory`,
        payload: params
      });
      if(codeMsg.code == 200){
        this.renderOneData([this.state.treeNodePid]);
      }else{
        Modal.warning({
          title: codeMsg.message,
        });
        this.renderOneData([]);
      }
    }
  };

  beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    if (!isJpgOrPng) {
      message.warning('You can only upload jpeg/png/jpg file!', 3);
    }
    return isJpgOrPng;
  }

  uploadImage = (info) => {
    if (info.file.status === 'done') {
      if(info.file.response.code == 200){
        this.props.form.setFieldsValue({
          imageUrl: info.file.response.value
        });
        this.setState({
          uploadLoad: false
        })
      }else{
        message.warning('Your file upload failed, please upload it again!');
      }
    }
  };

  beforeUploadTranslate = (file) => {
    this.setState({
      loading: true
    })
  }

  uploadTranslate = (info) => {
    if (info.file.status === 'done') {
      if(info.file.response.code == 200){
        message.success("Import file succeeded!");
      }
      this.setState({
        loading: false
      })
    }else if (info.file.status === 'error') {
      message.warning('Your file import failed, please import it again!');
      this.setState({
        loading: false
      })
    }
  }

  saeRadio = (e) => {
    if(e.target.value == 1){
      this.setState({
        saeValue: false
      })
    }else{
      this.setState({
        saeValue: true
      });
      this.props.form.setFieldsValue({
        vendorName: null,
      });
    }
  }

  loadClick = (e) => {
    e.preventDefault();
    message.warning("The tree is trying to load, Please expand the node later");
  }

  // recallFn = () => {
  //   confirm({
  //     title: 'Confirm to withdraw',
  //     onOk:async () => {
  //       const {dispatch} = this.props;
  //       let params = {

  //       }
  //       let recall = await dispatch({
  //         type: `${namespace}/recallCategory`,
  //         payload: params
  //       });
  //       if(recall.code == 200){
  //         this.renderLeftData([]);
  //       }else{
  //         message.warning(recall.message);
  //       }
  //     },
  //     onCancel: () => {
  //     },
  //   });
  // }

  render() {
    const token = localStorage.getItem('dpc-data-management');
    const { getFieldDecorator } = this.props.form;
    const categoryLeft = this.state.categoryLeft;
    const ids = _.map(categoryLeft.filter( (item) => {
      return item.level === 1
    }), v => 'ids=' +v.id).join('&');
    return (
      <div style={{position:'relative'}}>
        <a style={{marginRight:20}} href={`${process.env.API_ENV}/api/v1/category/categories/export?`+ ids + `&dpc-data-management-token=` + token} download={'price-list'}>
          <Button type="primary" icon="download" disabled={this.state.sseLoadBtn}>Export Tree</Button>
        </a>
        <a style={{marginRight:20}} href={`${process.env.API_ENV}/api/v1/category/categories/translation/export?`+ ids + `&dpc-data-management-token=` + token} download={'price-list'}>
          <Button icon="download" disabled={this.state.sseLoadBtn}>Export Translation</Button>
        </a>
        <Upload
          name='file'
          onChange={this.uploadTranslate}
          showUploadList={false}
          action={`${process.env.API_ENV}/api/v1/category/categories/translation/import?dpc-data-management-token=` + token}
          beforeUpload={this.beforeUploadTranslate}
        >
          <Button icon="upload" disabled={this.state.sseLoadBtn}>Import Translation</Button>
        </Upload>
        {/* <Button type="primary" disabled={this.state.loading} icon="rollback" onClick={this.recallFn} style={{marginLeft:20}}>Recall</Button> */}
        <div className="loadBlock" style={{zIndex:200,display:`${this.state.loadBlock ? 'block': 'none'}`}}>
            <Spin tip="The tree is trying to load, please wait a moment"  spinning size="large">
            </Spin>
        </div>
        <div style={{display: 'flex'}} id="ztree-box">
          <div id="left" className={this.state.enlargeLeft ? 'zTreeDemoBackground left ' : 'zTreeDemoBackground left enlargeLeft' } style={{float:'left',position:'relative'}}>
            <div className="sseLeft" onClick={this.loadClick} style={{display:`${this.state.sseLoadBtn ? 'block': 'none'}`}}></div>
            <div className='bgLeft'>
              <Progress percent={this.state.leftPercent} showInfo={false} type="line" status="active" strokeWidth={4} style={{position:'absolute',left:0,top:"-10px",display:`${this.state.sseLoadLeft ? 'block': 'none'}`}} />
            </div>
              <Input placeholder="input search text" ref="searchLeft" allowClear onPressEnter={this.handleLeftSearch} className="treeSearch" />
              <Button type="primary" onClick={this.handleLeftSearch} className="treeSearchBtn">Search</Button>
              <Button type="primary" onClick={this.enlargeLeftFn} className="enlargeBtn">{this.state.enlargeLeft ? <Icon type="right-circle" /> : <Icon type="left-circle" />}</Button>
            <ul id="treeDemo" className={this.state.enlargeLeft ? 'ztree' : 'ztree enlargeLeftUl'}></ul>
            <div className="nullResult" style={{display:`${this.state.block ? 'block': 'none'}`}}>{'No search results'}</div>
          </div>
          <div id="right" className={this.state.enlargeRight ? 'right' : 'right enlargeLeft' } style={{float:'left',position:'relative',width: '48%',minWidth: '380px',height:'602px'}}>
            <div className="sseRight" onClick={this.loadClick} style={{display:`${this.state.sseLoadBtn ? 'block': 'none'}`}}></div>
            <div className='bgRight'>
              <Progress percent={this.state.rightPercent} showInfo={false} strokeWidth={4} status="active" type="line" style={{position:'absolute',left:0,top:"-10px",display:`${this.state.sseLoadRight ? 'block': 'none'}`}} />
            </div>
            <Input placeholder="input search text" ref="searchRight" allowClear onPressEnter={this.handleRightSearch} className="treeSearch" />
            <Button type="primary" onClick={this.handleRightSearch} className="treeSearchBtn">Search</Button>
            <Button type="primary" onClick={this.enlargeRightFn} className='enlargeRightBtn'>{this.state.enlargeRight ? <Icon type="left-circle" /> : <Icon type="right-circle" />}</Button>
            <ul id="treeDemo2" className={this.state.enlargeRight ? 'ztree' : 'ztree enlargeLeftUl'}></ul>
            <div className="nullResult" style={{marginLeft:0, display:`${this.state.blockRight ? 'block': 'none'}`}}>{'No search results'}</div>
          </div>
          <Modal
            title="Edit Category"
            visible={this.state.visible}
            centered
            onOk={this.handleSubmit}
            onCancel={this.handleCancel}
            okText="OK"
            cancelText="Cancel"
            okButtonProps={{ disabled: this.state.uploadLoad }}
            cancelButtonProps={{ disabled: this.state.uploadLoad }}
            closable={!this.state.uploadLoad}
            maskClosable={false}
          >
            <Form onSubmit={this.handleSubmit} className="edit-form" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
              <Form.Item label={'Image'}>
                {getFieldDecorator('imageUrl')(<Input placeholder="Please Input text" allowClear/>)}
                <Upload
                  name='file'
                  onChange={this.uploadImage}
                  showUploadList={false}
                  action={`${process.env.API_ENV}/api/v1/category/categories/${this.state.treeNodeId}/upload/image?dpc-data-management-token=` + token}
                  beforeUpload={this.beforeUpload}
                  disabled={this.state.uploadLoad}
                >
                  <Button disabled={this.state.uploadLoad}><Icon type="upload" /> Upload</Button>
                </Upload>
              </Form.Item>
              <div style={{display:`${this.state.restSearch ? 'block': 'none'}`}}>
                <Form.Item label={'Description'}>
                  {getFieldDecorator('description', {
                      rules: [
                        {
                          required: true,
                          message: 'Please input text!',
                        }
                      ],
                    })(<Input placeholder="Please Input text" allowClear/>)}
                </Form.Item>
                <Form.Item label={'360D Demo URL'}>
                  {getFieldDecorator('demoUrl')(<Input placeholder="Please Input text" allowClear/>)}
                </Form.Item>
                <Form.Item label={'Datasheet URL'}>
                  {getFieldDecorator('datasheetUrl')(<Input placeholder="Please Input text" allowClear/>)}
                </Form.Item>
                <Form.Item label={'Learn More'}>
                  {getFieldDecorator('learnMore')(<Input placeholder="Please Input text" allowClear/>)}
                </Form.Item>
                <Form.Item label="SAE">
                  {getFieldDecorator('sae', {
                      rules: [
                        {
                          required: this.state.restSearch ? true : false,
                          message: 'Please maintain SAE',
                        }
                      ],
                    })(
                    <Radio.Group onChange={this.saeRadio}>
                      <Radio value={1}>Yes</Radio>
                      <Radio value={0}>No</Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
                <Form.Item label="Vendor name">
                {getFieldDecorator('vendorName')(
                  <Select placeholder="Please select Vendor name" allowClear disabled={this.state.saeValue}>
                    <Option value={"Nutanix"}>Nutanix</Option>
                    <Option value={"Datacore"}>Datacore</Option>
                    <Option value={"Cloudian"}>Cloudian</Option>
                    <Option value={"Nexenta"}>Nexenta</Option>
                    <Option value={"NetApp"}>NetApp</Option>
                  </Select>
                )}
              </Form.Item>
              </div>
              <Form.Item label="Restricted Search">
                {getFieldDecorator('res_search')(
                  <Radio.Group>
                    <Radio value={1}>Yes</Radio>
                    <Radio value={0}>No</Radio>
                  </Radio.Group>
                )}
                <p className="rest-sear">All children inherit the value</p>
              </Form.Item>
              <Form.Item label="Overview">
                {getFieldDecorator('overview')(
                  <TextArea
                  placeholder="Please input overview"
                  rows={4}
                  style={{resize:'none'}}
                  />
                )}
              </Form.Item>
              <Form.Item label="Visibility">
                {getFieldDecorator('visibility')(
                  <Radio.Group>
                    <Radio value={1}>Yes</Radio>
                    <Radio value={0}>No</Radio>
                  </Radio.Group>
                )}
                <p className="rest-sear">All children inherit the value</p>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    );
  }
}

export default Category;
