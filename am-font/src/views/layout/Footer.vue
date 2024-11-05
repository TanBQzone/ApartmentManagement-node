<template>
  <div class="footer">
    <p>版权所有 © {{ year }}</p>
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
    background-color: transparent;
  }
}
</style>
