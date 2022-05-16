<template>
    <div>
    <van-nav-bar
            :title="title"
            left-text="返回"
            :right-text="editname"
            left-arrow
            @click-left="onClickLeft"
            @click-right="onClickRight"
    />
    <br/>
        <van-collapse v-model="activeNames">
            <van-collapse-item :name="index"
               v-for="(item,index) in DataList"
                :key="item.id"
            >
                <template #title>
                    <div>{{item.information}}</div>
                </template>
                <template #value>
                    <div><van-tag type="success" v-if="item.state==='最佳'">最佳</van-tag>
                        <van-tag type="warning" v-else-if="item.state==='临近过期'">即将过期</van-tag>
                        <van-tag type="danger" v-else-if="item.state==='已过期'">已过期</van-tag>
                        <van-button round type="default" size="small" icon="edit" v-show="isedit" @click="edit(index)"></van-button>
                        <van-button round type="default" size="small" icon="delete-o" v-show="isedit" @click="deleted(item.id)"></van-button>

                    </div>
                </template>
                <div>标签:{{ item.type }}</div>
                <div>状态:{{ item.state }}</div>
                <div v-if="item.manufacture_time">生产日期:{{ item.manufacture_time }}</div>
                <div v-if="item.fresh_time_number">保质期:{{ item.fresh_time_number }}{{ item.fresh_time_unit }}</div>
                <div>过期日期{{ item.expiration_time }}</div>
                <div>提醒日期{{ item.reminder_time }}</div>
            </van-collapse-item>
        </van-collapse>
        <van-cell v-show="isedit" title="点击添加新标签" @click="create()"></van-cell>
        <objectcreate></objectcreate>
        <objectchange></objectchange>
    </div>
</template>

<script>
    import {Dialog, Toast} from 'vant';
import emitter from "@/event";
import {toRefs,reactive,onMounted,onUnmounted} from 'vue'
import {useRoute} from 'vue-router'
import {firstBy,thenBy} from "thenby"
import objectchange from "@/components/objectchange";
import states from "@/state";
import objectcreate from "@/components/objectcreate";
export default {
    components: {objectcreate,objectchange},
    setup() {
        const userRouter = useRoute()
        const state = reactive({
            title : "",
            activeNames : [],
            DataList : [],
            isedit: false,
            editname : "修改"
        })
        const onClickLeft = () => history.back();
        const onClickRight = () => {
           if (state.isedit === true){
               state.isedit = false;
               state.editname = "修改";
           }else if (state.isedit === false){
               state.isedit = true;
               state.editname = "取消修改";
           }
        }
        const edit =(index) =>{
            emitter.emit("objectchange",state.DataList[index]);
        }
        const deleted = (index)=>{
            Dialog.confirm({
                title: '警告',
                message:
                    '你确定要删除吗？',
            })
                .then(() => {
                    var t = JSON.parse(localStorage.getItem("objects"));
                    for (let i=0; i<t.length ; i++){
                        if (index===t[i].id) t.splice(i,1);
                    }
                    localStorage.setItem("objects",JSON.stringify(t));
                    for (let i=0; i<state.DataList.length ; i++){
                        if (index===state.DataList[i].id) state.DataList.splice(i,1)
                    }
                })
                .catch(() => {
                    // on cancel
                });

        }
        const create = () =>{
            emitter.emit("objectcreate","");
        }
        const init =  () =>{
            let data=userRouter.params;
            state.DataList=[];
            state.title=data.name;
            let o = JSON.parse(localStorage.getItem("objects"));
            let value = []
            if (!o){
                o=[];
            }
            if (data.type==="state"){
                if (data.name==="全部") value=o;
                else {
                for (let i=0;i<o.length;i++){
                    if (o[i].state===data.name){
                        value.push(o[i]);
                    }
                }}
            }else if(data.type==="tags"){
                for (let i=0;i<o.length;i++){
                    if (o[i].type_id===data.id){
                        value.push(o[i]);
                    }
                }}
            value.sort(
                firstBy("expiration_time","asc")
                    .thenBy("reminder_time","asc")
            )
            state.DataList = value;
            }
        onMounted(()=>{
            emitter.on("detail",data=>{
                init();
            })
            init();
        })
        onUnmounted(()=>{
            emitter.off("detail")
        })
        return {
            ...toRefs(state),
            onClickLeft,
            onClickRight,
            deleted,
            create,
            edit
        };
    },
};
</script>

<style scoped>

</style>