/*
 * @Author: 谭必清
 * @Date: 2024-11-06 23:56:35
 * @LastEditors: 谭必清
 * @LastEditTime: 2024-11-07 00:04:06
 * @FilePath: /ApartmentManagement-node/am-backend/src/controllers/userController.js
 * Copyright (c) 2024 by TanBQ., All Rights Reserved.
 */
/**
 * 用户控制器
 * @module userController
 * @description 处理用户相关的请求，包括获取所有用户、添加用户、删除用户、更新用户信息和获取用户信息。
 */

const User = require("../models/userModel");
const { hashPassword, comparePassword } = require("../utils/authUtils");

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
      return res.status(400).send({ message: "密码不能为空" });
    }

    try {
      const hashedPassword = await hashPassword(password);
      const newUser = {
        username,
        password: hashedPassword,
        phone_number,
        apartment_id,
      };

      User.getUserByName(username, (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.length != 0) {
          return res.status(402).send({ message: "用户已存在" });
        } else {
          User.addUser(newUser, (err, result) => {
            if (err) return res.status(500).send(err);
            res.status(201).json({ id: result.insertId, username });
          });
        }
      });
    } catch (error) {
      return res.status(500).send({ message: "密码加密失败", error });
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
      if (result.affectedRows === 0)
        return res.status(404).send({ message: "用户不存在" });
      res.status(200).send({ message: "用户已删除" });
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
      if (result.affectedRows === 0)
        return res.status(404).send({ message: "用户不存在" });
      res.status(200).send({ message: "用户信息已更新" });
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
      res.status(200).send({ message: "用户密码已更新" });
    });
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
          res.status(200).send({ message: "用户密码已更新" });
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
      if (result.length === 0)
        return res.status(404).send({ message: "用户不存在" });
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
      if (result.length === 0)
        return res.status(404).send({ message: "用户不存在" });
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
      return res.status(400).send({ message: "用户名和密码不能为空" });
    }

    // 查找用户
    User.getUserByName(username, async (err, result) => {
      if (err) return res.status(500).send(err);
      if (result.length === 0)
        return res.status(401).send({ message: "用户名或密码错误" });

      if (!result[0]) {
        return res.status(401).send({ message: "用户名或密码错误" });
      }

      // 比较密码
      const isMatch = await comparePassword(password, result[0].password);
      if (!isMatch) {
        return res.status(401).send({ message: "用户名或密码错误" });
      }

      // 判断账号类别，如果公寓id是0，就是超级管理员
      const isAdmin = result[0].apartment_id === 0 ? true : false;

      // 登录成功
      res.json({
        message: "登录成功",
        isLogin: true,
        user: { id: result[0].id, username: result[0].username, isAdmin }, // 返回用户信息
      });
    });
  },
};

module.exports = userController;
