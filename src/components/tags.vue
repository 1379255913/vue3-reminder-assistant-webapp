<template>
    <div class="task-list">
        <van-row>
            <van-col span="2"></van-col>
            <van-col span="4" style="font-size: 20px">标签</van-col>
            <van-col span="8"></van-col>
            <van-col span="5" ></van-col>
            <van-col span="5" >
                <van-button type="primary" size="small" @click="isedit()">{{editname}}</van-button>
            </van-col>
        </van-row>
        <br/>
        <van-cell-group inset>
            <van-cell :title=item.type icon="sign" :value="item.count"
            v-for="(item,index) in TagList"
            :key="index"
            @click="tagClick(index)"
            >
                <!-- 使用 right-icon 插槽来自定义右侧图标 -->
                <template #right-icon>
                    <van-button round type="default" size="small" icon="edit" v-show="isedited" @click="edit(item)"></van-button>
                    <van-button round type="default" size="small" icon="delete-o" v-show="isedited" @click="deleted(item.id)"></van-button>
                </template>
            </van-cell>
            <van-cell v-show="isedited" title="点击添加新标签" @click="create()">
            </van-cell>
        </van-cell-group>
    </div>
    <tagschange></tagschange>
</template>

<script>
    import {Dialog} from "vant"
    import {toRefs,reactive,onMounted,onUnmounted} from "vue"
    import tagschange from "@/components/tagschange";
    import tagscreate from "@/components/tagscreate";
    import emitter from "@/event";
    import {useRouter} from 'vue-router'
    export default {
        name: "tags",
        components:{
            tagschange,
            tagscreate
        },
        setup(){
            const userRouter = useRouter()
            const state = reactive({
                isedited : false,
                editname : "编辑",
                TagList : [],

            })
            const isedit=()=>{
                if (state.isedited===false){
                    state.isedited=!state.isedited;
                    state.editname="取消编辑";
                }else {
                    state.isedited=!state.isedited;
                    state.editname="编辑";
                }
            }
            const edit = (item)=>{
                emitter.emit("tagschange",item);
            }
            const create = ()=>{
                emitter.emit("tagscreate","");
            }
            const tagClick = index => {
                if (!state.isedited){
                let data ={
                    "type" : "tags",
                    "id" : state.TagList[index].id,
                    "name":state.TagList[index].type,
                }
                emitter.emit("tab","")
                userRouter.push({ name: 'detail', params: data});
            }};
            const deleted = (index)=>{
                Dialog.confirm({
                    title: '警告',
                    message:
                        '你确定要删除吗？',
                })
                    .then(() => {
                        var t = JSON.parse(localStorage.getItem("tags"));
                        for (let i=0; i<t.length ; i++){
                            if (index===t[i].id) t.splice(i,1);
                        }
                        localStorage.setItem("tags",JSON.stringify(t));
                        let o = JSON.parse(localStorage.getItem("objects"));
                        if (!o){
                            o=[];
                        }
                        for (let i=o.length-1;i>=0;i--){
                            if (index===o[i].type_id) o.splice(i,1);
                        }
                        localStorage.setItem("objects",JSON.stringify(o));
                        emitter.emit("updatetags","");
                        emitter.emit("updatestate","");
                    })
                    .catch(() => {
                        // on cancel
                    });

            }
            onMounted(()=>{
                emitter.on("updatetags",data=>{
                    var t = JSON.parse(localStorage.getItem("tags"));
                    var o = JSON.parse(localStorage.getItem("objects"));
                    if (!t){
                        t = [];
                    }
                    if (!o){
                        o = [];
                    }
                    for (let j=0; j<t.length ; j++){
                        t[j].count=0;
                    }
                    for (let i=0; i<o.length ; i++){
                        for (let j=0; j<t.length ; j++){
                            if(o[i].type_id ===t[j].id) {
                                t[j].count++;
                            }
                        }
                    }
                    localStorage.setItem("tags",JSON.stringify(t));
                    state.TagList = t
                })
                emitter.emit("updatetags","");
                }
            )
            onUnmounted(()=>{
                emitter.off("updatetags");
            })
            return{
                ...toRefs(state),
                isedit,
                edit,
                create,
                deleted,
                tagClick
            }
        }
    }
</script>

<style lang="scss" scoped>
    .task-list {
        position: relative;
        .title {
            font-size: 20px;
            color: #0059ff;
            float: right;
        }
        .list {
            margin-top: 15px;
            max-height: 500px;
            overflow-y: auto;
            li {
                cursor: pointer;
                position: relative;
                width: 100%;
                box-sizing: border-box;
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
                font-size: 14px;
                color: #313031;
                padding: 5px;
                padding-left: 28px;
                input {
                    width: 200px;
                    border-radius: 3px;
                    outline: none;
                    font-size: 12px;
                    padding-left: 5px;
                    box-sizing: border-box;
                    color: #606266;
                }
                &.active {
                    background-color: #ff8b00;
                    color: #fff;
                }
            }
            li:after {
                position: absolute;
                left: 0;
                top: 0px;
                content: "";
                width: 24px;
                height: 24px;
                background: url(../assets/woyaozuode.png) no-repeat;
                background-size: 100% 100%;
                border-radius: 100%;
            }
        }
        .add-todo {
            position: absolute;
            bottom: 0;
            left: 0;
            padding-left: 20px;
            font-size: 14px;
            cursor: pointer;
        }
        .add-todo:after {
            position: absolute;
            left: -4px;
            top: -2px;
            content: "";
            width: 20px;
            height: 20px;
            background: url(../assets/tianjia.png) no-repeat;
            background-size: 100% 100%;
        }
        .modify{
            float:  right;
            left: 0;
            top: 0px;
            content: "";
            width: 24px;
            height: 24px;
            background: url(../assets/modify.png) no-repeat;
            background-size: 100% 100%;
            border-radius: 100%;
        }
        .delete{
            float:  right;
            left: 0;
            top: 0px;
            content: "";
            width: 24px;
            height: 24px;
            background: url(../assets/delete.png) no-repeat;
            background-size: 100% 100%;
            border-radius: 100%;
        }
    }
</style>