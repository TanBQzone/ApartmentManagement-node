/*
 * @Author: 谭必清
 * @Date: 2024-11-06 23:56:35
 * @LastEditors: 谭必清
 * @LastEditTime: 2024-11-07 00:36:17
 * @FilePath: /ApartmentManagement-node/am-front/vite.config.js
 * Copyright (c) 2020 - 2024 by TanBQ., All Rights Reserved.
 */
import { defineConfig } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 80,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        pathRewrite: { "^/api": "" },
      },
    },
  },
  resolve: {
    alias: {
      // 设置路径
      "~": path.resolve(__dirname, "./"),
      // 设置别名
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [vue()],
});
