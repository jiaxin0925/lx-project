/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification, Modal, Button } from 'antd';
import React from 'react';

const codeMessage = {
  200: 'The server successfully returned the requested data.',
  201: 'New or modified data succeeded.',
  202: 'A request has entered the background queue (asynchronous task).',
  204: 'Delete data succeeded.',
  400: 'There is an error in the issued request, and the server has not created or modified the data.',
  401: 'User does not have permission (token, user name, password error).',
  403: 'The user is authorized, but access is forbidden.',
  404: 'The request was made for a nonexistent record and the server did not operate.',
  406: 'The requested format is not available.',
  410: 'The requested resource is permanently deleted and will no longer be available.',
  422: 'A validation error occurred while creating an object.',
  500: 'An error occurred on the server. Please check the server.',
  502: 'Gateway error.',
  503: 'Service unavailable, server temporarily overloaded or maintained.',
  504: 'Gateway timed out.',
};
/**
 * 异常处理程序
 */

const errorHandler = error => {
  const { response = {} } = error;
  const errorText = codeMessage[response.status] || response.statusText;
  const { status, url } = response;
  let ProductUrl = 'api/v1/basedata/product/flags';
  if (response.status === 504 && url.indexOf(ProductUrl) >= 0) {
    Modal.warning({
      title: 'Time out. Please reduce product numbers or increase other filters.',
    });
  }else{
    notification.error({
      message: `Request error ${status}: ${url}`,
      description: errorText,
    });
  }

  if(response.status == 401){
    setTimeout(function(){
      localStorage.removeItem("dpc-data-management");
      window.location.href = "/";
    },2000);
  }
  // let errorStatus = `${status}`;
  // let errorUrl = `${url}`;
  return response;
};
/**
 * 配置request请求时的默认参数
 */

const request = extend({
  prefix: process.env.API_ENV + '/api/v1',
  errorHandler, // 默认错误处理
  // credentials: 'same-origin', // 默认请求是否带上cookie
});

// request拦截器, 改变url 或 options.
request.interceptors.request.use(async (url, options) => {
  let token = localStorage.getItem("dpc-data-management");
  if (token) {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'dpc-data-management-token': token
    };
    return (
      {
        url: url,
        options: { ...options, headers: headers },
      }
    );
  } else {
    return (
      {
        url: url,
        options: { ...options },
      }
    );
  }
})


export default request;
