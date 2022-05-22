<template>
    <van-notice-bar color="#1989fa" background="#ecf9ff" left-icon="info-o" mode="closeable">
        米袋虽空——樱花开哉！
    </van-notice-bar>
</template>

<script>
    import { toRefs,reactive,onMounted,onUnmounted } from 'vue'
    export default {
        name: "notice",
        setup(){
            onMounted(()=>{
                let o = JSON.parse(localStorage.getItem("objects")) || [];

            })
        }
    }
</script>

<style scoped>

</style>