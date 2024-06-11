import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import {Cookies, Dialog} from "quasar";

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({
   baseURL: 'https://admin.51x.uk'
 // baseURL: "http://127.0.0.1:8098"
});

// 添加请求拦截器
api.interceptors.request.use(function (config) {
  config.headers['change'] = 'pc'; // 自定义头信息

  // 从本地存储或其他地方获取token
  const token = Cookies.get('token');

  // 如果token存在，则添加到请求头部
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }else{
    const url=config.url??""
    // console.log(url.startsWith('/admin'))
    if (url.startsWith('/admin')) {
      // 重定向到登录页面
      window.location.href = '/login';
    }
  }
  // 如果请求方式为POST，添加特定的Content-Type
  if (config.method.toLowerCase() === 'post') {
    // 确保不会覆盖已存在的Content-Type
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }
    // 如果token存在，确保Authorization也在POST请求中

  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
api.interceptors.response.use(function (response) {
  if (response.status === 401) {
    // 如果code等于401，重定向到登录页面
    window.location.href = '/login';
  }
  console.log(response.data)
  // 检查返回的响应数据格式
  if (response.data && response.data.code) {
    if (response.data.code === 401) {
      // 删除cookie示例
      Cookies.remove('token');
      Cookies.remove('id');
      Cookies.remove('userInfo');
      // 如果code等于401，重定向到登录页面
      window.location.href = '/login';
    }
  }
  return response;
}, function (error) {
// 获取错误响应对象
  const response = error.response;
  // console.log("-----error---------------------");
  //
  // console.log(error);
  // console.log(response);
  // console.log(response.data);

  // 检查错误状态码是否为401（未授权）
  if (response && response.data && response.data.code === 401) {
    // 删除cookie示例
    Cookies.remove('token');
    Cookies.remove('id');
    Cookies.remove('userInfo');
    //  message.textContent = '请登录后再操作，请点击OK跳转至登录页面,点击Cancel保持当前页面.\n\rPlease login before operation, please click OK to jump to the login page';
    Dialog.create({
      title: '提示',
      message: '请登录后再操作，请点击OK跳转至登录页面,点击Cancel保持当前页面.\r\nlease login before operation, please click OK to jump to the login page',
      ok: {
        label: 'OK',
        color: 'primary'
      },
      cancel: {
        label: 'Cancel',
        color: 'red'
      }
    }).onOk(() => {
      // 点击OK按钮时跳转到登录页面
      window.location.href = '/login';
    })
    return ;
  } else {
    // 其他错误情况，可以根据需要处理或直接抛出错误
    console.error('发生错误，请检查:', error);
    // return Promise.reject(error); // 如果需要在组件中处理这个错误，可以取消注释这一行
  }

  // 对响应错误做些什么
  return Promise.reject(error);
});
export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };
