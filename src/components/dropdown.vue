<template>
    <van-dropdown-menu active-color="#1989fa">
        <van-dropdown-item v-model="value" :options="options" @change="onConfirm3"/>
        <van-dropdown-item title="状态" ref="item">
            <van-cell center
                v-for="(item,index) in switches"
                :key="index"
                :title="item.name"
            >
                <template #right-icon>
                    <van-switch v-model="item.flag" size="24" />
                </template>
            </van-cell>
            <div style="padding: 5px 16px;">
                <van-button  block round @click="onConfirm">
                    确认
                </van-button>
            </div>
        </van-dropdown-item>
        <van-dropdown-item title="标签" ref="item2">
            <van-cell center
                      v-for="(item,index) in switches2"
                      :key="index"
                      :title="item.name"
            >
                <template #right-icon>
                    <van-switch v-model="item.flag" size="24" />
                </template>
            </van-cell>
            <div style="padding: 5px 16px;">
                <van-button  block round @click="onConfirm2">
                    确认
                </van-button>
            </div>
        </van-dropdown-item>
    </van-dropdown-menu>
</template>

<script>
    import { ref,reactive,toRefs,onMounted,onUnmounted } from 'vue';
    import emitter from "@/event";
    export default {
        setup() {
            const state = reactive({
                switches : [{
                    'name' : "最佳",
                    'flag' : true,
                },{
                    'name' : "临近过期",
                    'flag' : true,
                },{
                    'name' : "已过期",
                    'flag' : true,
                },
                ],
                switches2: [],
            })
            const item = ref(null);
            const item2 = ref(null);
            const value = ref(0);
            const switch1 = ref(false);
            const switch2 = ref(false);
            const options = [
                { text: '最近过期', value: 0 },
                { text: '物品名称', value: 1 },
                { text: '物品标签', value: 2 },
            ];
            const onConfirm = () => {
                item.value.toggle();
                let values = [];
                for (let i =0;i<state.switches.length;i++){
                    if (state.switches[i].flag===true){
                        values.push(state.switches[i].name);
                    }
                }
                let data={
                    "rule" : 1,
                    "value" : values
                }
                emitter.emit("newsortrules",data);
            };
            const onConfirm2 = () => {
                item2.value.toggle();
                let values = [];
                for (let i =0;i<state.switches2.length;i++){
                    if (state.switches2[i].flag===true){
                        values.push(state.switches2[i].id);
                    }
                }
                let data={
                    "rule" : 2,
                    "value" : values,
                }
                emitter.emit("newsortrules",data);
            };
            const onConfirm3 =(value)=>{
                let data={
                    "rule" : 0,
                    "value" : value
                }
                emitter.emit("newsortrules",data);
            }
            const init = ()=>{
                let t = JSON.parse(localStorage.getItem("tags"));
                for (let i=0; i<t.length ; i++){
                    state.switches2.push({
                        'name' :t[i].type,
                        'flag' :true,
                        'id' : t[i].id,
                    });
                }
            }
            onMounted(()=>{
                init()
            })
            return {
                ...toRefs(state),
                item,
                item2,
                value,
                switch1,
                switch2,
                options,
                onConfirm,
                onConfirm2,
                onConfirm3
            };
        },
    };
</script>

<style scoped>

</style>