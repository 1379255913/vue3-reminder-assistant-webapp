<template>
    <van-dialog v-model:show="show" title="注册" confirmButtonText="取消">
        <van-form @submit="onSubmit()">
            <van-cell-group inset>
                <van-field
                        v-model="username"
                        name="用户名"
                        label="用户名"
                        placeholder="用户名"
                        :rules="[{ required: true, message: '请填写用户名' }]"
                />
                <van-field
                        v-model="nickname"
                        name="昵称"
                        label="昵称"
                        placeholder="昵称"
                        :rules="[{ required: true, message: '请填写昵称' }]"
                />
                <van-field
                        v-model="password1"
                        type="password"
                        name="密码"
                        label="密码"
                        placeholder="密码"
                        :rules="[{ required: true, message: '请填写密码' }]"
                />
                <van-field
                        v-model="password2"
                        type="password"
                        name="passwordcheck"
                        label="确认密码"
                        placeholder="再次输入密码"
                        :rules="[{ required: true, message: '请确认密码' }]"
                />
            </van-cell-group>
            <div style="margin: 16px;">
                <van-button round block type="default" native-type="submit">
                    <div v-show="!logining">注册</div><van-loading size="24px" v-show="logining">加载中...</van-loading>
                </van-button>
            </div>
        </van-form>
    </van-dialog>
</template>

<script>
import { reactive,toRefs,onMounted,onUnmounted } from  'vue'
import instance from "@/http";
import emitter from "@/event";
import {Dialog, Toast} from "vant";
export default {
    name: "login",
    setup(){
        const state = reactive({
            username : "",
            password1 : "",
            password2 : "",
            show : false,
            nickname : "",
            logining : false,
        })
        const onSubmit =()=>{
            state.logining = true;
            instance.post("/register",{
                "username" : state.username,
                "nickname" : state.nickname,
                "password_1" : state.password1,
                "password_2" : state.password2,
            }).then(res=>{
                console.log(res.data);
                if (res.data.code===200){
                    state.show = false;
                    Toast.success('注册成功');
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
        const passwordcheck =(value)=>{
            console.log(value);
            return value === state.password1;

        }
        onMounted(()=>{
            emitter.on("register",data=>{
                state.show = true;
            })
        })
        onUnmounted(()=>{
            emitter.off("register");
        })
        return{
            ...toRefs(state),
            onSubmit,
            passwordcheck
        }
    }
}
</script>

<style scoped>

</style>