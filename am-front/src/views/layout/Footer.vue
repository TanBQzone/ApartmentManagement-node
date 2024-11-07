<!--
 * @Author: 谭必清
 * @Date: 2024-11-06 23:56:35
 * @LastEditors: 谭必清
 * @LastEditTime: 2024-11-07 00:34:14
 * @FilePath: /ApartmentManagement-node/am-front/src/views/layout/Footer.vue
 * Copyright (c) 2020 - 2024 by TanBQ., All Rights Reserved.
-->
<template>
  <div class="footer">
    <p>公寓后台管理系统 · Copyright (c) 2020 - {{ year }} by TanBQ., All Rights Reserved.</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const year = ref(new Date().getFullYear());
</script>

<style lang="scss" scoped>
.footer {
  padding: 20px 0;
  text-align: center;
  color: #666;
  background-color: transparent;

  p {
    color: #1d1d1d;
    font-size: large;
    font-weight: 600;
  }
}
</style>
