<template>
    <div>
        <van-sticky>
            <van-row>
                <van-col span="21"><van-search  v-model="value" placeholder="请输入搜索关键词" /></van-col>
                <van-col span="3" style="background-color: white;">
                    <div><van-icon name="close" size="2rem" style="color: #0a6fb3;line-height: 46px;" @click="onClickLeft()"/></div>
                </van-col>
            </van-row>
            <dropdown></dropdown>
        </van-sticky>
        <br/>
        <van-row v-show="DataList.length">
            <van-col span="2"></van-col>
            <van-col span="7" style="font-size: 20px">搜索结果</van-col>
            <van-col span="5"></van-col>
            <van-col span="5" ></van-col>
            <van-col span="5" >
                <van-button type="primary" size="small" @click="onClickRight()">{{editname}}</van-button>
            </van-col>
        </van-row>
        <van-empty v-show="!DataList.length&&value" description="没有找到结果" />
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
        <objectcreate></objectcreate>
        <objectchange></objectchange>
    </div>
</template>

<script>
    import {Dialog, Toast} from 'vant';
    import emitter from "@/event";
    import {toRefs,reactive,onMounted,onUnmounted,watch} from 'vue'
    import {useRoute} from 'vue-router'
    import {firstBy,thenBy} from "thenby"
    import objectchange from "@/components/objectchange";
    import dropdown from "@/components/dropdown";
    import states from "@/state";
    import objectcreate from "@/components/objectcreate";
    export default {
        components: {objectcreate,objectchange,dropdown},
        setup() {
            const userRouter = useRoute()
            const state = reactive({
                title : "",
                activeNames : [],
                DataList : [],
                DataListStore : [],
                isedit: false,
                editname : "修改",
                value: "",
                sortrules: 0,
                sortstates: ["最佳", "临近过期", "已过期"],
                sortstags: []
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
                        console.log(state.DataList);
                    })
                    .catch(() => {
                        // on cancel
                    });

            }
            watch (() => state.value,(to, from) => {
                newsearch();
            })
            const newsearch =()=>{
                state.DataList=[];
                if (state.value===""){
                }else {
                    for (let i =0;i<state.DataListStore.length;i++){
                        if (state.DataListStore[i].information.includes(state.value)&&state.sortstates.includes(state.DataListStore[i].state)&&state.sortstags.includes(state.DataListStore[i].type_id)){
                            state.DataList.push(state.DataListStore[i]);
                        }
                    }
                }
                if (state.sortrules===0){
                    state.DataList.sort(
                        firstBy("expiration_time", "asc")
                            .thenBy("reminder_time", "asc")
                    )
                } else if (state.sortrules===1){
                    state.DataList.sort(
                        firstBy("information", "asc")
                            .thenBy("expiration_time", "asc")
                    )
                } else if (state.sortrules===2){
                    state.DataList.sort(
                        firstBy("type", "asc")
                            .thenBy("expiration_time", "asc")
                    )
                }
            }
            const create = () =>{
                emitter.emit("objectcreate","");
            }
            const init =  () =>{
                let data=userRouter.params;
                state.DataList=[];
                state.title=data.name;
                let o = JSON.parse(localStorage.getItem("objects"));
                if (!o){
                    o=[];
                }
                let value = o
                value.sort(
                    firstBy("expiration_time","asc")
                        .thenBy("reminder_time","asc")
                )
                console.log(value);
                state.DataListStore = value;
                state.DataList=[];
                if (state.value===""){
                }else {
                    for (let i =0;i<state.DataListStore.length;i++){
                        if (state.DataListStore[i].information.includes(state.value)){
                            state.DataList.push(state.DataListStore[i]);
                        }
                    }
                }
            }
            onMounted(()=>{
                emitter.on("detail",data=>{
                    init();
                })
                emitter.on("newsortrules",data=>{
                    if (data.rule===0 ){
                        state.sortrules = data.value;
                    } else if(data.rule ===1){
                        state.sortstates = data.value;
                    } else if (data.rule ===2){
                        state.sortstags = data.value;
                    }
                    newsearch();
                })
                init();
                let t = JSON.parse(localStorage.getItem("tags"));
                for (let i=0; i<t.length ; i++){
                    state.sortstags.push(t[i].id);
                }
            })
            onUnmounted(()=>{
                emitter.off("detail");
                emitter.off("newsortrules");
            })
            return {
                ...toRefs(state),
                onClickLeft,
                onClickRight,
                deleted,
                create,
                edit,
            };
        },
    };
</script>

<style scoped>

</style>