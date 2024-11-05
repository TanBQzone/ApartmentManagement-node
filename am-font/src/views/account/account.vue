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
                        <!-- <el-button plain type="success" size="small" @click="changePassword(row)">修改密码</el-button> -->
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
import { getAllUserData, addUserData, deleteUserDataById, updateUserDataById, getUserDataById } from "@/api/account";
import { onMounted, ref } from "vue";
import { ElMessage, ElMessageBox } from 'element-plus';

// 表格数据
const userData = ref([]);
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

// 重置表单
const resetForm = () => {
    userForm.value = {
        username: '',
        phone_number: '',
        apartment_id: '',
        password: ''
    };
};

// 新增用户
const addUser = () => {
    dialogTitle.value = '新增用户';
    dialogVisible.value = true;
};

// 编辑用户
const editUser = (row) => {
    dialogTitle.value = '编辑用户';
    userForm.value = { ...row };
    dialogVisible.value = true;
};

// 删除用户
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

// 修改密码
const changePassword = (row) => {
    pwdForm.value = {
        ...row,
        newPassword: '',
        confirmPassword: ''
    }
    pwdDialogVisible.value = true;
    pwdForm.value.id = row.id;
};

// 提交表单
const submitForm = () => {
    if (dialogTitle.value === '新增用户') {
        addUserData(userForm.value).then(() => {
            ElMessage.success('添加成功');
            dialogVisible.value = false;
            initData();
        });
    } else {
        updateUserDataById(userForm.value.id, userForm.value).then(() => {
            ElMessage.success('更新成功');
            dialogVisible.value = false;
            initData();
        });
    }
};

// 提交密码修改
const submitPwdForm = () => {
    if (pwdForm.value.newPassword !== pwdForm.value.confirmPassword) {
        ElMessage.error('两次输入的密码不一致');
        return;
    }

    updateUserDataById(pwdForm.value.id, pwdForm.value).then(() => {
        ElMessage.success('密码修改成功');
        pwdDialogVisible.value = false;
    });
};

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