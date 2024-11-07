<!--
 * @Author: 谭必清
 * @Date: 2024-11-06 23:56:35
 * @LastEditors: 谭必清
 * @LastEditTime: 2024-11-07 21:13:59
 * @FilePath: /ApartmentManagement-node/am-front/src/views/Login.vue
 * Copyright (c) 2020 - 2024 by TanBQ., All Rights Reserved.
-->
<template>
    <div class="login-container">
        <div class="title">欢迎使用在线公寓管理系统</div>
        <div class="login-form">
            <form @submit.prevent="handleLogin" ref="formRef">
                <div class="input-group">
                    <input type="text" v-model="loginForm.username" placeholder=" " required />
                    <label class="placeholder">用户名</label>
                </div>
                <div class="input-group">
                    <input type="password" v-model="loginForm.password" placeholder=" " required />
                    <label class="placeholder">密码</label>
                </div>
                <!-- <div class="remember-forgot">
                    <label>
                        <input type="checkbox" v-model="loginForm.rememberMe" />
                        <span style="width: fit-content;">记住密码</span>
                    </label>
                </div> -->
                <button type="submit" :class="{ 'loading': isLoading }">
                    <span v-if="!isLoading">登录</span>
                    <div v-else class="loader"></div>
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { login } from "@/api/account"
import { ElMessage } from 'element-plus'

const router = useRouter();

/**
 * 登录表单数据
 * @type {Ref<{username: string, password: string, rememberMe: boolean}>}
 */
const loginForm = ref({
    username: "",
    password: "",
    rememberMe: false,
})

/**
 * 处理登录操作
 * @description 调用登录API，处理登录逻辑
 */
const handleLogin = () => {
    console.log("LOGIN!");
    login(loginForm.value).then(res => {
        localStorage.setItem('AM-ISLOGIN', 'true');
        localStorage.setItem('AM-Account', JSON.stringify(res.user));
        ElMessage({
            message: res.message,
            type: 'success',
            plain: true,
        });
        router.push('/home');
    }).catch(err => {
        console.error("登录失败:", err);
        ElMessage({
            message: err.data.message,
            type: 'error',
            plain: true,
        });
    })
}

</script>

<style lang="scss" scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-content: center;
    flex-direction: column;
    align-items: center;

    transform: translate(-50%, -50%);
    position: absolute;
    top: 50%;
    left: 50%;

    width: 40vw;
    height: 50vh;
    margin: 0 auto;
    background-color: #fff;
    border-radius: 50px;

    .title {
        font-family: sans-serif;
        font-size: 2rem;
        line-height: 10rem;
        font-weight: 900;
    }

    // 登录表单
    form {
        width: 100%;
        max-width: 300px;

        .input-group {
            margin-bottom: 1rem;
            position: relative;

            input {
                box-sizing: border-box;
                width: 100%;
                max-width: 100%;
                padding: 0.5rem 1rem;
                border: 1px solid var(--border-color);
                border-radius: 20px;
                font-size: 1rem;

                &:focus {
                    outline: 1px solid var(--primary-color);
                }

                &:focus+.placeholder,
                &:not(:placeholder-shown)+.placeholder {
                    top: -10px;
                    left: 0.5rem;
                    font-size: 14px;
                    color: var(--primary-color);
                    background-color: #fff;
                }

                .invalid {
                    animation: shake 0.3s 4;
                    border-color: red;
                }
            }

            .placeholder {
                position: absolute;
                top: 8px;
                left: 0.5rem;
                font-size: 14px;
                padding: 0 5px;
                color: var(--gray-color);
                transition: 0.2s;
                pointer-events: none;
            }
        }
    }

    // 记住我
    .remember-forgot {
        display: flex;
        justify-content: space-between;
        padding: 0 1rem;
        align-items: center;
        margin-bottom: 1rem;

        label {
            display: flex;
            align-items: center;
            color: var(--gray-color);
            cursor: pointer;

            input[type="checkbox"] {
                margin-right: 0.5rem;
                outline: none;

                &:checked {
                    background-color: var(--primary-color);

                }
            }
        }

        .forgot-password {
            color: var(--primary-color);
            text-decoration: none;

            &:hover {
                text-decoration: underline;
            }
        }
    }

    button {
        width: 100%;
        height: 40px;
        padding: 0.5rem 0.8rem;
        background-color: var(--primary-color);
        color: #fff;
        border: none;
        border-radius: 20px;
        font-size: 1rem;
        cursor: pointer;
        transition: background-color 0.3s ease;

        &:hover {
            background-color: var(--primary-color-dark);
        }

        &.loading {
            background-color: var(--primary-color-dark);
            cursor: not-allowed;
        }

        .loader {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255, 255, 255, .3);
            border-radius: 50%;
            border-top-color: #fff;
            animation: spin 1s ease-in-out infinite;
        }
    }
}
</style>