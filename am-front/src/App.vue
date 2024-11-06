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