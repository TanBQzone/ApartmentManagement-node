/**
 * 用户控制器
 * @module userController
 * @description 处理用户相关的请求，包括获取所有用户、添加用户、删除用户、更新用户信息和获取用户信息。
 */

const User = require('../models/userModel');
const bcrypt = require('bcrypt');

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
            const hashedPassword = await bcrypt.hash(password, password.length);
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
    updateUserById: async (req, res) => {
        const id = req.params.id;
        const { username, password, phone_number, apartment_id } = req.body;

        const hashedPassword = await bcrypt.hash(password, password.length);
        const updatedUser = { username, password: hashedPassword, phone_number, apartment_id };

        User.updateUserById(id, updatedUser, (err, result) => {
            if (err) return res.status(500).send(err);
            if (result.affectedRows === 0) return res.status(404).send({ message: '用户不存在' });
            res.status(200).send({ message: '用户信息已更新' });
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
            if (result.length === 0) return res.status(404).send({ message: '用户不存在' });

            if (!result[0]) {
                return res.status(404).send({ message: '用户或密码错误' });
            }

            // 比较密码
            const isMatch = await bcrypt.compare(password, result[0].password);
            if (!isMatch) {
                return res.status(401).send({ message: '用户或密码错误' });
            }

            // 登录成功
            res.json({
                message: "登录成功",
                isLogin: true,
                user: { id: result[0].id, username: result[0].username } // 返回用户信息
            });
        });
    }

};

module.exports = userController;
