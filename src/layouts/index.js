import './global.scss';
//import Header from '@/components/Header';
import Navigator from '@/components/Navigator';
import React from 'react';
import $ from '@/assets/jquery-vendor.js'
import { connect, router } from 'dva';
import { Layout, Icon, Button, Menu, Dropdown, Modal, Form, Input, Checkbox, message, Spin  } from 'antd';
import _ from 'lodash';
import { async } from 'q';
import { relative } from 'path';



const { Header, Sider, Content } = Layout;
const { confirm } = Modal;

const namespace = 'login';
const mapStateToProps = (state) => {
  return {
    ...state
  };
};

@connect(mapStateToProps)
@Form.create()

class BasicLayout extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      collapsed: false,
      collapsedText: 'Hide Navigater',
      isLogin:false,
      loading:false,
    }
  }

  componentWillMount = () => {
    // let str64 = "我是谁";
    // str64 = window.btoa(unescape(encodeURIComponent( str64 )));
    // console.log("加密后字符串是:"+str64);
    // console.log("base64解码后:"+decodeURIComponent(escape(window.atob( str64 ))));
    if(localStorage.getItem('dpc-data-management')){
      this.setState({
        isLogin: true
      })
    }else{
      this.setState({
        isLogin:false
      });
    }
  }

  componentDidMount =async () => {
    if(!this.state.isLogin){
      if(localStorage.getItem('password')){
        this.props.form.setFieldsValue({
          username: localStorage.getItem('username'),
          password: decodeURIComponent(escape(window.atob( localStorage.getItem('password') ))),
          remember: true
        });
      }
    }
  }

  componentWillReceiveProps(nextProps){
    if(localStorage.getItem('powerList') == 'undefined'){
      this.setState({
        isLogin:false
      });
      return;
    }else{
      let power = JSON.parse(localStorage.getItem('permissionList'));
      const power_url = nextProps.location.pathname;
      let flag = true;
      switch(power_url){
        case '/flags/define':
          if(_.indexOf(power,'FLAGS:DEFINE') < 0){
            flag = false
          };
          break;
        case '/flags/sequence':
          if(_.indexOf(power,'FLAGS:SEQUENCE') < 0){
            flag = false
          };
          break;
        case '/productFlags/productFlags':
          if(_.indexOf(power,'PRODUCT:FLAGS_LEAPS') < 0){
            flag = false
          };
          break;
        case '/Product-Flags/Mapping':
          if(_.indexOf(power,'FLAGS:UPLOAD') < 0){
            flag = false
          };
          break;
        case '/Product-Leap/Points/Mapping':
          if(_.indexOf(power,'LEAPS:UPLOAD') < 0){
            flag = false
          };
          break;
        case '/category/category':
          if(_.indexOf(power,'CATEGORY') < 0){
            flag = false
          };
          break;
        case '/audit':
          if(_.indexOf(power,'AUDIT') < 0){
            flag = false
          };
          break;
        default:
          break;
      }
      if(!flag){
        this.props.history.push({
          pathname:"/",
        });
      }
    }
}

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
      collapsedText:this.state.collapsed ? 'Hide Navigater' : 'Show Navigater'
    },() => {
      if(document.getElementById("right") || document.getElementById("left")){
          $("#treeDemo").css("width","100%");
          $("#treeDemo2").css("width","100%");
      }
    });
  };

  layoutMenu = () => {
    confirm({
      title: 'Are you sure you want to log out?',
      okText: 'Yes',
      cancelText: 'No',
      onOk:async () => {
        const {dispatch} = this.props;
        await dispatch({
          type: `${namespace}/logout`,
        });
        localStorage.removeItem('dpc-data-management');
        this.props.history.push({
          pathname:"/",
        });
        this.setState({
          isLogin:false
        });
        if(localStorage.getItem('password')){
          this.props.form.setFieldsValue({
            username: localStorage.getItem('username'),
            password: decodeURIComponent(escape(window.atob( localStorage.getItem('password') ))),
            remember: true
          });
        }else{
          this.props.history.push({
            pathname:"/",
          });
          this.props.form.setFieldsValue({
            username: '',
            password: '',
            remember: false
          });
        }
        // flag-sequence
        this.props.flagsequence.CountryMessage= '';
        this.props.flagsequence.leapPoints= [];
        this.props.flagsequence.geo= [];
        this.props.flagsequence.tableTotal= '';
        this.props.flagsequence.create= [];
        // productFlags
        this.props.productFlags.partNumber= '';
        this.props.productFlags.countries= [];
        this.props.productFlags.flags= [];
        this.props.productFlags.sale= [];
        this.props.productFlags.product= [];
        this.props.productFlags.models= [];
        this.props.productFlags.productFlags= [];
        // audit
        this.props.User.Object= [];
        this.props.User.Operator= [];
        this.props.User.Operation= [];
        this.props.User.AuditData= [];
        this.props.User.AuditTime= [];
        this.props.User.tableTotal= [];
        this.props.User.curObject= [];
        this.props.User.curOperator= [];
        this.props.User.curOperation= [];
        this.props.User.curStartTime= [];
        this.props.User.curEndTime= [];
      },
      onCancel:() => {
        console.log('Cancel');
      },
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        localStorage.setItem('username',values.username);
        if(values.remember){
          localStorage.setItem('password',window.btoa(unescape(encodeURIComponent( values.password ))));
        }else{
          localStorage.removeItem("password");
        }
        const {dispatch} = this.props;
        let params = {
          username:values.username,
          password:values.password,
        }
        let login_user = await dispatch({
          type: `${namespace}/loginUser`,
          payload: params
        });
        if(login_user.code == 200){
          this.setState({
            loading:true
          })
          localStorage.setItem('dpc-data-management',login_user.value);
          let powerList = await dispatch({
            type: `${namespace}/powerList`,
          });
          localStorage.setItem('permissionList',JSON.stringify(powerList.values));
          if(powerList.values.length > 0){
            this.setState({
              isLogin: true
            },()=>{
              message.success('Login successfully');
              this.props.form.setFieldsValue({
                username: undefined,
                password: undefined,
                remember: values.remember
              });
              this.props.history.push({
                pathname:"/",
              });
              $(".ant-menu-item-selected").removeClass("ant-menu-item-selected");
            })
          }else{
            message.warning("You do not have any permission at present！");
          }
          this.setState({
            loading:false
          })
        }else{
          if(login_user.status == 401){
            message.error('Incorrect account or password, please re-enter!');
            this.props.form.setFieldsValue({
              username: undefined,
              password: undefined,
            });
          }
        }
      }else{
        message.error('System exception!');
        this.props.form.setFieldsValue({
          username: undefined,
          password: undefined
        });
      }
    });
  };
  render() {
    const menu = (
      <Menu>
        <Menu.Item key="0" onClick={this.layoutMenu}>
          <span style={{display:'inline-block',margin:'0 15px'}}>Logout</span>
        </Menu.Item>
      </Menu>
    );
    const { getFieldDecorator } = this.props.form;
    const ITcode = localStorage.getItem('username');
    return (
        <div style={{ background:'#fff',height:`${this.state.isLogin ? 'auto': '100%'}`}}>
          <div style={{padding:'60px 0 0',display:'flex',height:"100%"}} className={this.state.isLogin ? "is-login" : "all-bg"}>
            <div className="example" style={{display:`${this.state.loading ? 'block' : 'none'}`}}>
              <Spin size="large" tip="Loading..." className="spin-load"/>
            </div>
            <Header className='header'>
              <div className='left-img'>
                <img src="" alt=""/>
              </div>
              <div className='right-title'>
                <p>DPC DATA MANAGEMENT PORTAL</p>
              </div>
            </Header>
            <div className={this.state.isLogin ? "login-div is-login" : "login-div"}>
              <div className="login-left">
                <div className="login-footer">
                  <ul>
                    <li>Dealer Locator</li>
                    <li>Partner Assist Live Chat</li>
                    <li>Contract</li>
                  </ul>
                  <div><span></span><span></span><span></span><span></span></div>
                </div>
                <div className='footer-bottom'>
                  <div className='footer-bottom-left'>
                    <ul>
                      <li>© 2019 Lenovo</li>
                      <li>Terms</li>
                      <li>Privacy</li>
                      <li>Sitemap</li>
                    </ul>
                  </div>
                  <div className='footer-bottom-right'>
                    <div><span></span>Hong Kong  -  $ HKD</div><i/>
                    <span>English</span>
                  </div>
                </div>
              </div>
              <div className="login-right">
                <p>LOGIN</p>
                <div>
                <Form onSubmit={this.handleSubmit} className="login-form">
                  <Form.Item>
                    {getFieldDecorator('username', {
                      rules: [{ required: true, message: 'ITCode is required' }],
                    })(
                      <Input placeholder="ITCode" />,
                    )}
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator('password', {
                      rules: [{ required: true, message: 'Password is required' }],
                    })(
                      <Input.Password placeholder="Password" />,
                    )}
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator('remember', {
                      valuePropName: 'checked',
                      initialValue: false,
                    })(<Checkbox>Remember me</Checkbox>)}
                  </Form.Item>
                  <Button type="primary" htmlType="submit" className="login-form-button" style={{width:"100%"}}>
                        Login
                  </Button>
                </Form>
                </div>
              </div>
            </div>
          </div>
          <div style={{padding:'100px 80px 0 80px',display:'flex',height:`${this.state.isLogin ? 'auto': '100%'}`}} className={this.state.isLogin ? "" : "is-login"}>
            <Header className='header'>
              <div className='left-img'>
                <img src="" alt=""/>
              </div>
              <div className='right-title'>
                <p>DPC DATA MANAGEMENT PORTAL</p>
              </div>
              <div className='My'>
                <Dropdown overlay={menu}>
                <span><Icon type="user" /> {ITcode}</span>
                </Dropdown>
              </div>
            </Header>
            <Sider trigger={null} collapsible collapsed={this.state.collapsed} style={{minHeight:'240px'}}>
              {this.state.isLogin ? <Navigator menuList={this.state.permissionList} /> : null}
              <div className='trigger-box' onClick={this.toggle}>
                <span className="hide-navigater">{this.state.collapsedText}</span>
                <Icon
                  className="trigger"
                  type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                />
              </div>
            </Sider>
            <Layout className="content" style={{'minHeight':'350px'}}>
              <Content
                style={{
                  margin: '24px 16px',
                  padding: 24,
                  background: '#fff',
                  minHeight: 1800,
                }}
              >
                {this.props.children}
              </Content>
            </Layout>
          </div>
          <footer className={this.state.isLogin ? "footer" : "footer is-login"}>
            <div className='footer-top'>
              <ul>
                <li>Recent Tweets</li>
                <li>The ThinkPad T Series continues to define business computing, with classic rugged ThinkPad design and unmistakable 2019 flair. Thin, light, powered by</li>
                <li>
                  <img src="" alt=""/>
                </li>
              </ul>
              <ul>
                <li>Help & Support</li>
                <li>Need any help? Raise a request and we will get in touch with you.</li>
                <li>
                <Button className='ant-btn ant-btn-primary' style={{width:'84px',height:'36px'}}>
                  Button
                </Button>
                </li>
              </ul>
              <ul>
                <li>About Lenovo</li>
                <li>News</li>
                <li>Events</li>
                <li><span></span><span></span><span></span><span></span></li>
              </ul>
            </div>
            <div className='footer-bottom'>
                <div className='footer-bottom-left'>
                  <ul>
                    <li>© 2019 Lenovo</li>
                    <li>Terms</li>
                    <li>Privacy</li>
                    <li>Sitemap</li>
                  </ul>
                </div>
                <div className='footer-bottom-right'>
                  <div><span></span>Hong Kong  -  $ HKD</div><i/>
                  <span>English</span>
                </div>
            </div>
          </footer>
        </div>
    );
  }
}

export default BasicLayout;
