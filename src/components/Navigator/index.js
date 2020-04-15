import React, {Component} from 'react';
import {connect, router} from 'dva';
import {Menu, Icon} from 'antd';
import {FormattedMessage, setLocale} from 'umi-plugin-react/locale';
import {NAVIGATOR} from '@/utils/config';
import './navigator.scss';

const {Link} = router;
const namespace = 'header';
const routerNameSpace = 'router';

const mapStateToProps = (state) => {
  const {categories, activeMenu} = state[namespace];
  const {location} = state[routerNameSpace];
  return {
    categories,
    activeMenu,
    location
  };
};

@connect(mapStateToProps)
class Navigator extends Component {

  constructor(props) {
    super(props);
    const {dispatch, location} = this.props;
    let activeMenu = location.pathname;
    switch(activeMenu){
      case '/flags/define':
        activeMenu = "flagsdefine";
        break;
      case '/flags/sequence':
        activeMenu = "flagssequence";
        break;
      case '/productFlags/productFlags':
        activeMenu = "productFlags";
        break;
      case '/Product-Flags/Mapping':
        activeMenu = "flagsupload";
        break;
      case '/Product-Leap/Points/Mapping':
        activeMenu = "leapsupload";
        break;
      case '/category/category':
        activeMenu = "category";
        break;
      case '/audit':
        activeMenu = "audit";
        break;
      default:
        break;
    }
    dispatch({
      type: `${namespace}/saveActiveMenu`,
      payload: activeMenu
    });
    this.state = {
      current: '',
    };
  }

  handleClick = e => {
    this.setState({
      current: e.key,
    }, async () => {
      const {dispatch} = this.props;
      dispatch({
        type: `${namespace}/saveActiveMenu`,
        payload: this.state.current
      });
    });
  };

  render() {
    const {activeMenu} = this.props;
    const permissionList = JSON.parse(localStorage.getItem('permissionList')) ? JSON.parse(localStorage.getItem('permissionList')) : [];
    return (
      <div className="navigator">
        <Menu theme="dark" mode="inline" onClick={this.handleClick} selectedKeys={[activeMenu]}>
          <Menu.Item key='flagsdefine' style={{display:permissionList.indexOf('FLAGS:DEFINE')>-1?'block':'none'}}>
            <span><Link to={`/flags/define`}><Icon type="flag" style={{marginRight: 10}} />{'Flags Define'}</Link></span>
          </Menu.Item>
          <Menu.Item key='flagssequence' style={{display:permissionList.indexOf('FLAGS:SEQUENCE')>-1?'block':'none'}}>
            <span><Link to={`/flags/sequence`}><Icon type="swap" style={{marginRight: 10}} rotate={90} />{'Flags Sequence'}</Link></span>
          </Menu.Item>
          <Menu.Item key='flagsupload' style={{display:permissionList.indexOf('FLAGS:UPLOAD')>-1?'block':'none'}}>
            <span><Link to={`/Product-Flags/Mapping`}><Icon style={{marginRight: 10}} type="upload"/>{'Product-Flags Mapping'}</Link></span>
          </Menu.Item>
          <Menu.Item key='leapsupload' style={{display:permissionList.indexOf('LEAPS:UPLOAD')>-1?'block':'none'}}>
            <span><Link to={`/Product-Leap/Points/Mapping`}><Icon style={{marginRight: 10}} type="upload"/>{'Product-Leap Points Mapping'}</Link></span>
          </Menu.Item>
          <Menu.Item key='productFlags' style={{display:permissionList.indexOf('PRODUCT:FLAGS_LEAPS')>-1?'block':'none'}}>
            <span><Link to={`/productFlags/productFlags`}><Icon style={{marginRight: 10}} type="download" />{'Product Flags/Leap Points'}</Link></span>
          </Menu.Item>
          <Menu.Item key='category' style={{display:permissionList.indexOf('CATEGORY')>-1?'block':'none'}}>
            <span><Link to={`/category/category`}><Icon style={{marginRight: 10}} type="upload"/>{'Category'}</Link></span>
          </Menu.Item>
          <Menu.Item key='audit' style={{display:permissionList.indexOf('AUDIT')>-1?'block':'none'}}>
            <span><Link to={`/audit`}><Icon style={{marginRight: 10}} type="audit"/>{'Audit'}</Link></span>
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}

export default Navigator;
