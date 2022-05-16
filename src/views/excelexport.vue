<template>
    <div>
        <van-nav-bar
                title="导出物品数据"
                left-text="返回"
                left-arrow
                @click-left="onClickLeft"
        />
        <br/>
        <van-cell title="排序方式" class="title1">
            <!-- 使用 title 插槽来自定义标题 -->
            <template #label>
                <van-radio-group v-model="sort_rules" direction="horizontal">
                    <van-radio name="1" icon-size="20" class="text1">最近过期</van-radio>
                    <van-radio name="2" icon-size="20" class="text1">物品名称</van-radio>
<!--                    <van-radio name="3" icon-size="20" class="text1">物品状态</van-radio>-->
                </van-radio-group>
            </template>
        </van-cell>
        <van-divider />
        <van-cell title="是否过期" class="title1">
            <!-- 使用 title 插槽来自定义标题 -->
            <template #label>
                <van-checkbox-group v-model="states" ref="checkboxGroup1" direction="horizontal">
                    <van-checkbox name="最佳" class="text1">最佳</van-checkbox>
                    <van-checkbox name="临近过期" class="text1">临近过期</van-checkbox>
                    <van-checkbox name="已过期" class="text1">已过期</van-checkbox>
                </van-checkbox-group>
                <br/>
                <van-row>
                    <van-col span="5"><van-button type="primary" @click="checkAll()" size="small">全选</van-button></van-col>
                    <van-col span="5"><van-button type="primary" @click="toggleAll()" size="small">反选</van-button></van-col>
                </van-row>

            </template>
        </van-cell>
        <van-divider />
        <van-cell title="标签" class="title1">
            <!-- 使用 title 插槽来自定义标题 -->
            <template #label>
                <van-checkbox-group v-model="tags" ref="checkboxGroup2" direction="horizontal">
                    <van-checkbox :name="item.id"
                                  v-for="item in tagslist"
                                  class="text1"
                    >{{ item.type }}</van-checkbox>
                </van-checkbox-group>
                <br/>
                <van-row>
                    <van-col span="5"><van-button type="primary" @click="checkAll2()" size="small">全选</van-button></van-col>
                    <van-col span="5"><van-button type="primary" @click="toggleAll2()" size="small">反选</van-button></van-col>
                </van-row>

            </template>
        </van-cell>
        <van-divider />
        <van-cell title="导出格式" class="title1">
            <!-- 使用 title 插槽来自定义标题 -->
            <template #label>
                <van-radio-group v-model="ways" direction="horizontal">
                    <van-radio name="1" icon-size="20" class="text1">通用文件 .csv</van-radio>
                    <van-radio name="2" icon-size="20" class="text1">EXCEL表格 .xlsx</van-radio>
                </van-radio-group>
            </template>
        </van-cell>
        <br/>
        <div style="margin: 16px;">
            <van-button round block type="primary" @click="exports">
                <div v-show="!query">导出</div><van-loading size="24px" v-show="query">加载中...</van-loading>
            </van-button>
        </div>
    </div>
</template>

<script>
import {reactive,toRefs,ref,onMounted} from 'vue'
import {Dialog} from "vant";
import emitter from "@/event";
import {firstBy} from "thenby"
import instance from "@/http";
export default {
    name: "excelexport",
    setup: function () {
        const state = reactive({
            sort_rules: "1",
            states: ["最佳", "临近过期", "已过期"],
            tags: [],
            tagslist: [],
            ans: [],
            ways: "1",
            query: false
        })
        const checkboxGroup1 = ref(null);
        const checkboxGroup2 = ref(null);
        const checkAll = () => {
            checkboxGroup1.value.toggleAll(true);
        }
        const toggleAll = () => {
            checkboxGroup1.value.toggleAll();
        }
        const checkAll2 = () => {
            checkboxGroup2.value.toggleAll(true);
            console.log(state.tags)
        }
        const toggleAll2 = () => {
            checkboxGroup2.value.toggleAll();
        }
        const init = () => {
            let t = JSON.parse(localStorage.getItem("tags"));
            if (!t) {
                t = [];
            }
            for (let i = 0; i < t.length; i++) {
                state.tagslist.push(t[i]);
            }
            state.tags = state.tagslist;
        }
        const onClickLeft = () => {
            history.back();
        }
        const exports = () => {
            let o = JSON.parse(localStorage.getItem("objects"));
            let ans = [];
            if (!o) {
                Dialog.alert({
                    title: '警告',
                    message: '没有物品可以导出',
                }).then(() => {
                });
            } else {
                for (let i = 0; i < o.length; i++) {
                    if (state.tags.indexOf(o[i].type_id) !== -1 && state.states.indexOf(o[i].state) !== -1) {
                        ans.push(o[i]);
                    }
                }
                if (state.sort_rules === "1") {
                    ans.sort(
                        firstBy("expiration_time", "asc")
                            .thenBy("reminder_time", "asc")
                    );
                } else if (state.sort_rules === "2") {
                    ans.sort(
                        firstBy("information", "asc")
                            .thenBy("expiration_time", "asc")
                    );
                }
                if (state.ways === "1") {
                    instance.post("/upload",{
                        "type" : 0,
                        "data" : ans
                    }).then(res=>{
                        console.log(res.data.data)
                        let a = document.createElement('a')
                        a.href = "http://k38j348217.zicp.vip/download/"+res.data.data+".csv"
                        document.body.appendChild(a)
                        a.click()
                        document.body.removeChild(a)
                    }).catch(function (error) {
                        state.query = false;
                        Dialog.alert({
                            title: '错误',
                            message: '服务器错误，请稍后再试',
                        }).then(() => {
                        });
                        console.log(error.message);
                    })
                    // let p = ["information", "manufacture_time", "fresh_time_number", "fresh_time_unit", "expiration_time",
                    //     "reminder_time", "state", "id", "type", "type_id"
                    // ];
                    // let csv = p.join(",") + "\n";
                    // for (let i = 0; i < ans.length; i++) {
                    //     p = [];
                    //     for (let item in ans[i]) {
                    //         p.push(ans[i][item])
                    //     }
                    //     csv += p.join(",");
                    //     csv += "\n";
                    // }
                    // let exportContent = "\uFEFF";
                    // let blob = new Blob([exportContent + csv], {type: 'text/plain;charset=utf-8'});
                    // try {
                    //     saveAs(blob, '物品数据导出.csv');
                    // } catch (e) {
                    //     Dialog.alert({
                    //         title: '错误',
                    //         message: '导出时发生错误'+e
                    //     }).then(() => {
                    //     });
                    // }
                } else if (state.ways === "2") {
                    instance.post("/upload",{
                        "type" : 1,
                        "data" : ans
                    }).then(res=>{
                        console.log(res.data.data)
                        let a = document.createElement('a')
                        a.href = "http://k38j348217.zicp.vip/download/"+res.data.data+".xlsx"
                        document.body.appendChild(a)
                        a.click()
                        document.body.removeChild(a)
                    })
                    // var option = {};
                    // try{
                    //     option.fileName = '物品数据导出';//导出文件名
                    //     option.datas = [
                    //         {
                    //             sheetData: ans,//JSON数据
                    //             sheetName: 'sheet1',//excle表默认标签
                    //             sheetFilter: ["information", "manufacture_time", "fresh_time_number", "fresh_time_unit", "expiration_time",
                    //                 "reminder_time", "state"
                    //             ],//过滤字段
                    //             sheetHeader: ['物品名', '生产日期', '保质期', '保质期单位', '过期日期', '提醒日期', '状态']//标题头
                    //         }
                    //     ];
                    //     var toExcel = new ExportJsonExcel(option);
                    //     toExcel.saveExcel();
                    // } catch (e) {
                    //     Dialog.alert({
                    //         title: '错误',
                    //         message: '导出时发生错误'+e,
                    //     }).then(() => {
                    //     });
                    // }

                }

            }
        }
        onMounted(() => {
            init();
            emitter.emit("tab","")
        })
        return {
            ...toRefs(state),
            checkboxGroup1,
            checkboxGroup2,
            checkAll,
            toggleAll,
            onClickLeft,
            toggleAll2,
            checkAll2,
            exports
        }
    }
}
</script>

<style scoped>
.title1{
    font-size: 20px;
}
.text1{
    font-size: 15px;
}
</style>