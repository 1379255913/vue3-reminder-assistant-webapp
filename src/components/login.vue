<template>
    <van-dialog v-model:show="show" title="登录" confirmButtonText="取消">
        <van-form @submit="onSubmit()">
            <van-cell-group inset>
                <van-field
                        v-model="username"
                        name="用户名"
                        label="用户名"
                        placeholder="用户名"
                        :rules="[{ required: true, message: '请填写用户名' }]"
                        maxlength="20"
                />

                <van-field
                        v-model="password"
                        type="password"
                        name="密码"
                        label="密码"
                        placeholder="密码"
                        :rules="[{ required: true, message: '请填写密码' }]"
                        maxlength="20"
                />
            </van-cell-group>
            <div style="margin: 16px;">
                <van-button round block type="default" native-type="submit">
                    <div v-show="!logining">登录</div><van-loading size="24px" v-show="logining">加载中...</van-loading>
                </van-button>
            </div>
        </van-form>
    </van-dialog>
</template>

<script>
import { reactive,toRefs,onMounted,onUnmounted } from  'vue'
import instance from "@/http";
import emitter from "@/event";
import {Dialog} from "vant";
export default {
    name: "login",
    setup(){
        const state = reactive({
            username : "",
            password : "",
            show : false,
            logining : false,
        })
        const onSubmit =()=>{
            state.logining = true;
            instance.post("/login",{
                "username" : state.username,
                "password" : state.password,
            }).then(res=>{
                console.log(res.data);
                if (res.data.code===200){
                    localStorage.setItem("user",JSON.stringify(res.data.data));
                    state.show = false;
                    emitter.emit("flashmy","")
                }else {
                    Dialog.alert({
                        title: '错误',
                        message: res.data.message,
                    }).then(() => {
                    });
                }
                state.logining = false;
            }).catch(function (error) {
                state.logining = false;
                Dialog.alert({
                    title: '错误',
                    message: '服务器错误，请稍后再试',
                }).then(() => {
                });
                console.log(error.message);
            })
        }
        onMounted(()=>{
            emitter.on("login",data=>{
                state.show = true;
            })
        })
        onUnmounted(()=>{
            emitter.off("login");
        })
        return{
            ...toRefs(state),
            onSubmit
        }
    }
}
</script>

<style scoped>

</style>