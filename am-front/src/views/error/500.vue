<!--
 * @Author: 谭必清
 * @Date: 2024-11-06 23:56:35
 * @LastEditors: 谭必清
 * @LastEditTime: 2024-11-07 00:35:38
 * @FilePath: /ApartmentManagement-node/am-front/src/views/error/500.vue
 * Copyright (c) 2020 - 2024 by TanBQ., All Rights Reserved.
-->
<template>
    <Exception :data="data"></Exception>
</template>

<script setup>
import imgUrl from '@/assets/img/state/500.png'

const data = reactive({
    title: '500',
    desc: '抱歉，服务器出错了',
    btnText: '返回首页',
    imgUrl
})
</script>