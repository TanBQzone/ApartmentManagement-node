<template>
    <div class="header">
        <div class="logo">
            <img :src="LOGO" alt="Web Logo">
        </div>
        <div class="selection">
            <div class="out">
                <div class="btn" v-for="(item, index) in lib" :key="item.url" @click="showPage(item.url, index)"
                    :class="{ active: currentIndex === index }">
                    {{ item.title }}
                </div>
                <div class="slider" :style="{
                    transform: `translateX(${currentIndex * (100 + 10)}px)`,
                }"></div>
            </div>
        </div>
        <div class="account" @click="showAccountMenu = !showAccountMenu">
            <img :src="avatar" class="icon">
            <div class="menu" v-if="showAccountMenu">
                <span>账号管理</span>
                <p @click="editAccount">修改账号</p>
                <p @click="logout">退出登录</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineEmits, onMounted, ref } from 'vue';
import LOGO from "@/assets/logo.svg";
import avatar from "@/assets/img/avatar.png";

const lib = ref([]);
const currentIndex = ref(0);
const showAccountMenu = ref(false);

/**
 * 初始化选择库
 * 根据用户类型设置选择库的内容
 */
const initSelectionLib = () => {
    let account = JSON.parse(localStorage.getItem("AM-Account"));
    console.log(account);
    if (account.isAdmin) {
        lib.value = [
            {
                title: "账户管理",
                url: "/home/account"
            },
            {
                title: "公寓管理",
                url: "/home/apartment"
            },
            {
                title: "资产查看",
                url: "/home/income"
            },
        ]
    } else {
        lib.value = [
            {
                title: "房间管理",
                url: "/home/room"
            },
            {
                title: "住户管理",
                url: "/home/resident"
            },
            {
                title: "支付详情",
                url: "/home/payment"
            },
        ]
    }
};

import { useRouter } from 'vue-router';
const router = useRouter();

/**
 * 显示指定页面
 * @param {string} url - 要跳转到的页面的URL
 * @param {number} index - 当前页面的索引
 */
const showPage = (url, index) => {
    currentIndex.value = index;
    router.push(url);
}

/**
 * 编辑账号信息
 */
const editAccount = () => {
    console.log("修改账号信息");
}

/**
 * 登出操作
 */
const logout = () => {
    console.log("登出");
    localStorage.removeItem("AM-ISLOGIN");
    localStorage.removeItem("AM-Account");
    router.push("/login");
}

onMounted(() => {
    initSelectionLib();
    // 根据当前路由设置初始索引
    const currentPath = router.currentRoute.value.path;
    const index = lib.value.findIndex(item => item.url === currentPath);
    if (index !== -1) {
        currentIndex.value = index;
    }
    router.push(lib.value[0].url);
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

    .selection {
        --eachLen: 100px;
        --gap: 10px;

        .out {
            position: relative;
            width: calc(var(--eachLen) * 3 + var(--gap) * 2);
            display: flex;
            gap: var(--gap);
            justify-content: space-around;
            background-color: #f5f5f5;
            padding: var(--gap);
            border-radius: 100px;

            .btn {
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

        .icon {
            width: var(--sideLen);
            height: var(--sideLen);
            background-color: var(--primary-color);
            border-radius: 100%;
            cursor: pointer;
            z-index: 3;
            position: relative;
        }

        .menu {
            // display: none;
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
            box-shadow: 0 0 20px 0 #1d1d1d1d;
            border-radius: 30px;

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

            span {
                background-color: transparent;
                position: absolute;
                top: 30px;
                left: 10px;
                text-align: center;
                font-size: large;
                font-weight: 600;
            }
        }
    }
}
</style>