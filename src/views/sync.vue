<template>
    <div>
        <van-nav-bar
                title="同步与恢复"
                left-text="返回"
                right-text="帮助"
                left-arrow
                @click-left="onClickLeft"
        />
        <br/>
        <van-cell title="同步" class="title1" >
            <!-- 使用 title 插槽来自定义标题 -->
            <template #label>
                <van-radio-group v-model="ways" direction="horizontal">
                    <van-radio name="1" icon-size="20" class="text1">同步本地数据到服务器</van-radio>
                    <van-radio name="2" icon-size="20" class="text1">同步服务器数据到本地</van-radio>
                </van-radio-group>
            </template>
        </van-cell>
        <van-divider />
        <div style="margin: 16px;">
            <van-button round block type="primary" @click="sync">
                <div v-show="!query">同步</div><van-loading size="24px" v-show="query">同步中...</van-loading>
            </van-button>
        </div>
    </div>
</template>

<script>
    import { toRefs,reactive,onUnmounted,onMounted } from 'vue'
    import emitter from "@/event";
    import instance from "@/http";
    import {Dialog,Toast} from "vant";
    import states from "@/state";
    export default {
        setup(){
            const state = reactive({
                ways : "1",
                query : false,
            })

            const sync=()=>{
                if (!state.query){
                    state.query=true;
                    if (state.ways==="1"){
                        let t = JSON.parse(localStorage.getItem("tags")) || [];
                        let o = JSON.parse(localStorage.getItem("objects")) || [];
                        instance.post("/upsync",{
                            "tags" : JSON.stringify(t),
                            "objects" : JSON.stringify(o),
                        }).then(res=>{
                            state.query = false;
                            console.log(res.data)
                            Toast("同步成功")
                        }).catch(function (error) {
                            state.query = false;
                            Dialog.alert({
                                title: '错误',
                                message: '服务器错误，请稍后再试',
                            }).then(() => {
                            });
                            console.log(error.message);
                        });
                    }else if (state.ways==="2"){
                        Dialog.confirm({
                            title: '警告',
                            message: '这个操作会覆盖你所有的记录，你确定要继续吗?',
                        }).then(() => {
                            instance.post("/downsync").then(res=>{
                                state.query = false;
                                console.log(res.data);
                                let tags = res.data.data.tags;
                                let objects = res.data.data.objects;
                                let o =[];
                                for (let i=0;i<objects.length;i++){
                                    o.push({
                                        "information" : objects[i].information,
                                        "manufacture_time" : objects[i].manufacture_time,
                                        "fresh_time_number" : objects[i].fresh_time_number,
                                        "fresh_time_unit" :objects[i].fresh_time_unit,
                                        "expiration_time" :objects[i].expiration_time,
                                        "reminder_time" : objects[i].reminder_time,
                                        "state" : objects[i].state,
                                        "id" : objects[i].id,
                                        "type" : objects[i].type,
                                        "type_id": objects[i].type_id,
                                    });
                                }
                                console.log(o);
                                let t=[]
                                for (let i=0;i<tags.length;i++){
                                    t.push({
                                        "type" : tags[i].type,
                                        "count" : tags[i].count,
                                        "id" : tags[i].id,
                                    });
                                }
                                console.log(t);
                                localStorage.setItem("tags",JSON.stringify(t));
                                localStorage.setItem("objects",JSON.stringify(o));
                                Toast("同步成功");
                            }).catch(function (error) {
                                state.query = false;
                                Dialog.alert({
                                    title: '错误',
                                    message: '服务器错误，请稍后再试',
                                }).then(() => {
                                });
                                console.log(error.message);
                            });
                        }).catch(()=>{

                        })

                    }
                    state.query = false;
                }

            }

            const onClickLeft = () => {
                history.back();
            }
            onMounted(()=>{
                emitter.emit("tab","")

            })
            return{
                ...toRefs(state),
                onClickLeft,
                sync
            }
        }
    }
</script>

<style scoped>
    .title1{
        font-size: 20px;
    }
</style>