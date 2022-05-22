<template>
    <div>
        <van-nav-bar
                title="帮助与反馈"
                left-text="返回"
                left-arrow
                @click-left="onClickLeft"
        />
        <br/>
        <van-cell icon="info" title="说明书"  is-link @click="Click1"></van-cell>
        <van-cell icon="chat" title="我要反馈" is-link @click="Click0"></van-cell>
        <van-cell icon="qq" title="和我们聊一聊"  >
            <template #value>
                QQ:1379255913
            </template>
        </van-cell>
        <div style="margin: 16px;text-align:center">
            设计&开发:张三
        </div>
        <div style="margin: 16px;text-align:center">
            团队:藏羚羊
        </div>
        <returns></returns>
    </div>
</template>

<script>
    import { reactive,toRefs,onMounted,onUnmounted } from 'vue'
    import emitter from "@/event";
    import {Dialog} from "vant";
    import Returns from "@/components/returns";
    import {useRouter} from "vue-router";
    export default {
        name: "help",
        components:{
            Returns
        },
        setup(){
            const userRouter = useRouter()
            const state = reactive({

            })
            const onClickLeft = ()=>{
                userRouter.push('my')
            }
            const Click0 =()=>{
                emitter.emit("returns","https://support.qq.com/product/408368");
            }
            const Click1 = ()=>{
                emitter.emit("returns","https://support.qq.com/products/408368/faqs-more/");
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
                Click3,
                Click0
            }
        }
    }
</script>

<style scoped>

</style>