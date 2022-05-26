<template>
    <div id="app">
        <van-sticky>
            <van-row>
                <van-col span="21"><search @click="search()"></search></van-col>
                <van-col class="icon" span="3">
                    <div class="test">
                        <van-popover v-model:show="showPopover" :actions="actions" @select="onSelect" placement="bottom-end">
                            <template #reference>
                                <van-icon class="test" name="add-o" size="2rem"/>
                            </template>
                        </van-popover>
                    </div>
                </van-col>
            </van-row>
        </van-sticky>
        <notice></notice>
        <van-row justify="center">
            <van-col span="2"></van-col>
            <van-col span="20"><state></state></van-col>
            <van-col span="2"></van-col>
        </van-row>
        <tags></tags>
    <objectcreate></objectcreate>
    </div>
</template>

<script>
    import search from "@/components/search";
    import state from "@/components/state";
    import tags from "@/components/tags";
    import emitter from "@/event";
    import {toRefs,reactive,onMounted} from 'vue'
    import Objectcreate from "@/components/objectcreate";
    import {useRouter} from "vue-router";
    import notice from "@/components/notice";
    export default {
        name: "home",
        setup(){
            const userRouter = useRouter()
            const state =reactive({
                showPopover : false,
                actions : [
                    { text: '手动录入' },
                    { text: '化妆品查批号' },
                    { text: '扫条码' },
                    { text: '药品查批号' },
                ]
            })
            const onSelect =(action)=>{
                console.log(action.text)
                if (action.text==="手动录入")
                emitter.emit("objectcreate","");
                else if (action.text==="化妆品查批号"){
                    userRouter.push("querynumber");
                }else if (action.text==="扫条码"){
                    userRouter.push("scarn");
                    setTimeout(()=>{
                        emitter.emit("hidetabs","")
                    },550)
                } else if (action.text==="药品查批号"){
                    userRouter.push("drug");
                }
            }
            const search =()=>{
                userRouter.push("searchdetail");
                emitter.emit("tab","");
            }
            onMounted(()=>{
                emitter.emit("tab","home");
                }
            )
            return {
                ...toRefs(state),
                onSelect,
                search
            }
        },
        components: {
            Objectcreate,
            search,
            state,
            tags,
            notice
        },
    }
</script>

<style scoped>
.icon{

    background-color: white;
}
.test{
    line-height: 46px;
    text-align: center;
}
</style>