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
