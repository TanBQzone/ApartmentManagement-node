# **开发笔记**

这是一个开发笔记，记录了我学习如何使用 `node.js` 来完成后端的编写的过程。
我会按照我开发的流程来记录，包括遇到的问题、解决方案和经验总结。

在学习阶段编写的这个后端项目中，某些部分仍需要完善。部分内容的编写尚不够完美。
本次学习的目标是完成`公寓管理`相关的业务处理。

---

项目的后端需要：`node >= v18.20.4`、`pnpm >= 9.11.0`、`express = 4.21.1`、`mysql = 2.18.1`

项目的数据库需要：`MySQL = 8.0`


## 1. 项目开始
### 1.1 安装 Node.js 和 pnpm
确保你已经安装了 Node.js 和 pnpm。你可以通过在终端中运行以下命令来检查安装情况：
```bash
node -v
pnpm -v
```

### 1.2 创建项目目录
在你的工作目录中创建一个新的文件夹，并进入该文件夹：
```bash
mkdir am-backend
cd am-backend
```

### 1.3 初始化
在项目目录中初始化 pnpm，生成 package.json 文件：
```bash
pnpm init
```

### 1.4 安装 Express、bcrypt 和 mysql
```bash
pnpm add express bcrypt mysql
```


## 2. 创建项目结构
将后端项目分模块管理，可以提高代码的可维护性和可读性。（以登录为例）
```bash
my-node-mysql-app/
│
├── node_modules/          # npm 模块
├── src/                   # 源代码目录
│   ├── config/            # 配置文件
│   │   └── db.js          # 数据库连接配置
│   ├── controllers/       # 控制器，处理请求逻辑
│   │   └── userController.js
│   ├── models/            # 数据模型
│   │   └── userModel.js
│   ├── routes/            # 路由定义
│   │   └── userRoutes.js
│   ├── utils/             # 工具类
│   │   └── auth.js        # 身份验证等工具
│   └── server.js          # 服务器启动文件
│
├── package.json           # npm 配置文件
└── README.md              # 项目说明文档
```

```
目录说明

config/: 存放配置文件，例如数据库连接设置。
controllers/: 处理路由请求的逻辑，比如 CRUD 操作的处理。
models/: 定义数据库模型，封装与数据库交互的逻辑。
routes/: 定义 API 路由，将路由与相应的控制器关联。
utils/: 存放工具类和辅助函数，例如加密、验证等。
server.js: 应用的入口文件，负责启动服务器和加载中间件。
```


## 3. 与数据库连接
创建数据库
```sql
-- 创建数据库
CREATE DATABASE am;
USE am;
```

数据库连接配置 (`config/db.js`)
```javascript
/**
 * 链接数据库
 * account: root
 * password: root
 * host: localhost 
 **/
const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'am',
    connectTimeout: 10000, // 10秒连接超时
});

db.connect((err) => {
    if (err) throw err;
    console.log(`\x1b[1m\x1b[35m - db.js -> line 17\x1b[0m: \x1b[3m\x1b[37m成功链接数据库!\x1b[0m`);
});

module.exports = db;

```

如果出现报错，例如`PROTOCOL_CONNECTION_LOST`，试试使用连接池
```javascript
/**
 * 链接数据库
 * account: root
 * password: root
 * host: localhost 
 **/
const SUCCESSMSG = "成功链接数据库!";
const ERRORMSG = "数据库连接出错!";
const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'am',
    waitForConnections: true,  // 等待连接池连接
    connectTimeout: 10000,     // 设置连接超时时间
});

pool.getConnection((err, connection) => {
    if (err) {
        console.log(`\x1b[1m\x1b[35m - db.js -> line 20\x1b[0m: \x1b[3m\x1b[37m${ERRORMSG} ${err}\x1b[0m`);
        return;
    }
    console.log(`\x1b[1m\x1b[35m - db.js -> line 23\x1b[0m: \x1b[3m\x1b[37m${SUCCESSMSG}\x1b[0m`);
    // 使用连接
    connection.release(); // 释放连接回连接池
});

module.exports = pool;
```

## 4. 登录接口
### 4.1 用户数据库表
```sql
-- 用户表
-- 用户有一个超级管理员用户以及公司旗下授权的公寓管理员账号
-- 用户名 | 密码 | 手机号 | 分管的公寓（如果是0就是超级管理员）

-- 创建用户表
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    apartment_id INT NOT NULL DEFAULT 0, -- 如果是0，就是超级管理员
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 添加超级管理员用户
INSERT INTO users (username, password, phone_number, apartment_id)
VALUES ('admin', '这里的密码需要加密', '1234567890', 0);

```

### 4.2 用户模型 (`models/userModel.js`)
```javascript
/**
 * 用户模型
 * @module UserModel
 * @description 这是一个用户模型，包括获取所有用户、添加用户、删除用户、更新用户信息和获取用户信息。
 */
const db = require('../config/db');

const User = {
    /**
     * 获取所有用户
     * @function
     * @param {function} callback - 回调函数
     */
    getAllUsers: (callback) => {
        db.query('SELECT id, username, phone_number, apartment_id, created_at FROM users where apartment_id != 0', callback);
    },

    /**
     * 添加用户
     * @function
     * @param {object} user - 用户对象
     * @param {function} callback - 回调函数
     */
    addUser: (user, callback) => {
        const query = 'INSERT INTO users (username, password, phone_number, apartment_id) VALUES (?, ?, ?, ?)';
        db.query(query, [user.username, user.password, user.phone_number, user.apartment_id], callback);
    },

    /**
     * 根据ID删除用户
     * @function
     * @param {number} id - 用户ID
     * @param {function} callback - 回调函数
     */
    deleteUserById: (id, callback) => {
        const query = 'DELETE FROM users WHERE id = ?';
        db.query(query, [id], callback);
    },

    /**
     * 根据ID更新用户基本信息
     * @function
     * @param {number} id - 用户ID
     * @param {object} user - 用户对象
     * @param {function} callback - 回调函数
     */
    updateUserByIdNoPassword: (id, user, callback) => {
        const query = 'UPDATE users SET username = ?, phone_number = ?, apartment_id = ? WHERE id = ?';
        db.query(query, [user.username, user.phone_number, user.apartment_id, id], callback);
    },

    /**
     * 根据ID更新用户密码
     * @function
     * @param {number} id - 用户ID
     * @param {string} password - 新密码
     * @param {function} callback - 回调函数
     */
    updateUserPasswordById: (id, password, callback) => {
        const query = "UPDATE users SET password = ? WHERE id = ?";
        db.query(query, [password, id], callback);
    },

    /**
     * 根据ID获取用户信息
     * @function
     * @param {number} id - 用户ID
     * @param {function} callback - 回调函数
     */
    getUserById: (id, callback) => {
        const query = 'SELECT * FROM users WHERE id = ?';
        db.query(query, [id], callback);
    },

    /**
     * 根据姓名获取用户信息
     * @function
     * @param {number} username - 用户姓名
     * @param {function} callback - 回调函数
     */
    getUserByName: (username, callback) => {
        const query = 'SELECT * FROM users WHERE username = ?';
        db.query(query, [username], callback);
    },
};

module.exports = User;

```

### 4.3 用户控制器 (`controllers/userController.js`)
在写控制器前，需要把加密提取出来，我们就写一个utils

```javascript
/**
 * 认证工具
 * @module AuthUtils
 * @description 这是一个认证工具，包括用户登录、密码加密和验证。
 */
const bcrypt = require('bcrypt');

// 密码加密函数
function hashPassword(password) {
    // 第一个参数是密码，第二个参数是盐值的工作因子
    return bcrypt.hash(password, 10);
}

// 密码验证函数
function comparePassword(plainPassword, hashedPassword) {
    // 第一个参数是明文密码，第二个是数据库中的哈希密码
    return bcrypt.compare(plainPassword, hashedPassword);
}

module.exports = {
    hashPassword,
    comparePassword
};
```

```javascript
/**
 * 用户控制器
 * @module userController
 * @description 处理用户相关的请求，包括获取所有用户、添加用户、删除用户、更新用户信息和获取用户信息。
 */

const User = require('../models/userModel');
const { hashPassword, comparePassword } = require("../utils/authUtils")

/**
 * 用户控制器对象
 * @type {Object}
 */
const userController = {
    /**
     * 获取所有用户
     * @function
     * @param {NextFunction} req - 请求对象
     * @param {Response} res - 响应对象
     */
    getAllUsers: (req, res) => {
        User.getAllUsers((err, results) => {
            if (err) return res.status(500).send(err);
            res.json(results);
        });
    },

    /**
     * 添加用户
     * @function
     * @param {NextFunction} req - 请求对象
     * @param {Response} res - 响应对象
     */
    addUser: async (req, res) => {
        const { username, password, phone_number, apartment_id } = req.body;

        // 处理登录逻辑
        if (!password) {
            return res.status(400).send({ message: '密码不能为空' });
        }

        try {
            const hashedPassword = await hashPassword(password);
            const newUser = { username, password: hashedPassword, phone_number, apartment_id };

            User.getUserByName(username, (err, result) => {
                if (err) return res.status(500).send(err);
                if (result.length != 0) {
                    return res.status(402).send({ message: '用户已存在' });
                } else {
                    User.addUser(newUser, (err, result) => {
                        if (err) return res.status(500).send(err);
                        res.status(201).json({ id: result.insertId, username });
                    });
                }
            })

        } catch (error) {
            return res.status(500).send({ message: '密码加密失败', error });
        }
    },

    /**
     * 根据ID删除用户
     * @function
     * @param {NextFunction} req - 请求对象
     * @param {Response} res - 响应对象
     */
    deleteUserById: (req, res) => {
        const id = req.params.id;
        User.deleteUserById(id, (err, result) => {
            if (err) return res.status(500).send(err);
            if (result.affectedRows === 0) return res.status(404).send({ message: '用户不存在' });
            res.status(200).send({ message: '用户已删除' });
        });
    },

    /**
     * 根据ID更新用户信息
     * @function
     * @param {NextFunction} req - 请求对象
     * @param {Response} res - 响应对象
     */
    updateUserByIdNoPassword: async (req, res) => {
        const id = req.params.id;
        const { username, phone_number, apartment_id } = req.body;

        const updatedUser = { username, phone_number, apartment_id };

        User.updateUserByIdNoPassword(id, updatedUser, (err, result) => {
            if (err) return res.status(500).send(err);
            if (result.affectedRows === 0) return res.status(404).send({ message: '用户不存在' });
            res.status(200).send({ message: '用户信息已更新' });
        });
    },

    /**
     * 根据ID更新用户密码 - 管理员
     * @function
     * @param {NextFunction} req - 请求对象
     * @param {Response} res - 响应对象
     */
    updateUserPasswordByIdAdmin: async (req, res) => {
        const id = req.params.id;
        const { password } = req.body;

        const hashedPassword = await hashPassword(password);

        User.updateUserPasswordById(id, hashedPassword, (err, result) => {
            if (err) return res.status(500).send(err);
            res.status(200).send({ message: '用户密码已更新' });
        })
    },

    /**
     * 根据ID更新用户密码 - 用户
     * @function
     * @param {NextFunction} req - 请求对象
     * @param {Response} res - 响应对象
     */
    updateUserPasswordByIdNoAdmin: (req, res) => {
        const id = req.params.id;
        const { oldPassword, newPassword } = req.body;

        // 首先获取当前用户的信息
        User.getUserById(id, async (err, result) => {
            let userPassword = result[0].password;

            // 进行密码的比较
            const isMatch = await comparePassword(oldPassword, userPassword);

            if (!isMatch) {
                res.status(404).send({ message: "旧密码不正确" });
            } else {
                // 更新
                User.updateUserPasswordById(id, newPassword, (err, result) => {
                    if (err) return res.status(500).send(err);
                    res.status(200).send({ message: '用户密码已更新' });
                });
            }
        });
    },

    /**
     * 根据ID获取用户信息
     * @function
     * @param {NextFunction} req - 请求对象
     * @param {Response} res - 响应对象
     */
    getUserById: (req, res) => {
        const id = req.params.id;
        User.getUserById(id, (err, result) => {
            if (err) return res.status(500).send(err);
            if (result.length === 0) return res.status(404).send({ message: '用户不存在' });
            res.json(result[0]);
        });
    },

    /**
     * 根据姓名获取用户信息
     * @function
     * @param {NextFunction} req - 请求对象
     * @param {Response} res - 响应对象
     */
    getUserByName: (req, res) => {
        const name = req.params.name;
        User.getUserByName(name, (err, result) => {
            if (err) return res.status(500).send(err);
            if (result.length === 0) return res.status(404).send({ message: '用户不存在' });
            res.json(result[0]);
        });
    },

    /**
     * 登录
     * @function
     * @param {NextFunction} req - 请求对象
     * @param {Response} res - 响应对象
     */
    login: async (req, res) => {
        const { username, password } = req.body; // 从请求体中获取用户名和密码

        // 验证输入
        if (!username || !password) {
            return res.status(400).send({ message: '用户名和密码不能为空' });
        }

        // 查找用户
        User.getUserByName(username, async (err, result) => {
            if (err) return res.status(500).send(err);
            if (result.length === 0) return res.status(401).send({ message: '用户名或密码错误' });

            if (!result[0]) {
                return res.status(401).send({ message: '用户名或密码错误' });
            }

            // 比较密码
            const isMatch = await comparePassword(password, result[0].password);
            if (!isMatch) {
                return res.status(401).send({ message: '用户名或密码错误' });
            }

            // 判断账号类别，如果公寓id是0，就是超级管理员
            const isAdmin = result[0].apartment_id === 0 ? true : false;

            // 登录成功
            res.json({
                message: "登录成功",
                isLogin: true,
                user: { id: result[0].id, username: result[0].username, isAdmin } // 返回用户信息
            });
        });
    }

};

module.exports = userController;

```

### 4.4 路由定义 (`routes/userRoutes.js`)
```javascript
/**
 * 用户路由
 * @module userRoutes
 * @description 定义用户相关的API路由。
 */

// 导入express模块
const express = require('express');
// 导入用户控制器
const userController = require('../controllers/userController');
// 创建路由实例
const router = express.Router();

// 定义路由
// 获取所有用户
router.get('/users/listAll', userController.getAllUsers);
// 添加用户
router.post('/users/addUser', userController.addUser);
// 根据ID删除用户
router.delete('/users/:id', userController.deleteUserById);
// 根据ID更新用户基本信息
router.put('/users/:id', userController.updateUserByIdNoPassword);
// 根据ID更新用户密码 - 管理员
router.put('/users/changePasswordAdmin/:id', userController.updateUserPasswordByIdAdmin);
// 根据ID更新用户密码 - 用户
router.put('/users/changePasswordNoAdmin/:id', userController.updateUserPasswordByIdNoAdmin);
// 根据ID获取用户信息
router.get('/users/getUserByID/:id', userController.getUserById);
// 根据姓名获取用户信息
router.get('/users/getUserByName/:name', userController.getUserByName);
// 登录
router.post('/login', userController.login);

// 导出路由
module.exports = router;

```

### 4.5  修改服务器入口 (`server.js`)
```javascript
const express = require('express');
const app = express();
const HOST = 'localhost'
const PORT = 8080;
const Version = "1.0.2";

// 中间件：解析 JSON 请求体
app.use(express.json());

// 版本信息
app.get('/', (req, res) => {
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
const userRoutes = require('./routes/userRoutes');
app.use('/api', userRoutes)

// 启动服务器
app.listen(PORT, () => {
    console.clear();
    console.log();
    console.log(`--------------------------------------------------------------------------`);
    console.log(`\x1b[1m\x1b[34m欢迎使用公寓管理系统! 当前版本\x1b[1m\x1b[37m${Version}\x1b[0m`);
    console.log(`\x1b[1m\x1b[32mServer is running on:\x1b[1m\x1b[33m http://${HOST}:${PORT}\x1b[0m`);
    console.log(`--------------------------------------------------------------------------`);
});
```

## 5. *实现侯后端的热加载(可选)
在开发前端的时候，是支持热加载的，我觉得应该有一个方式能够实现监听文件的变化，实现热加载

`nodemon` 是一个用于 `Node.js` 应用的工具，它会监视文件的变化，并自动重启应用。

### 5.1 安装 nodemon
```bash
pnpm install --save-dev nodemon
```

### 5.2 配置 `package.json`
参考如下
```json
{
  "name": "rm-backend",
  "version": "1.0.0",
  "author": "TanBQ.",
  "description": "公寓管理系统的后端部分",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  },
  "keywords": [],
  "license": "ISC",
  "dependencies": {
    "bcrypt": "^5.1.1",
    "express": "^4.21.1",
    "mysql": "^2.18.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.7"
  }
}
```

### 5.3 *自定义监视的文件和目录(可选)
如果你想自定义 `nodemon` 监视的文件或目录，可以创建一个 `nodemon.json` 文件。

watch: 指定要监视的目录。

ext: 指定要监视的文件扩展名。

ignore: 指定要忽略的文件或目录。

```json
{
  "watch": ["src"],
  "ext": "js,json",
  "ignore": ["src/someFileToIgnore.js"]
}
```

# 遇到的问题
## 项目丢到MacBook Air M1 上运行后端报错 `ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL client`

解决思路：

错误通常是由于 `MySQL 8.x` 默认启用了新的身份验证插件 `caching_sha2_password`，而某些 `MySQL` 客户端（例如早期版本的 `MySQL` 客户端）可能不支持这个新的身份验证方式。

*更改 MySQL 用户的身份验证插件（推荐）*

你可以将 MySQL 用户的身份验证插件改回旧的 mysql_native_password 插件，这样客户端就能够连接。

1. 使用 `root` 用户或其他具有管理员权限的用户登录 `MySQL。`
```bash
mysql -u root -p
```

2. 切换到 `MySQL` 数据库。
```sql
use mysql;
```

3. 更改用户的认证插件为 `mysql_native_password`（假设你要更改的是 `root` 用户）。
```sql
alter user 'root'@'localhost' identified with mysql_native_password by '替换为你的密码';
```

4. 刷新权限
```sql
flush privileges;
```

5. 退出
```sql
exit
```

# 后端日志
```
1. beta1.0.1 -- 24w45a || 创建项目结构以及登录接口的完成
2. beta1.0.2 -- 24w45b || 修复了一些BUG，完善了部分逻辑
3. beta1.0.3 -- 24w45c || 修复了一些BUG，修复用户信息修改的逻辑
4. beta1.0.4 -- 24w45d || 完善用户模块，修复若干BUG
```