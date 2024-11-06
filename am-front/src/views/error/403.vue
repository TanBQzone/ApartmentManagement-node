<template>
  <Exception :data="data"></Exception>
</template>

<script setup>
import imgUrl from '@/assets/img/state/403.png'

const data = reactive({
  title: '403',
  desc: '抱歉，你无权访问该页面',
  btnText: '返回首页',
  imgUrl
})
</script>