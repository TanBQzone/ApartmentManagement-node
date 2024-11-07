/*
 * @Author: 谭必清
 * @Date: 2024-11-06 23:56:35
 * @LastEditors: 谭必清
 * @LastEditTime: 2024-11-07 00:36:35
 * @FilePath: /ApartmentManagement-node/am-front/src/utils/request.js
 * Copyright (c) 2020 - 2024 by TanBQ., All Rights Reserved.
 */
import axios from "axios";

const request = axios.create({
  baseURL: "/api",
  timeout: 5000,
});

// 添加请求拦截器
request.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
request.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response.data;
  },
  (error) => {
    // 对响应错误做点什么
    return Promise.reject(error.response);
  }
);

export default request;
