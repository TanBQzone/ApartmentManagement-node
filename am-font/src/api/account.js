import request from '@/utils/request';

/**
 * 获取所有用户数据
 * @returns {Promise} 返回一个Promise对象
 */
export const getAllUserData = () => {
    return request.get("/users/listAll")
}

/**
 * 添加用户数据
 * @param {object} user - 用户对象
 * @returns {Promise} 返回一个Promise对象
 */
export const addUserData = (user) => {
    return request.post("/users/addUser", user)
}

/**
 * 根据ID删除用户数据
 * @param {number} id - 用户ID
 * @returns {Promise} 返回一个Promise对象
 */
export const deleteUserDataById = (id) => {
    return request.delete(`/users/${id}`)
}

/**
 * 根据ID更新用户数据
 * @param {number} id - 用户ID
 * @param {object} user - 用户对象
 * @returns {Promise} 返回一个Promise对象
 */
export const updateUserDataById = (id, user) => {
    return request.put(`/users/${id}`, user)
}

/**
 * 根据ID获取用户数据
 * @param {number} id - 用户ID
 * @returns {Promise} 返回一个Promise对象
 */
export const getUserDataById = (id) => {
    return request.get(`/users/getUserByID/${id}`)
}

/**
 * 根据姓名获取用户数据
 * @param {string} name - 用户姓名
 * @returns {Promise} 返回一个Promise对象
 */
export const getUserDataByName = (name) => {
    return request.get(`/users/getUserByName/${name}`)
}

/**
 * 用户登录
 * @param {object} user - 用户对象
 * @returns {Promise} 返回一个Promise对象
 */
export const login = (user) => {
    return request.post("/login", user)
}