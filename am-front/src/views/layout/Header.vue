<!--
 * @Author: 谭必清
 * @Date: 2024-11-06 23:56:35
 * @LastEditors: 谭必清
 * @LastEditTime: 2024-11-07 21:29:16
 * @FilePath: /ApartmentManagement-node/am-front/src/views/layout/Header.vue
 * Copyright (c) 2020 - 2024 by TanBQ., All Rights Reserved.
-->
<template>
    <header class="header">
        <div class="logo" @click="navigateToHome">
            <img :src="LOGO" alt="Web Logo">
        </div>
        <nav class="navigation">
            <div class="nav-container">
                <div class="nav-button" v-for="(item, index) in navigationItems" :key="item.url"
                    @click="navigateTo(item.url, index)" :class="{ active: currentIndex === index }">
                    {{ item.title }}
                </div>
                <div class="slider" :style="{
                    transform: `translateX(${currentIndex * (100 + 10)}px)`,
                }"></div>
            </div>
        </nav>
        <div class="account" @click="toggleAccountMenu">
            <img :src="avatar" class="avatar" alt="User Avatar">
            <transition name="fade">
                <div v-if="showAccountMenu" class="account-menu">
                    <span class="menu-title">账号管理</span>
                    <p @click="editAccount">修改账号</p>
                    <p @click="logout">退出登录</p>
                </div>
            </transition>
        </div>

        <transition name="modal">
            <div v-if="showUpdateInfoModal" class="modal-overlay" @click="closeModal">
                <div class="modal" @click.stop>
                    <div class="modal-content">
                        <!-- 左侧：基本信息 -->
                        <div class="modal-section">
                            <h2>用户基本信息</h2>
                            <form @submit.prevent="updateUserInfo">
                                <div class="form-group">
                                    <label for="username">用户名</label>
                                    <input type="text" id="username" v-model="userInfo.username" class="form-input">
                                </div>
                                <div class="form-group">
                                    <label for="phone">手机号码</label>
                                    <input type="tel" id="phone" v-model="userInfo.phone_number" class="form-input">
                                </div>
                                <button type="submit" class="submit-button">更新信息</button>
                            </form>
                        </div>
                        <!-- 右侧：密码修改 -->
                        <div class="modal-section">
                            <h2>密码修改</h2>
                            <form @submit.prevent="changePassword">
                                <div class="form-group">
                                    <label for="old-password">旧密码</label>
                                    <input type="password" id="old-password" v-model="passwordInfo.oldPassword"
                                        class="form-input">
                                </div>
                                <div class="form-group">
                                    <label for="new-password">新密码</label>
                                    <input type="password" id="new-password" v-model="passwordInfo.newPassword"
                                        class="form-input">
                                </div>
                                <div class="form-group">
                                    <label for="repeat-password">重复新密码</label>
                                    <input type="password" id="repeat-password" v-model="passwordInfo.repeatPassword"
                                        class="form-input">
                                </div>
                                <button type="submit" class="submit-button">更改密码</button>
                            </form>
                        </div>
                    </div>
                    <button @click="closeModal" class="close-button">关闭</button>
                </div>
            </div>
        </transition>
    </header>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus'
import { getUserDataById, updateUserPasswordByIdNoAdmin, updateUserByIdNoPassword } from "@/api/account";
import LOGO from "@/assets/logo.svg";
import avatar from "@/assets/img/avatar.png";

const router = useRouter();
const showAccountMenu = ref(false);
const showUpdateInfoModal = ref(false);
const currentIndex = ref(0);

const userInfo = ref({ username: '', phone_number: '' });
const passwordInfo = ref({ oldPassword: '', newPassword: '', repeatPassword: '' });

const navigationItems = computed(() => {
    const account = JSON.parse(localStorage.getItem("AM-Account") || '{}');
    return account.isAdmin
        ? [
            { title: "账户管理", url: "/home/account" },
            { title: "公寓管理", url: "/home/apartment" },
            { title: "资产查看", url: "/home/income" },
        ]
        : [
            { title: "房间管理", url: "/home/room" },
            { title: "住户管理", url: "/home/resident" },
            { title: "支付详情", url: "/home/payment" },
        ];
});

const navigateToHome = () => router.push('/home');

const navigateTo = (url, index) => {
    currentIndex.value = index;
    router.push(url);
};

const toggleAccountMenu = () => {
    showAccountMenu.value = !showAccountMenu.value;
};

const editAccount = async () => {
    const account = JSON.parse(localStorage.getItem("AM-Account") || '{}');
    const res = await getUserDataById(account.id);
    userInfo.value = { id: res.id, username: res.username, phone_number: res.phone_number, apartment_id: res.apartment_id };
    showUpdateInfoModal.value = true;
    showAccountMenu.value = false;
};

const closeModal = () => {
    showUpdateInfoModal.value = false;
    resetForms();
};

const resetForms = () => {
    userInfo.value = { id: '', username: '', phone_number: '', apartment_id: null };
    passwordInfo.value = { oldPassword: '', newPassword: '', repeatPassword: '' };
};

const updateUserInfo = async () => {
    if (!userInfo.value.username || !userInfo.value.phone_number || !userInfo.value.apartment_id) {
        ElMessage({
            message: "请填写完整的用户信息",
            type: 'warning',
            plain: true,
        });
        return;
    }

    try {
        console.log(userInfo.value);

        await updateUserByIdNoPassword(userInfo.value.id, userInfo.value);
        ElMessage({
            message: "成功修改信息",
            type: 'success',
            plain: true,
        });
        closeModal();
    } catch (error) {
        ElMessage({
            message: "修改信息失败",
            type: 'error',
            plain: true,
        });
    }
};

const changePassword = async () => {
    if (!passwordInfo.value.oldPassword || !passwordInfo.value.newPassword || !passwordInfo.value.repeatPassword) {
        ElMessage({
            message: "请填写完整的密码信息",
            type: 'warning',
            plain: true,
        });
        return;
    }

    if (passwordInfo.value.newPassword !== passwordInfo.value.repeatPassword) {
        ElMessage({
            message: "两次密码输入不一致",
            type: 'error',
            plain: true,
        });
        return;
    }

    try {
        const account = JSON.parse(localStorage.getItem("AM-Account") || '{}');
        let msg = await updateUserPasswordByIdNoAdmin(account.id, passwordInfo.value.oldPassword, passwordInfo.value.newPassword);
        ElMessage({
            message: msg.message,
            type: 'success',
            plain: true,
        });
        closeModal();
    } catch (error) {
        ElMessage({
            message: error.data.message,
            type: 'error',
            plain: true,
        });
    }
};

const logout = () => {
    localStorage.removeItem("AM-ISLOGIN");
    localStorage.removeItem("AM-Account");
    router.push("/login");
};

onMounted(() => {
    const currentPath = router.currentRoute.value.path;
    const index = navigationItems.value.findIndex(item => item.url === currentPath);
    if (index !== -1) {
        currentIndex.value = index;
    }
    router.push(navigationItems.value[0].url);
});
</script>

<style lang="scss" scoped>
.header {
    --sideLen: 60px;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-content: center;
    align-items: center;
    margin: 1rem 0;

    .logo {
        img {
            width: var(--sideLen);
            height: var(--sideLen);
            cursor: pointer;
        }
    }

    .navigation {
        --eachLen: 100px;
        --gap: 10px;

        .nav-container {
            position: relative;
            width: calc(var(--eachLen) * 3 + var(--gap) * 2);
            display: flex;
            gap: var(--gap);
            justify-content: space-around;
            background-color: #f5f5f5;
            padding: var(--gap);
            border-radius: 100px;

            .nav-button {
                position: relative;
                width: var(--eachLen);
                text-align: center;
                padding: 8px 0;
                border-radius: 50px;
                cursor: pointer;
                color: #1d1d1d;
                font-weight: 500;
                z-index: 2;
                transition: color 0.3s ease;
                font-weight: 900;
                background-color: transparent;

                &.active {
                    color: #f5f5f5;
                }
            }

            .slider {
                position: absolute;
                left: var(--gap);
                top: var(--gap);
                width: var(--eachLen);
                height: calc(100% - var(--gap) * 2);
                background-color: var(--primary-color);
                border-radius: 50px;
                transition: transform 0.3s ease;
                z-index: 1;
            }
        }
    }

    .account {
        width: var(--sideLen);
        height: var(--sideLen);
        position: relative;

        .avatar {
            width: var(--sideLen);
            height: var(--sideLen);
            // background-color: var(--primary-color);
            border-radius: 100%;
            cursor: pointer;
            z-index: 3;
            position: relative;
            box-shadow: 0 0 20px 0 #1d1d1d10;
        }

        .account-menu {
            position: absolute;
            right: -10px;
            top: -10px;
            padding: 0;
            padding-top: 5rem;
            padding-bottom: 1rem;

            width: 160px;
            height: fit-content;
            z-index: 2;
            background-color: #f5f5f5;
            box-shadow: 0 0 20px 0 #1d1d1d3c;
            border-radius: 30px;

            .menu-title {
                position: absolute;
                top: 20px;
                left: 20px;
                color: #1d1d1d;
                font-size: large;
                font-weight: 600;
                cursor: default;
            }

            p {
                margin: 0 auto;
                background-color: transparent;
                width: 100px;
                line-height: 2rem;
                text-align: center;
                font-size: larger;
                font-weight: 400;
                cursor: pointer;

                &:hover {
                    background-color: var(--primary-color);
                    color: #f5f5f5;
                    border-radius: 10px;
                }

                &:active {
                    background-color: var(--primary-color);
                    color: #f5f5f5;
                    border-radius: 10px;
                    font-weight: 900;
                }
            }
        }
    }
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal {
    background-color: #fff;
    border-radius: 16px;
    padding: 24px;
    width: 90%;
    max-width: 800px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    box-sizing: border-box;

    .modal-content {
        display: flex;
        gap: 32px;
    }

    .modal-section {
        flex: 1;

        h2 {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 20px;
            color: #333;
        }
    }

    .form-group {
        margin-bottom: 16px;

        label {
            display: block;
            margin-bottom: 8px;
            font-size: 14px;
            color: #666;
        }

        .form-input {
            width: 100%;
            padding: 10px;
            border: 1px solid #1d1d1d;
            border-radius: 8px;
            font-size: 14px;
            transition: border-color 0.2s ease;
            box-sizing: border-box;

            &:focus {
                outline: none;
                border-color: var(--primary-color);
            }
        }
    }

    .submit-button {
        width: 100%;
        padding: 10px;
        background-color: var(--primary-color);
        color: #ffffff;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s ease;
        box-sizing: border-box;

        &:hover {
            opacity: 0.9;
        }
    }

    .close-button {
        display: block;
        width: 100%;
        padding: 10px;
        margin-top: 20px;
        background-color: #f5f5f5;
        color: #333;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s ease;

        &:hover {
            background-color: #e0e0e0;
        }
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
    // transform: translateY(-20px);
}
</style>