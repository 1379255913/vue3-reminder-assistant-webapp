<template>
    <van-popup
            v-model:show="show"
            round
            position="bottom"
            :style="{ height: '92%' }"
    >
    <van-cell>
        <template #title>
            <van-icon name="arrow-left" size="large" @click="back"/>
        </template>
    </van-cell>
    <iframe src="https://support.qq.com/product/408368" class="iframe" id="iframe1"></iframe>
    </van-popup>
</template>

<script>
import { reactive,toRefs,onUnmounted,onMounted } from 'vue'
import emitter from "@/event";
export default {
    name: "returns",
    setup(){

        const state = reactive({
            show : false,
        })
        const back = ()=>{
            history.back();
        }
        onMounted(()=>{
            emitter.on("returns",data=>{
                state.show = true;
                setTimeout(()=>{
                   document.getElementById("iframe1").contentWindow.location=data;
                },200)
            })
        })
        onUnmounted(()=>{
            emitter.off("returns");
        })
        return{
            ...toRefs(state),
            back
        }
    }
}
</script>

<style scoped>
.iframe {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 95%;
    background: #fff;
    overflow-y: hidden;
}
</style>