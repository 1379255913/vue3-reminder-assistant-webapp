<template>
    <van-tabbar v-model="active" placeholder>
        <van-tabbar-item name="home" icon="home-o" replace to="/home">主页</van-tabbar-item>
        <van-tabbar-item name="calendar" icon="calendar-o" replace to="/calendar">日历</van-tabbar-item>
        <van-tabbar-item name="my" icon="user-o" replace to="/my">我的</van-tabbar-item>
    </van-tabbar>
</template>

<script>
    import { reactive,toRefs,onMounted,onUnmounted } from 'vue';
    import emitter from "@/event";
    export default {
        setup() {
            const state  = reactive({
                active : "home",
            })
            onMounted(()=>{
                emitter.on("tab",data=>{
                    state.active = data;
                })
            })
            onUnmounted(()=>{
                emitter.off("tab");
            })
            return {
                ...toRefs(state),
            };
        },
    };
</script>

<style scoped>
.c{

}
</style>