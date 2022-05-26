<template>
    <div>
        <van-nav-bar
                title="个人设置"
                left-text="返回"
                left-arrow
                @click-left="onClickLeft"
        />
        <br/>
        <van-cell  title="修改昵称"  is-link @click="Click1"></van-cell>
        <van-cell  title="修改密码"  is-link @click="Click2"></van-cell>
        <div style="margin: 16px;">
            <van-button round block type="primary" @click="Click3">
                退出登录
            </van-button>
        </div>
        <nicknamechange></nicknamechange>
        <passwordchange></passwordchange>
    </div>
</template>

<script>
import { reactive,toRefs,onMounted,onUnmounted } from 'vue'
import nicknamechange from "@/components/nicknamechange";
import passwordchange from "@/components/passwordchange";
import emitter from "@/event";
import {Dialog} from "vant";
export default {
    name: "userconfig",
    components:{
        nicknamechange,
        passwordchange,
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
            Dialog.confirm({
                title: '警告',
                message: "你确定要退出吗？",
            }).then(() => {
                localStorage.removeItem("user");
                history.back();
            }).catch(()=>{

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