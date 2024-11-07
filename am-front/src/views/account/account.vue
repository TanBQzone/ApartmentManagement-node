<!--
 * @Author: 谭必清
 * @Date: 2024-11-06 23:56:35
 * @LastEditors: 谭必清
 * @LastEditTime: 2024-11-07 00:35:14
 * @FilePath: /ApartmentManagement-node/am-front/src/views/account/account.vue
 * Copyright (c) 2020 - 2024 by TanBQ., All Rights Reserved.
-->
<template>
    <div class="user-management">
        <div class="content-wrapper">
            <div class="addNew">
                <el-button type="primary" plain @click="addUser">新增用户</el-button>
            </div>

            <el-table :data="userData" class="custom-table">
                <el-table-column align="center" prop="id" label="ID" width="180"></el-table-column>
                <el-table-column align="center" prop="username" label="用户名" width="180"></el-table-column>
                <el-table-column align="center" prop="phone_number" label="手机号码"></el-table-column>
                <el-table-column align="center" prop="apartment_id" label="管理公寓"></el-table-column>
                <el-table-column align="center" prop="created_at" label="创建时间">
                    <template #default="{ row }">
                        <span>{{ new Date(row.created_at).toLocaleDateString() }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="operation" label="操作" width="300">
                    <template #default="{ row }">
                        <el-button plain type="success" size="small" @click="changePassword(row)">修改密码</el-button>
                        <el-button plain type="warning" size="small" @click="editUser(row)">编辑</el-button>
                        <el-button plain type="danger" size="small" @click="deleteUser(row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 新增/编辑用户对话框 -->
            <el-dialog :title="dialogTitle" v-model="dialogVisible" width="30%" @close="resetForm"
                custom-class="custom-dialog">
                <el-form :model="userForm" label-width="100px">
                    <el-form-item label="用户名">
                        <el-input v-model="userForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码">
                        <el-input v-model="userForm.phone_number"></el-input>
                    </el-form-item>
                    <el-form-item label="管理公寓">
                        <el-input v-model="userForm.apartment_id"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" v-if="dialogTitle === '新增用户'">
                        <el-input v-model="userForm.password" type="password"></el-input>
                    </el-form-item>
                </el-form>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button plain @click="dialogVisible = false">取消</el-button>
                        <el-button plain type="primary" @click="submitForm">确定</el-button>
                    </span>
                </template>
            </el-dialog>

            <!-- 修改密码对话框 -->
            <el-dialog title="修改密码" v-model="pwdDialogVisible" width="30%" custom-class="custom-dialog">
                <el-form :model="pwdForm" label-width="100px">
                    <el-form-item label="新密码">
                        <el-input v-model="pwdForm.newPassword" type="password"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码">
                        <el-input v-model="pwdForm.confirmPassword" type="password"></el-input>
                    </el-form-item>
                </el-form>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button plain @click="pwdDialogVisible = false">取消</el-button>
                        <el-button plain type="primary" @click="submitPwdForm">确定</el-button>
                    </span>
                </template>
            </el-dialog>
        </div>
    </div>
</template>

<script setup>
import { getAllUserData, addUserData, deleteUserDataById, updateUserByIdNoPassword, updateUserPasswordByIdAdmin, updateUserPasswordByIdNoAdmin } from "@/api/account";
import { onMounted, ref } from "vue";
import { ElMessage, ElMessageBox } from 'element-plus';

// 表格数据
const userData = ref([]);
/**
 * 初始化用户数据
 * 从API获取所有用户数据，并更新userData
 */
const initData = () => {
    getAllUserData().then(res => {
        userData.value = res;
    });
};

// 对话框相关
const dialogVisible = ref(false);
const dialogTitle = ref('');
const userForm = ref({
    username: '',
    phone_number: '',
    apartment_id: '',
    password: ''
});

const pwdDialogVisible = ref(false);
const pwdForm = ref({
    newPassword: '',
    confirmPassword: ''
});

/**
 * 重置用户表单
 * 清空userForm中的所有字段
 */
const resetForm = () => {
    userForm.value = {
        username: '',
        phone_number: '',
        apartment_id: '',
        password: ''
    };
};

/**
 * 打开新增用户对话框
 * 设置对话框标题为“新增用户”，并显示对话框
 */
const addUser = () => {
    dialogTitle.value = '新增用户';
    dialogVisible.value = true;
};

/**
 * 打开编辑用户对话框
 * 设置对话框标题为“编辑用户”，并将当前行的数据填充到userForm中，显示对话框
 */
const editUser = (row) => {
    dialogTitle.value = '编辑用户';
    userForm.value = { ...row };
    dialogVisible.value = true;
};

/**
 * 删除用户
 * 弹出确认框，确认后删除指定ID的用户，并刷新用户数据
 */
const deleteUser = (id) => {
    ElMessageBox.confirm('确定要删除该用户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        deleteUserDataById(id).then(() => {
            ElMessage.success('删除成功');
            initData();
        });
    }).catch(() => {
        ElMessage.info('已取消删除');
    });
};

/**
 * 打开修改密码对话框
 * 将当前行的数据填充到pwdForm中，并显示对话框
 */
const changePassword = (row) => {
    pwdForm.value = {
        newPassword: '',
        confirmPassword: ''
    }
    pwdDialogVisible.value = true;
    pwdForm.value.id = row.id;
};

/**
 * 提交用户表单
 * 根据对话框标题判断是新增用户还是编辑用户，并调用相应的API进行数据提交
 */
const submitForm = () => {
    if (dialogTitle.value === '新增用户') {
        addUserData(userForm.value).then(() => {
            ElMessage.success('添加成功');
            dialogVisible.value = false;
            initData();
        });
    } else {
        updateUserByIdNoPassword(userForm.value.id, userForm.value).then(() => {
            ElMessage.success('更新成功');
            dialogVisible.value = false;
            initData();
        });
    }
};

/**
 * 提交密码修改
 * 检查新密码和确认密码是否一致，如果一致，则调用API修改密码
 */
const submitPwdForm = () => {
    if (pwdForm.value.newPassword !== pwdForm.value.confirmPassword) {
        ElMessage.error('两次输入的密码不一致');
        return;
    }

    updateUserPasswordByIdAdmin(pwdForm.value.id, pwdForm.value.newPassword).then(() => {
        ElMessage.success('密码修改成功');
        pwdDialogVisible.value = false;
    });
};

/**
 * 组件挂载时初始化用户数据
 */
onMounted(() => {
    initData();
});
</script>

<style lang="scss" scoped>
.user-management {

    .content-wrapper {
        background-color: #ffffff;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }

    .addNew {
        margin-bottom: 20px;
    }

    :deep(.custom-table) {
        border-radius: 8px;
        overflow: hidden;

        .el-table__header-wrapper {
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
            overflow: hidden;
        }

        .el-table__body-wrapper {
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
            overflow: hidden;
        }
    }

    :deep(.el-button) {
        border-radius: 6px;
    }

    :deep(.custom-dialog) {
        border-radius: 12px;

        .el-dialog__header {
            border-top-left-radius: 12px;
            border-top-right-radius: 12px;
        }

        .el-dialog__footer {
            border-bottom-left-radius: 12px;
            border-bottom-right-radius: 12px;
        }

        .el-input__inner {
            border-radius: 6px;
        }
    }
}
</style>