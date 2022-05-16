<template>
    <div>
    <van-calendar
            title="日历"
            :poppable="false"
            :show-confirm="false"
            :style="{ height: '500px' }"
            :min-date="min_date"
            :max-date="max_date"
            :formatter="formatter"
            @select="select"
            color="#1989fa"
    />
        <van-cell>
            <template #title>
                <span class="title1">{{ week }}</span><span class="title2">{{ date }}</span>
            </template>
            <template #value>
                <van-button type="primary" size="small" @click="onClickRight()">{{editname}}</van-button>
            </template>
        </van-cell>
        <van-collapse v-model="activeNames">
            <van-collapse-item :name="index"
                               v-for="(item,index) in dataList"
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
    import {reactive,toRefs,onMounted,onUnmounted} from 'vue'
    import moment from  "moment"
    import objectcreate from "@/components/objectcreate";
    import objectchange from "@/components/objectchange";
    import emitter from "@/event";
    import {Dialog} from "vant";
    export default {
        name: "calendar",
        components: {
            objectchange,
            objectcreate
        },
        setup(){
            const state = reactive({
                week : "",
                date : "",
                show : true,
                max_date :new Date(2025, 0, 1),
                min_date :new Date(2022, 0, 1),
                dataListStore : [],
                dataList : [],
                activeNames : [],
                isedit : false,
                editname : "修改",
                selectdate : new Date(),
            })
            const onClickRight = () => {
                if (state.isedit === true){
                    state.isedit = false;
                    state.editname = "修改";
                }else if (state.isedit === false){
                    state.isedit = true;
                    state.editname = "取消修改";
                }
            }
            const formatter = (day) => {
                const today = new Date();
                const year = day.date.getFullYear();
                const month = day.date.getMonth() + 1;
                const date = day.date.getDate();

                if (month === today.getMonth()+1&&date === today.getDate()&&year===today.getFullYear()) {
                        day.text = '今天';
                }
                // console.log(day.date)
                for (let i=0;i<state.dataListStore.length;i++){
                    if (datesAreOnSameDay(new Date(state.dataListStore[i].expiration_time),day.date)){
                        day.bottomInfo = "有过期";
                    } else if (datesAreOnSameDay(new Date(state.dataListStore[i].reminder_time),day.date)){
                        day.bottomInfo = "有提醒";
                    }
                }


                return day;
            };
            const datesAreOnSameDay = (first, second) =>
                first.getFullYear() === second.getFullYear() &&
                first.getMonth() === second.getMonth() &&
                first.getDate() === second.getDate();
            const select = (value)=>{
                state.dataList=[];
                state.date = moment(value.getTime()).format('YYYY年MM月DD日');
                state.week="星期"+"日一二三四五六".charAt(value.getDay());
                state.selectdate = value;
                const today = value;
                for (let i=0;i<state.dataListStore.length;i++){
                    let t1= new Date(state.dataListStore[i].expiration_time);
                    let t2= new Date(state.dataListStore[i].reminder_time);
                    if (datesAreOnSameDay(t1,today)||(datesAreOnSameDay(t2,today))){
                        state.dataList.push(state.dataListStore[i]);
                    }
                }
            }
            const edit =(index) =>{
                emitter.emit("objectchange",state.dataList[index]);
            }
            const create = () =>{
                emitter.emit("objectcreate","");
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
                        for (let i=0; i<state.dataList.length ; i++){
                            if (index===state.dataList[i].id) state.dataList.splice(i,1)
                        }
                        for (let i=0; i<state.dataListStore.length ; i++){
                            if (index===state.dataListStore[i].id) state.dataListStore.splice(i,1)
                        }
                    })
                    .catch(() => {
                        // on cancel
                    });

            }
            const init =()=>{
                let o = JSON.parse(localStorage.getItem("objects"));
                if (!o){
                    o=[];
                }
                state.dataListStore = o;
            }
            onMounted(()=>{
                state.date = moment(new Date().getTime()).format('YYYY年MM月DD日');
                state.week="星期"+"日一二三四五六".charAt(new Date().getDay());
                init();
                emitter.on("detail",data=>{
                    init();
                    select(state.selectdate);
                })
            })
            onUnmounted(()=>{
                emitter.off("detail")
            })
            return{
                ...toRefs(state),
                formatter,
                select,
                onClickRight,
                edit,
                deleted,
                create,
            }
        }

    }
</script>

<style scoped>
.title1{
    font-size: 16px;
    font-weight: bold;
}
.title2{
    font-size: 14px;
}
</style>