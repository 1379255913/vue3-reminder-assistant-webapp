<template>
    <van-dialog v-model:show="show" title="修改昵称" confirmButtonText="取消">
        <van-form @submit="onSubmit()">
            <van-cell-group inset>
                <van-field
                        v-model="nickname"
                        name="昵称"
                        label="昵称"
                        placeholder="昵称"
                        :rules="[{ required: true, message: '请填写昵称' }]"
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
    name: "nicknamechange",
    setup(){
        const state = reactive({
            show : false,
            nickname : "",
        })
        const onSubmit = ()=>{
            instance.post("/changenickname",{
                "nickname" : state.nickname ,
            },).then(res=>{
                console.log(res.data);
                if (res.data.code===200){
                    let t = JSON.parse(localStorage.getItem('user'));
                    t.nickname = res.data.data.nickname;
                    localStorage.setItem("user",JSON.stringify(t));
                    Toast("修改成功")
                    state.show = false;
                }else {
                    Dialog.alert({
                        title: '错误',
                        message: res.data.message,
                    }).then(() => {
                    });
                }

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
            emitter.on("nicknamechange",data=>{
                state.show = true;
            })
            let nickname = JSON.parse(localStorage.getItem('user'));
            if (nickname){
                state.nickname = nickname.nickname;
            }
        })
        onUnmounted(()=>{
            emitter.off("nicknamechange");
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