/*
 * @Author: 谭必清
 * @Date: 2024-11-06 23:56:35
 * @LastEditors: 谭必清
 * @LastEditTime: 2024-11-07 00:04:26
 * @FilePath: /ApartmentManagement-node/am-backend/src/server.js
 * Copyright (c) 2024 by TanBQ., All Rights Reserved.
 */
const express = require("express");
const app = express();
const HOST = "localhost";
const PORT = 8080;
const Version = "1.0.2";

// 中间件：解析 JSON 请求体
app.use(express.json());

// 版本信息
app.get("/", (req, res) => {
  res.send(`
        <div style="
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-content: center;
            justify-content: center;
            align-items: center;
            font-family: sans-serif;
            font-size: 2rem;
            line-height: 0.1rem;
        ">
            <p style="
                font-size: 3rem;
                font-weight: 900;
            ">
                欢迎使用公寓管理系统! 当前版本${Version}
            </p>
            <p><a 
                href='http://${HOST}'
                style="
                    color: #f5f5f5;
                    text-decoration: none;
                    padding: 10px 40px;
                    border: 1px solid #1d1d1d;
                    background-color: #1d1d1d;
                    border-radius: 100px;
                ">
                请访问前端地址
            </a></p>
        </div>
        `);
});

/**
 * 用户相关的路由
 */
const userRoutes = require("./routes/userRoutes");
app.use("/api", userRoutes);

// 启动服务器
app.listen(PORT, () => {
  console.clear();
  console.log();
  console.log(
    `--------------------------------------------------------------------------`
  );
  console.log(
    `\x1b[1m\x1b[34m欢迎使用公寓管理系统! 当前版本\x1b[1m\x1b[37m${Version}\x1b[0m`
  );
  console.log(
    `\x1b[1m\x1b[32mServer is running on:\x1b[1m\x1b[33m http://${HOST}:${PORT}\x1b[0m`
  );
  console.log(
    `--------------------------------------------------------------------------`
  );
});
