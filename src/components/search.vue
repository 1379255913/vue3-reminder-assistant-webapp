<template>
    <van-search  v-model="value" placeholder="请输入搜索关键词" />
</template>

<script>
import {reactive, toRefs , onMounted} from "vue";
export default {
    setup(){
        const state = reactive({
            value:""
        })
        return{
            ...toRefs(state)
        }
    }
}
</script>

<style scoped>

</style>