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