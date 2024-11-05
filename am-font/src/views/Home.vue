<template>
    <div>
        <el-header>
            <Header />
        </el-header>
        <el-main>
            <KeepAlive>
                <router-view></router-view>
            </KeepAlive>
        </el-main>
        <el-footer>
            <copyright-page>
                <Footer />
            </copyright-page>
        </el-footer>
    </div>
</template>

<script setup>
import Header from '@/views/layout/Header.vue'
import Footer from '@/views/layout/Footer.vue'
</script>

<style lang="scss" scoped>
.el-main {
    margin: 20px;
    min-height: calc(100vh - 60px - 60px);
    border-radius: 20px;
    background-color: #f5f5f5;
}

.el-footer {
    width: 80vw;
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    background-color: #fff;
    border-radius: 20px 20px 0 0;
    box-shadow: 0 0 20px 0px #1d1d1d36;
}
</style>