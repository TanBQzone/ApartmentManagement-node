<!--
 * @Author: 谭必清
 * @Date: 2024-11-06 23:56:35
 * @LastEditors: 谭必清
 * @LastEditTime: 2024-11-07 00:35:58
 * @FilePath: /ApartmentManagement-node/am-front/src/App.vue
 * Copyright (c) 2020 - 2024 by TanBQ., All Rights Reserved.
-->
<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
router.push("/home");
</script>