<template>
        <div class="tag-list" >
            <van-row justify="center">
                <van-col span="11"
                    v-for="(item,index) in tagList"
                    :key="item.id"
                    :class="currentIndex===index?`active${index}`:''"
                    @click="tagClick(index)"
                >
                    <div class="type">
                        <img :src="currentIndex===index?item.icon_active:item.icon" alt />
                        <p class="title">{{item.title}}</p>
                    </div>
                    <div class="count">{{item.child.length}}</div>
                </van-col>
            </van-row>
        </div>
</template>

<script>
import {reactive,toRefs,onUnmounted,onMounted} from "vue"
import {useRouter} from 'vue-router'
import emitter from "@/event";
import states from "@/state";
export default {
    setup() {
        const userRouter = useRouter()
        const state = reactive({
            tagList: [
                {
                    id: "quanbu",
                    title: "全部",
                    icon: require("../assets/jihuajindu.png"),
                    icon_active: require("../assets/jihuajindu_active.png"),
                    child: [],
                    done: []
                },
                {
                    id: "zuijia",
                    title: "最佳",
                    icon: require("../assets/quanbufenlei.png"),
                    icon_active: require("../assets/quanbufenlei_active.png"),
                    child: [],
                    done: []
                },

                {
                    id: "lingjinguoqi",
                    title: "临近过期",
                    icon: require("../assets/tixing.png"),
                    icon_active: require("../assets/tixing_active.png"),
                    child: [],
                    done: []
                },
                {
                    id: "yiguoqi",
                    title: "已过期",
                    icon: require("../assets/yiguoqi.png"),
                    icon_active: require("../assets/yiguoqi_active.png"),
                    child: [],
                    done: []
                }
            ],
            currentIndex: -1
        });
        const tagClick = index => {
            let data ={
                "type" : "state",
                "name" : state.tagList[index].title,
            }
            state.currentIndex = index;
            emitter.emit("tab","");
            userRouter.push({ name: 'detail', params: data});
            };
        onMounted(()=>{
            emitter.on("updatestate",data=>{
                let o = JSON.parse(localStorage.getItem("objects"));
                if (!o){
                    o=[];
                }
                for (let i=0;i<state.tagList.length;i++){
                    state.tagList[i].child=[];
                }
                for (let i=0;i<o.length;i++){
                    o[i].state = states(o[i].expiration_time,o[i].reminder_time);
                    if (o[i].state==="最佳"){
                        state.tagList[1].child.push(o[i]);
                    } else if (o[i].state==="临近过期"){
                        state.tagList[2].child.push(o[i]);
                    } else if (o[i].state==="已过期"){
                        state.tagList[3].child.push(o[i]);
                    }
                    state.tagList[0].child.push(o[i]);
                }
                localStorage.setItem("objects",JSON.stringify(o));
            })
            emitter.emit("updatestate","");
        })
        onUnmounted(()=>{
            emitter.off("updatestate");
        })
        return {
            ...toRefs(state),
            tagClick
        }
    }
}
</script>

<style lang="scss" scoped>
.tag-list {
    margin-top: 20px;
    text-align:center;
    margin:0 auto;
    .van-row {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .van-col {

            display: flex;
            justify-content: space-between;
            background: #fff;
            margin-bottom: 15px;
            border-radius: 8px;
            padding: 10px;
            box-sizing: border-box;
            .type {
                display: flex;
                flex-direction: column;
                img {
                    width: 24px;
                    height: 24px;
                }
                p {
                    font-size: 12px;
                    margin-top: 8px;
                    color: #6f6f6f;
                }
            }
            .count {
                color: #c0c0c0;
                font-weight: bold;
            }
            &.active0 {
                background: #4395d6;
                p {
                    color: #fff;
                }
                .count {
                    color: #fff;
                }
            }
            &.active1 {
                background: #137600;
                p {
                    color: #fff;
                }
                .count {
                    color: #fff;
                }
            }
            &.active2 {
                background: #f19951;
                p {
                    color: #fff;
                }
                .count {
                    color: #fff;
                }
            }
            &.active3 {
                background: #ff5f5f;
                p {
                    color: #fff;
                }
                .count {
                    color: #fff;
                }
            }
        }
    }
}
</style>