<template>
    <van-dialog v-model:show="show" title="修改物品" confirmButtonText="取消">
        <van-form @submit="onSubmit()">
            <van-cell-group inset>
                <van-field
                        v-model="tagname"
                        name="物品名"
                        label="物品名"
                        placeholder="物品名"
                        required
                        :rules="[{ required: true, message: '请填写物品名称' }]"
                />
                <van-field
                        v-model="manufacture_time_result"
                        is-link
                        readonly
                        name="datetimePicker"
                        label="生产日期"
                        placeholder="点击选择日期"
                        @click="showPicker = true"
                />
                <van-field name="stepper" label="保质期">
                    <template #input>
                        <van-stepper v-model="bzq" @change="change()" integer min="0" />
                        <van-button icon="arrow-down" icon-position="right" type="primary" size="small" @click="showPicker2=true">{{bzq_dw}}</van-button>
                    </template>
                </van-field>
                <van-field
                        v-model="expiration_time_result"
                        is-link
                        readonly
                        name="datetimePicker"
                        label="过期日期"
                        placeholder="自动计算或手动输入"
                        required
                        :rules="[{ required: true, message: '请选择过期日期' }]"
                        @click="showPicker3 = true"
                />
                <van-field
                        v-model="reminder_time"
                        is-link
                        readonly
                        name="reminder"
                        label="临期通知"
                        placeholder="提前多少天提醒"
                        required
                        :rules="[{ required: true, message: '请选择临期通知' }]"
                        @click="showPicker5 = true"
                />
                <van-field name="stepper" label="自定义天数" v-show="ismy">
                    <template #input>
                        <van-stepper v-model="myrem" integer/>
                        <van-button  type="primary" size="small">天</van-button>
                    </template>
                </van-field>
                <van-field
                        v-model="label"
                        is-link
                        readonly
                        name="标签"
                        label="标签"
                        placeholder="标签名"
                        required
                        :rules="[{ required: true, message: '请选择标签' }]"
                        @click="showPicker4 = true"
                />
                <van-popup v-model:show="showPicker" position="bottom" round>
                    <van-datetime-picker
                            type="date"
                            v-model = "manufacture_time"
                            @confirm="onConfirm"
                            @cancel="showPicker = false"
                    />
                </van-popup>
                <van-popup v-model:show="showPicker2" position="bottom" round>
                    <van-picker
                            :columns="columns"
                            @cancel="showPicker2 = false"
                            @confirm="onConfirm2"
                    />
                </van-popup>
                <van-popup v-model:show="showPicker3" position="bottom" round>
                    <van-datetime-picker
                            type="date"
                            v-model = "expiration_time"
                            @confirm="onConfirm3"
                            @cancel="showPicker3 = false"
                    />
                </van-popup>
                <van-popup v-model:show="showPicker4" position="bottom" round>
                    <van-picker
                            :columns= "labellist"
                            :columns-field-names="{ text: 'type', values: 'values', children: 'children' }"
                            @cancel="showPicker4 = false"
                            @confirm="onConfirm4"
                    />
                </van-popup>
                <van-popup v-model:show="showPicker5" position="bottom" round>
                    <van-picker
                            :columns= "reminderlist"
                            @cancel="showPicker5 = false"
                            @confirm="onConfirm5"
                    />
                </van-popup>
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
    import {Toast} from 'vant';
    import {onMounted, onUnmounted, reactive, toRefs} from 'vue'
    import emitter from "@/event";
    import states from "@/state";
    import moment from "moment"
    import randomid from "@/randomid";

    export default {
        name: "objectcreate",
        setup(){
            const state = reactive({
                id : "",
                classid : -1,
                tagname : "",
                label : "",
                ismy : false,
                show : false,
                showPicker :false,
                showPicker2 :false,
                showPicker3 :false,
                showPicker4 :false,
                showPicker5 :false,
                manufacture_time_result : "",
                manufacture_time :new Date(),
                expiration_time_result :"",
                expiration_time :new Date(),
                reminder_time : "",
                bzq : 0,
                myrem : 0,
                bzq_dw : "月",
                value1 :0,
                columns : ['年','月','日'],
                labellist : [],
                reminderlist : ["过期前1天","过期前3天","过期前5天","自定义天数"]
            })
            const onSubmit = ()=>{
                var t = JSON.parse(localStorage.getItem("objects"));
                var id
                var flag = true;
                var type
                const reminder_time = re_time()
                for (let i=0; i<state.labellist.length ; i++){
                    if (state.classid===state.labellist[i].id) type=state.labellist[i].type;
                }
                for (let i=0; i<t.length ; i++){
                    if (state.id===t[i].id) t.splice(i,1);
                }
                while (flag){
                    id = randomid();
                    flag=false;
                    for (let i=0; i<t.length ; i++){
                        if (id===t[i].id) flag= true;
                    }
                }
                t.push({
                    "information" : state.tagname,
                    "manufacture_time" : state.manufacture_time_result,
                    "fresh_time_number" : state.bzq,
                    "fresh_time_unit" :state.bzq_dw,
                    "expiration_time" :state.expiration_time_result,
                    "reminder_time" :reminder_time,
                    "state" : states(state.expiration_time_result,reminder_time),
                    "id" : id,
                    "type" : type,
                    "type_id": state.classid,
                });
                localStorage.setItem("objects",JSON.stringify(t));
                emitter.emit("updatetags","");
                emitter.emit("updatestate","");
                emitter.emit("detail","");
                Toast.success('修改成功');
                state.show = false;
            }
            const re_time = ()=>{
                var t = moment(state.expiration_time_result);
                var j;
                if (state.reminder_time==="过期前1天") j=1;
                else if (state.reminder_time==="过期前3天") j=3;
                else if (state.reminder_time==="过期前5天") j=5;
                else{
                    j=state.myrem;
                }
                t.subtract(j,"days");
                return t.format('YYYY-MM-DD');
            }
            const onConfirm = (value) => {
                var t = moment(value);
                state.manufacture_time_result = t.format('YYYY-MM-DD');
                if (state.bzq!==0){
                    if (state.bzq_dw==="年"){
                        t.add(state.bzq,"years")
                    }else if (state.bzq_dw==="月"){
                        t.add(state.bzq,"months")
                    }else if (state.bzq_dw==="日"){
                        t.add(state.bzq,"days")
                    }
                    state.expiration_time_result = t.format('YYYY-MM-DD');
                    state.expiration_time = new Date(state.expiration_time_result);
                }
                state.showPicker = false;
                // console.log(formatDates());
            }
            const onConfirm2 = (value) =>{
                state.bzq_dw=value;
                change();
                state.showPicker2 = false;
            }
            const onConfirm3 = (value) =>{
                var t = moment(value);
                state.expiration_time_result = t.format('YYYY-MM-DD');
                if (state.bzq!==0){
                    if (state.bzq_dw==="年"){
                        t.subtract(state.bzq,"years")
                    }else if (state.bzq_dw==="月"){
                        t.subtract(state.bzq,"months")
                    }else if (state.bzq_dw==="日"){
                        t.subtract(state.bzq,"days")
                    }
                    state.manufacture_time_result = t.format('YYYY-MM-DD');
                    state.manufacture_time = new Date(state.manufacture_time_result);
                }
                state.showPicker3 = false;
            }
            const onConfirm4 = (value) =>{
                state.classid = value.id;
                state.label=value.type;
                state.showPicker4 = false;
            }
            const onConfirm5 = (value) =>{
                state.reminder_time=value;
                state.ismy = value === "自定义天数";
                state.showPicker5 = false;
            }
            const change = ()=>{
                var t = moment(state.manufacture_time_result)
                if (state.bzq!==0){
                    if (state.bzq_dw==="年"){
                        t.add(state.bzq,"years")
                    }else if (state.bzq_dw==="月"){
                        t.add(state.bzq,"months")
                    }else if (state.bzq_dw==="日"){
                        t.add(state.bzq,"days")
                    }
                    state.expiration_time_result = t.format('YYYY-MM-DD');
                    state.expiration_time = new Date(state.expiration_time_result);
                }
            }
            onMounted(()=>{
                emitter.on("objectchange",data=>{
                    state.show=true;
                    state.tagname = "";
                    state.labellist=[];
                    var t = JSON.parse(localStorage.getItem("tags"));
                    for (let i=0; i<t.length ; i++){
                        state.labellist.push(t[i]);
                    }
                    state.manufacture_time_result = data.manufacture_time;
                    state.manufacture_time = new Date(data.manufacture_time);
                    state.expiration_time_result = data.expiration_time;
                    state.expiration_time = new Date(data.expiration_time);
                    state.bzq = data.fresh_time_number;
                    state.bzq_dw = data.fresh_time_unit;
                    state.tagname = data.information;
                    state.ismy = true;
                    let t1 = moment(data.expiration_time);
                    let t2 = moment(data.reminder_time);
                    state.myrem = t1.diff(t2, "days");
                    state.label = data.type;
                    state.reminder_time = "自定义天数";
                    state.classid = data.type_id;
                    state.id = data.id;
                })
            })
            onUnmounted(()=>{
                emitter.off("objectchange");
            })
            return{
                ...toRefs(state),
                onSubmit,
                onConfirm,
                onConfirm2,
                onConfirm3,
                onConfirm4,
                onConfirm5,
                change,
            }
        }
    }
</script>

<style scoped>

</style>