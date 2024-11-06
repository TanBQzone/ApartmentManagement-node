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