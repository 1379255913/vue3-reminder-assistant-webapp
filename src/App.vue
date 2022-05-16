<template>
    <div id="app">
        <router-view v-slot="{ Component }">
            <transition :name="transitionName">
                <component :is="Component" />
            </transition>
        </router-view>
    </div>
    <end v-show="show"></end>
</template>

<script>
import end from "@/components/end";
import { useRoute,onBeforeRouteUpdate } from 'vue-router';
import { watch,reactive,toRefs,onMounted,onUnmounted } from 'vue'
import emitter from "@/event";
export default {
    components:{
        end
    },
    setup() {
        const state = reactive({
            old_index : null,
            transitionName : '',
            show : true
        })
        const route = useRoute()

        watch(() => route.meta.index,(to, from) => {
            state.show = false;
            if (to < from) {
                // 动画从左到右
                state.transitionName = 'slide-left'
            } else if (to > from){
                state.transitionName = 'slide-right'
            } else {
                state.transitionName = ''

            }setTimeout(()=>{
                state.show =true;
                state.transitionName = ''
            },530)
            }

        )
        onMounted(()=>{
            emitter.on("hidetabs",data=>{
                state.show = false;
            })
        })
        onUnmounted(()=>{
            emitter.off("hidetabs")
        })
        return{
            ...toRefs(state)
        }
    },

}
</script>

<style>

#app {
    overflow-x: hidden; /** 为了避免动画过程中出现水平方向的滚动条 */
}
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
    will-change: transform;
    transition: transform .5s;
    height: 100%;
    width: 100%;
    top: 0;
    position: absolute;
    backface-visibility: hidden;

}

.slide-right-enter-from,
.slide-left-leave-to {
    transform: translateX(100%);
}

.slide-right-leave-to,
.slide-left-enter-from {
    transform: translateX(-100%);
}
</style>
