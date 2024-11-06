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