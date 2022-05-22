<template>
    <van-dialog v-model:show="show" title="新增标签" confirmButtonText="取消">
        <van-form @submit="onSubmit()">
            <van-cell-group inset>
                <van-field
                        v-model="tagname"
                        name="标签名"
                        label="标签名"
                        placeholder="标签名"
                        :rules="[{ required: true, message: '请填写标签名称' }]"
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
    import randomid from "@/randomid";
    export default {
        name: "tagscreate",
        setup(){
            const state = reactive({
                tagname : "",
                show : false
            })
            const onSubmit = ()=>{
                var t = JSON.parse(localStorage.getItem("tags"));
                if (!t){
                    t = [];
                }
                var id
                var flag = true;
                while (flag){
                    id = randomid();
                    flag=false;
                    for (let i=0; i<t.length ; i++){
                        if (id===t[i].id) flag= true;
                    }
                }
                t.push({
                    "type" : state.tagname,
                    "count" : 0,
                    "id" : id,
                });
                localStorage.setItem("tags",JSON.stringify(t))
                emitter.emit("updatetags","");
                emitter.emit("newtagsinit","");
                state.show = false;
            }
            onMounted(()=>{
                emitter.on("tagscreate",data=>{
                    state.show=true;
                    state.tagname = "";
                })
            })
            onUnmounted(()=>{
                emitter.off("tagscreate")
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