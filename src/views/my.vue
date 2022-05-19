<template>
    <div>
        <van-cell></van-cell>
        <van-cell></van-cell>
        <van-cell is-link center>
        <van-row>
            <van-col span="2"></van-col>
            <van-col span="6"><van-icon name="user-circle-o" size="75px"/></van-col>
            <van-col span="14">
                <van-row >
                    <van-col span="22" v-show="logined" class="title1">{{ nickname }}</van-col>
                    <van-col span="7" v-show="!logined"><van-button type="primary" size="small" @click="login">登录</van-button></van-col>
                    <van-col span="7" v-show="!logined"><van-button type="primary" size="small" @click="register">注册</van-button></van-col>
                </van-row>

                <br/>
                <div>用户名:{{ username }}</div>
            </van-col>
            <van-col span="2" @click="clickuserconfig"></van-col>
        </van-row>
        </van-cell>
        <van-divider />
<!--        <van-cell icon="bullhorn-o" title="提醒与通知"  is-link ></van-cell>-->
        <van-cell icon="back-top" title="导出物品表格"  is-link to="/excelexport"></van-cell>
        <van-cell icon="down" title="批量导入物品"  is-link to="/csvimport"></van-cell>
        <van-cell icon="revoke" title="同步和恢复"  is-link @click="clicksync"></van-cell>
        <van-cell icon="question-o" title="帮助与反馈"  is-link to="/help"></van-cell>
        <login></login>
        <register></register>


    </div>
</template>

<script>
import {reactive,toRefs,onMounted,onUnmounted} from 'vue'
import emitter from "@/event";
import login from "@/components/login";
import register from "@/components/register";
import sync from "@/views/sync";
import {useRouter} from "vue-router";
import {Toast} from 'vant'
export default {
    name: "my",
    components : {
        login,
        register,
        sync
    },
    setup(){
        const userRouter = useRouter()
        const state = reactive({
            logined : false,
            nickname : "",
            username : "",
            token : ""
        })
        const login = ()=>{
            emitter.emit("login","");
        }
        const register = ()=>{
            emitter.emit("register","");
        }
        const clicksync = ()=>{
            let token = JSON.parse(localStorage.getItem('user'))
            if (token){
                userRouter.push("sync");
            } else {
                Toast("请先登录！");
            }

        }
        const clickuserconfig =()=>{
            let token = JSON.parse(localStorage.getItem('user'))
            if (token){
                userRouter.push("userconfig");
            } else {
                Toast("请先登录！");
            }

        }
        const onClickLeft =()=>{
            history.back();
        }
        const init=()=>{
            let t=JSON.parse(localStorage.getItem("user"));
            if (t){
                state.logined = true;
                state.nickname = t.nickname;
                state.username = t.username;
                state.token = t.token;
            }else {
                state.username = "未登录";
            }
        }
        onMounted(()=>{
            init();
            emitter.on("flashmy",data=>{
                init();
            });
            emitter.emit("tab","my");
        })
        return{
            ...toRefs(state),
            onClickLeft,
            login,
            register,
            clickuserconfig,
            clicksync
        }
    }
}
</script>

<style scoped>
.title1{
    font-size: 25px;
}
</style>