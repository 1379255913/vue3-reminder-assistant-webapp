<template>
    <van-dialog v-model:show="show" title="修改标签" confirmButtonText="取消">
    <van-form @submit="onSubmit()">
        <van-cell-group inset>
            <van-field
                    v-model="tagname"
                    name="标签名"
                    label="标签名"
                    placeholder="标签名"
                    :rules="[{ required: true, message: '请填写标签名称' }]"
                    maxlength="10"
            />
        </van-cell-group>
        <div style="margin: 16px;">
            <van-button round block type="default" native-type="submit">
                确认
            </van-button>
        </div>
    </van-form>
    </van-dialog>
</template>

<script>
import {reactive,toRefs ,onMounted,onUnmounted} from 'vue'
import emitter from "@/event";
export default {
    name: "tagschange",
    setup(){
        const state = reactive({
            tagname : "",
            show : false,
            id : ""
        })
        const onSubmit = ()=>{
            var t = JSON.parse(localStorage.getItem("tags"));
            for (let i=0; i<t.length ; i++){
                if (state.id===t[i].id) t[i].type=state.tagname;
            }
            localStorage.setItem("tags",JSON.stringify(t));
            emitter.emit("updatetags","");
            state.show = false;
        }
        onMounted(()=>{
            emitter.on("tagschange",data=>{
                state.show=true;
                state.tagname = data.type;
                state.id = data.id;
            })
        })
        onUnmounted(()=>{
            emitter.off("tagschange");
        })
        return{
            ...toRefs(state),
            onSubmit
        }
    }
}
</script>

<style scoped>

</style>