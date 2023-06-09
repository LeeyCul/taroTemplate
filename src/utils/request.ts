import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Host } from '@/constants';

const codeMessage: any = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '登陆已过期，请重新登录',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 创建实例
 */
const instance: AxiosInstance = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  baseURL: Host.APP_BASE,
});

/**
 * request拦截器
 */
instance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  console.log('config', config,);
  if (token) {
    config.headers = {
      Authorization: token
    };
  }
  return config;
}, error => Promise.reject(error));

instance.interceptors.response.use((response) => {
  if (response.status === 200) {
    return Promise.resolve(response);
  }
  return Promise.reject(response);
}, error => {
  console.log('error', error);
  if (error?.response) {
    codeMessage[error.response?.status];
  } else {
    error.message = '连接到服务器失败';
  }
  return Promise.reject(error);
});

const request = {
  get: instance.get,
  delete: instance.delete,
  post: <T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R> => {
    return instance.post(url, config?.data, config);
  },
  put: <T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R> => {
    return instance.post(url, config?.data, config);
  }
};

export default request;


