<!--
 * @Author: 谭必清
 * @Date: 2024-11-06 23:56:35
 * @LastEditors: 谭必清
 * @LastEditTime: 2024-11-07 00:35:32
 * @FilePath: /ApartmentManagement-node/am-front/src/views/error/404.vue
 * Copyright (c) 2020 - 2024 by TanBQ., All Rights Reserved.
-->
<template>
  <Exception :data="data"></Exception>
</template>

<script setup>
import imgUrl from '@/assets/img/state/404.png'

const data = reactive({
  title: '404',
  desc: '抱歉，你访问的页面不存在',
  btnText: '返回首页',
  imgUrl
})
</script>