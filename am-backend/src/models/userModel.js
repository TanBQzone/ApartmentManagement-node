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
        db.query('SELECT * FROM users', callback);
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
     * 根据ID更新用户信息
     * @function
     * @param {number} id - 用户ID
     * @param {object} user - 用户对象
     * @param {function} callback - 回调函数
     */
    updateUserById: (id, user, callback) => {
        const query = 'UPDATE users SET username = ?, password = ?, phone_number = ?, apartment_id = ? WHERE id = ?';
        db.query(query, [user.username, user.password, user.phone_number, user.apartment_id, id], callback);
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
