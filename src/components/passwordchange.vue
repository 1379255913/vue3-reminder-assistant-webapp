<template>
    <van-dialog v-model:show="show" title="修改密码" confirmButtonText="取消">
        <van-form @submit="onSubmit()">
            <van-cell-group inset>
                <van-field
                        v-model="old_password"
                        name="旧密码"
                        label="旧密码"
                        placeholder="旧密码"
                        type="password"
                        :rules="[{ required: true, message: '请填写旧密码' }]"
                />
                <van-field
                        v-model="password1"
                        name="新密码"
                        label="新密码"
                        placeholder="新密码"
                        type="password"
                        :rules="[{ required: true, message: '请填写新密码' }]"
                />
                <van-field
                        v-model="password2"
                        name="确认密码"
                        label="确认密码"
                        placeholder="再次填写新密码"
                        type="password"
                        :rules="[{ required: true, message: '请再次填写新密码' }]"
                />
            </van-cell-group>
            <div style="margin: 16px;">
                <van-button round block type="default" native-type="submit">
                    确认
                </van-button>
            </div>
        </van-form>
    </van-dialog>
</template>

<script>
    import { reactive,toRefs,onMounted,onUnmounted } from 'vue'
    import emitter from "@/event";
    import instance from "@/http";
    import {Dialog, Toast} from "vant";
    export default {
        setup(){
            const state = reactive({
                show : false,
                old_password : "",
                password1: "",
                password2 : "",
            })
            const onSubmit = ()=>{
                instance.post("/changepassword",{
                    "old_password" : state.old_password ,
                    "password1": state.password1,
                    "password2": state.password2,
                },).then(res=>{
                    console.log(res.data);
                    if (res.data.code===200){
                        Toast("修改密码成功")
                        state.show = false;
                    }else {
                        Dialog.alert({
                            title: '错误',
                            message: res.data.message,
                        }).then(() => {
                        });
                    }

                }).catch(function (error) {
                    Dialog.alert({
                        title: '错误',
                        message: '服务器错误，请稍后再试',
                    }).then(() => {
                    });
                    console.log(error.message);
                })
            }
            onMounted(()=>{
                emitter.on("passwordchange",data=>{
                    state.show = true;
                })
            })
            onUnmounted(()=>{
                emitter.off("passwordchange");
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