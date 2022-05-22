<template>
    <div>
        <van-form @submit="onSubmit()">
            <van-nav-bar
                    title="药品批号"
                    left-text="返回"
                    left-arrow
                    @click-left="onClickLeft"
            />
            <br/>
            <van-cell-group inset>
                <van-field
                        v-model="value"
                        required
                        label="国药准字"
                        placeholder="请输入9位国药准字"
                        :rules="[{ required: true , message: '请输入国药准字' }]"
                />
            </van-cell-group>
            <div style="margin: 16px;">
                <van-button round block type="primary" native-type="submit">
                    <div v-show="!query">查询</div><van-loading size="24px" v-show="query">加载中...</van-loading>
                </van-button>
            </div>
        </van-form>
    </div>
</template>

<script>
    import {toRefs,reactive} from 'vue'
    import instance from "@/http";
    import {Dialog} from "vant";
    import emitter from "@/event";
    import {useRouter} from "vue-router";
    export default {
        setup(){
            const userRouter = useRouter();
            const state =reactive({
                query : false,
                value : ""
            })
            const onClickLeft=()=>{
                history.back();
                setTimeout(()=>{
                    emitter.emit("hidetabs","")
                },550)
            }
            const onSubmit=()=>{
                state.query = true;
                instance.post("/drug",{
                    'id' : state.value
                }).then(res =>{
                    let t = res.data.data;
                    if (t==="未找到相关记录"){
                        Dialog.alert({
                            title: '查询结果',
                            message: '未找到相关记录',
                        }).then(() => {
                        });
                    }
                    else {
                        let data = {
                            "information" : t,
                        };

                        userRouter.push("home");
                        setTimeout(()=>{
                            emitter.emit("objectcreate",data);
                        },530);
                        state.query = false;
                    }
                }).catch(function (error) {
                    state.query = false;
                    Dialog.alert({
                        title: '错误',
                        message: '服务器错误，请稍后再试',
                    }).then(() => {
                    });
                    console.log(error.message);
                });
            }
            return{
                ...toRefs(state),
                onClickLeft,
                onSubmit
            }
        }
    }
</script>

<style scoped>

</style>