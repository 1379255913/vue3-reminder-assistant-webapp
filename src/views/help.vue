<template>
    <div>
        <van-nav-bar
                title="帮助与反馈"
                left-text="返回"
                left-arrow
                @click-left="onClickLeft"
        />
        <br/>
        <van-cell icon="info" title="说明书"  is-link ></van-cell>
        <van-cell icon="qq" title="和我们聊一聊"  is-link ></van-cell>
        <div style="margin: 16px;text-align:center">
            设计&开发:张三
        </div>
    </div>
</template>

<script>
    import { reactive,toRefs,onMounted,onUnmounted } from 'vue'
    import emitter from "@/event";
    import {Dialog} from "vant";
    export default {
        name: "help",
        components:{
        },
        setup(){
            const state = reactive({

            })
            const onClickLeft = ()=>{
                history.back();
            }
            const Click1 = ()=>{
                emitter.emit("nicknamechange","");
            }
            const Click2 = ()=>{
                emitter.emit("passwordchange","");
            }
            const Click3 = ()=>{
                Dialog.alert({
                    title: '警告',
                    message: "你确定要退出吗？",
                }).then(() => {
                    localStorage.removeItem("user");
                    history.back();
                });
            }
            onMounted(()=>{
                emitter.emit("tab")
            })
            return{
                ...toRefs(state),
                onClickLeft,
                Click1,
                Click2,
                Click3
            }
        }
    }
</script>

<style scoped>

</style>