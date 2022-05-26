<template>
    <van-notice-bar v-show="show"
            left-icon="volume-o" :scrollable="false" color="#1989fa" background="#ecf9ff" mode="closeable" @close="close">
        <van-swipe
                vertical
                class="notice-swipe"
                :autoplay="3000"
                :show-indicators="false"
        >
            <van-swipe-item
                v-for="(item) in NoticeList"
                :key="item.id"
            >{{ item.type+" " }}{{ item.information+" " }}{{ item.notice }}</van-swipe-item>
        </van-swipe>
    </van-notice-bar>

</template>

<script>
    import { toRefs,reactive,onMounted,onUnmounted } from 'vue'
    import emitter from "@/event";
    export default {
        name: "notice",
        setup(){
            const state = reactive({
                NoticeList : [],
                show : true,
            })
            const datesAreOnSameDay = (first, second) =>
                first.getFullYear() === second.getFullYear() &&
                first.getMonth() === second.getMonth() &&
                first.getDate() === second.getDate();
            const init =()=>{
                state.NoticeList = [];
                let o = JSON.parse(localStorage.getItem("objects")) || [];
                for (let i=0;i<o.length;i++){
                    if (datesAreOnSameDay(new Date(),new Date(o[i].expiration_time))) {
                        o[i].notice = "将在今天过期"
                        state.NoticeList.push(o[i]);
                    } else if ((datesAreOnSameDay(new Date(),new Date(o[i].reminder_time)))){
                        o[i].notice = "将在"+o[i].reminder_time+"过期"
                        state.NoticeList.push(o[i]);
                    }
                }
                let time = localStorage.getItem("notice");
                if (time){
                    let p = new Date(time);
                    if (p.valueOf()>new Date().valueOf()||state.NoticeList.length===0){
                        state.show = false;
                    }
                } else if (state.NoticeList.length===0){
                    state.show = false;
                }
            }
            const close = ()=>{
                localStorage.setItem("notice",new Date(new Date().setMonth(new Date().getHours()+6)).toISOString());
            }
            onMounted(()=>{
                init();
                emitter.on("updatetags",data=>{
                    init();
                })
            })
            onUnmounted(()=>{
                emitter.off("updatetags");
            })
            return{
                ...toRefs(state),
                close
            }
        }
    }
</script>

<style scoped>
.notice-swipe {
    height: 40px;
    line-height: 40px;
}
</style>